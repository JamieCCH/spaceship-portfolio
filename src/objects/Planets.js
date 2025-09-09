import * as THREE from 'three'
import { PLANET_POSITIONS } from '../utils/Constants.js'

export class Planets {
    constructor(scene, modelLoader, collisionDetector = null) {
        this.scene = scene
        this.modelLoader = modelLoader
        this.collisionDetector = collisionDetector
        this.planets = []
        this.planetRadii = [] // Store collision radii for each planet
        this.init()
    }

    async init() {
        await this.loadPlanets()
    }

    async loadPlanets() {
        for(let i = 1; i <= 6; i++) { // Load all 6 planet GLB files
            try {
                const gltf = await this.modelLoader.loadModel(
                    `models/Planet${i}.glb`,
                    null,
                    () => this.createFallbackPlanet(i)
                )
                
                const planet = gltf.scene || gltf
                const radius = this.setupPlanet(planet, i - 1)
                this.planets.push(planet)
                this.planetRadii.push(radius)
                
                // Register with collision detector if available
                if (this.collisionDetector) {
                    this.collisionDetector.addCollider(planet, radius, planet.position)
                }
                
                console.log(`🪐 Planet ${i} loaded with collision radius: ${radius}!`)
            } catch (error) {
                console.error(`Error loading planet ${i}:`, error)
                const fallback = this.createFallbackPlanet(i)
                const radius = this.setupPlanet(fallback, i - 1)
                this.planets.push(fallback)
                this.planetRadii.push(radius)
                
                // Register fallback planet with collision detector
                if (this.collisionDetector) {
                    this.collisionDetector.addCollider(fallback, radius, fallback.position)
                }
            }
        }
    }

    createFallbackPlanet(index) {
        const planetGeometry = new THREE.SphereGeometry(25, 32, 16)
        
        // Create different planet types based on index
        let planetMaterial
        switch(index % 6) {
            case 1: // Earthy planet
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(0.2, 0.6, 0.8) // Blue-ish
                })
                break
            case 2: // Mars-like planet
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(0.8, 0.4, 0.2) // Reddish
                })
                break
            case 3: // Gas giant
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(0.9, 0.8, 0.3) // Yellowish
                })
                break
            case 4: // Purple alien planet
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(0.6, 0.2, 0.8) // Purple
                })
                break
            case 5: // Green planet
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(0.2, 0.8, 0.4) // Green
                })
                break
            case 0: // Orange planet
            default:
                planetMaterial = new THREE.MeshLambertMaterial({ 
                    color: new THREE.Color(0.9, 0.5, 0.1) // Orange
                })
                break
        }
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial)
        console.log(`Creating placeholder planet ${index} with unique coloring...`)
        return planet
    }

    setupPlanet(planet, index) {
        const baseScale = 12 + Math.random() * 8 // Reduced from 20-45 to 12-20
        planet.scale.setScalar(baseScale)
        
        const pos = PLANET_POSITIONS[index]
        planet.position.set(pos.x, pos.y, pos.z)
        
        planet.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        
        this.scene.addObject(planet)
        
        // Calculate collision radius based on scale and estimated model size
        // Reduced collision radii to prevent overlapping
        let collisionRadius
        if (index === 1) { // Planet2 (Saturn)
            collisionRadius = baseScale * 1.0 // Reduced for Saturn
        } else {
            collisionRadius = baseScale * 1.2 // Reduced for other planets
        }
        
        return collisionRadius
    }

    update() {
        // Rotate planets
        this.planets.forEach((planet, index) => {
            if (planet) {
                if (index === 1) { // Planet2 (Saturn) - has tilted axis in model
                    // Try a combination of Y and Z rotation for more natural Saturn spin
                    planet.rotation.y += 0.008 // Primary rotation
                    planet.rotation.z += 0.002 // Secondary tilt rotation
                } else {
                    // Other planets rotate normally
                    planet.rotation.y += 0.005 + (index * 0.002) // Y-axis rotation
                    planet.rotation.x += 0.001 // X-axis tilt for variety
                }
                
                // Update collision detector position if it moved (planets don't move, but just in case)
                if (this.collisionDetector) {
                    this.collisionDetector.updateColliderPosition(planet, planet.position)
                }
            }
        })
    }

    getPlanets() {
        return this.planets
    }

    getPlanetRadii() {
        return this.planetRadii
    }
}
