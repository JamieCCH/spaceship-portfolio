import * as THREE from 'three'
import { PLATFORM_CONFIG, PLANET_POSITIONS } from '../utils/Constants.js'

export class Platforms {
    constructor(scene) {
        this.scene = scene
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
            
            // Generate position that doesn't overlap with planets
            let position
            let attempts = 0
            const maxAttempts = 50
            
            do {
                position = {
                    x: (Math.random() - 0.5) * PLATFORM_CONFIG.spreadRange,
                    y: -Math.random() * (PLATFORM_CONFIG.minY - PLATFORM_CONFIG.maxY) + PLATFORM_CONFIG.maxY,
                    z: (Math.random() - 0.5) * PLATFORM_CONFIG.spreadRange
                }
                attempts++
            } while (this.isOverlappingWithPlanets(position) && attempts < maxAttempts)
            
            // If we couldn't find a good position after many attempts, 
            // place it in a safe zone far from planets
            if (attempts >= maxAttempts) {
                position = {
                    x: (Math.random() - 0.5) * 200 - 400, // Far to the left
                    y: -Math.random() * (PLATFORM_CONFIG.minY - PLATFORM_CONFIG.maxY) + PLATFORM_CONFIG.maxY,
                    z: (Math.random() - 0.5) * 200
                }
            }
            
            platform.position.set(position.x, position.y, position.z)
            platform.castShadow = true
            platform.receiveShadow = true
            
            this.platforms.push(platform)
            this.scene.addObject(platform)
        }
    }

    isOverlappingWithPlanets(position) {
        const minDistance = 100 // Minimum distance from planet center
        
        for (const planetPos of PLANET_POSITIONS) {
            const distance = Math.sqrt(
                Math.pow(position.x - planetPos.x, 2) +
                Math.pow(position.z - planetPos.z, 2)
            )
            
            if (distance < minDistance) {
                return true
            }
        }
        
        return false
    }

    getPlatforms() {
        return this.platforms
    }
}
