import * as THREE from 'three'
import { PLANET_POSITIONS } from '../utils/Constants.js'

export class Planets {
    constructor(scene, modelLoader) {
        this.scene = scene
        this.modelLoader = modelLoader
        this.planets = []
        this.init()
    }

    async init() {
        await this.loadPlanets()
    }

    async loadPlanets() {
        for(let i = 1; i <= 3; i++) {
            try {
                const gltf = await this.modelLoader.loadModel(
                    `models/Planet${i}.glb`,
                    null,
                    () => this.createFallbackPlanet(i)
                )
                
                const planet = gltf.scene || gltf
                this.setupPlanet(planet, i - 1)
                this.planets.push(planet)
                
                console.log(`🪐 Planet ${i} loaded!`)
            } catch (error) {
                console.error(`Error loading planet ${i}:`, error)
                const fallback = this.createFallbackPlanet(i)
                this.setupPlanet(fallback, i - 1)
                this.planets.push(fallback)
            }
        }
    }

    createFallbackPlanet(index) {
        const planetGeometry = new THREE.SphereGeometry(25, 32, 16)
        const planetMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
        })
        const planet = new THREE.Mesh(planetGeometry, planetMaterial)
        console.log(`Creating placeholder planet ${index}...`)
        return planet
    }

    setupPlanet(planet, index) {
        const scale = 20 + Math.random() * 25
        planet.scale.setScalar(scale)
        
        const pos = PLANET_POSITIONS[index]
        planet.position.set(pos.x, pos.y, pos.z)
        
        planet.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        
        this.scene.addObject(planet)
    }

    update() {
        // Rotate planets
        this.planets.forEach((planet, index) => {
            if (planet) {
                planet.rotation.y += 0.005 + (index * 0.002)
                planet.rotation.x += 0.001
            }
        })
    }

    getPlanets() {
        return this.planets
    }
}
