import * as THREE from 'three'
import { PLATFORM_CONFIG } from '../utils/Constants.js'

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
            
            platform.position.set(
                (Math.random() - 0.5) * PLATFORM_CONFIG.spreadRange,
                -Math.random() * (PLATFORM_CONFIG.minY - PLATFORM_CONFIG.maxY) + PLATFORM_CONFIG.maxY,
                (Math.random() - 0.5) * PLATFORM_CONFIG.spreadRange + 200
            )
            platform.castShadow = true
            platform.receiveShadow = true
            
            this.platforms.push(platform)
            this.scene.addObject(platform)
        }
    }

    getPlatforms() {
        return this.platforms
    }
}
