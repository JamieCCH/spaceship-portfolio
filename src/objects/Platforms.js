import * as THREE from 'three'
import { PLATFORM_CONFIG, PLANET_POSITIONS, SPACESHIP_CONFIG } from '../utils/Constants.js'

export class Platforms {
    constructor(scene, collisionDetector = null) {
        this.scene = scene
        this.collisionDetector = collisionDetector
        this.platforms = []
        this.init()
    }

    init() {
        this.createPlatforms()
    }

    createPlatforms() {
        for(let i = 0; i < 5; i++) {
            const platformGeometry = new THREE.BoxGeometry(
                PLATFORM_CONFIG.geometry.width,
                PLATFORM_CONFIG.geometry.height,
                PLATFORM_CONFIG.geometry.depth
            )
            const platformMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(i * 0.2, 0.5, 0.3),
                transparent: true,
                opacity: 0.8
            })
            const platform = new THREE.Mesh(platformGeometry, platformMaterial)
            
            // Generate position that doesn't overlap with planets or spaceship
            let position
            let attempts = 0
            const maxAttempts = 50
            
            do {
                position = {
                    x: (Math.random() - 0.5) * PLATFORM_CONFIG.spreadRange,
                    y: PLATFORM_CONFIG.maxY - Math.random() * (PLATFORM_CONFIG.maxY - PLATFORM_CONFIG.minY), // Always below spaceship
                    z: Math.random() * PLATFORM_CONFIG.spreadRange + 50 // Spread in front of spaceship starting from z=50
                }
                attempts++
            } while (this.isOverlappingWithObjects(position) && attempts < maxAttempts)
            
            // If we couldn't find a good position after many attempts, 
            // place it in a safe zone far from planets and spaceship
            if (attempts >= maxAttempts) {
                position = {
                    x: (Math.random() - 0.5) * 200 - 400, // Far to the left
                    y: PLATFORM_CONFIG.maxY - Math.random() * 20, // Definitely below spaceship
                    z: (Math.random() - 0.5) * 200
                }
            }
            
            platform.position.set(position.x, position.y, position.z)
            platform.castShadow = true
            platform.receiveShadow = true
            
            // Register platform with collision detector
            if (this.collisionDetector) {
                const platformRadius = Math.max(
                    PLATFORM_CONFIG.geometry.width,
                    PLATFORM_CONFIG.geometry.depth
                ) / 2 + 5 // Half the largest dimension + safety margin
                this.collisionDetector.addCollider(platform, platformRadius, platform.position)
            }
            
            this.platforms.push(platform)
            this.scene.addObject(platform)
        }
    }

    isOverlappingWithObjects(position) {
        // Check overlap with planets
        if (this.isOverlappingWithPlanets(position)) {
            return true
        }
        
        // Check overlap with spaceship starting area
        if (this.isOverlappingWithSpaceship(position)) {
            return true
        }
        
        return false
    }

    isOverlappingWithPlanets(position) {
        const minDistanceFromPlanet = 100 // Minimum distance from planet center
        
        for (const planetPos of PLANET_POSITIONS) {
            const distance = Math.sqrt(
                Math.pow(position.x - planetPos.x, 2) +
                Math.pow(position.z - planetPos.z, 2)
            )
            
            if (distance < minDistanceFromPlanet) {
                return true
            }
        }
        
        return false
    }

    isOverlappingWithSpaceship(position) {
        const minDistanceFromSpaceship = 80 // Minimum distance from spaceship starting position
        const spaceshipPos = SPACESHIP_CONFIG.initialPosition
        
        const distance = Math.sqrt(
            Math.pow(position.x - spaceshipPos.x, 2) +
            Math.pow(position.z - spaceshipPos.z, 2)
        )
        
        // Also ensure platform is well below spaceship (Y position check)
        const minVerticalClearance = 15 // Minimum vertical distance below spaceship
        const isAboveSpaceship = position.y > (spaceshipPos.y - minVerticalClearance)
        
        return distance < minDistanceFromSpaceship || isAboveSpaceship
    }

    getPlatforms() {
        return this.platforms
    }
}
