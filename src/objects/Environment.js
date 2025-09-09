import * as THREE from 'three'
import { LIGHTING_CONFIG } from '../utils/Constants.js'

export class Environment {
    constructor(scene) {
        this.scene = scene
        this.lights = {}
        this.init()
    }

    init() {
        this.createLights()
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(
            LIGHTING_CONFIG.ambientLight.color, 
            LIGHTING_CONFIG.ambientLight.intensity
        )
        this.scene.addObject(ambientLight)

        // Directional light
        const directionalLight = new THREE.DirectionalLight(
            LIGHTING_CONFIG.directionalLight.color, 
            LIGHTING_CONFIG.directionalLight.intensity
        )
        const dirPos = LIGHTING_CONFIG.directionalLight.position
        directionalLight.position.set(dirPos.x, dirPos.y, dirPos.z)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = LIGHTING_CONFIG.directionalLight.shadowMapSize
        directionalLight.shadow.mapSize.height = LIGHTING_CONFIG.directionalLight.shadowMapSize
        this.scene.addObject(directionalLight)

        // Point light 1
        const pointLight1 = new THREE.PointLight(
            LIGHTING_CONFIG.pointLight1.color,
            LIGHTING_CONFIG.pointLight1.intensity,
            LIGHTING_CONFIG.pointLight1.distance
        )
        const p1Pos = LIGHTING_CONFIG.pointLight1.position
        pointLight1.position.set(p1Pos.x, p1Pos.y, p1Pos.z)
        this.scene.addObject(pointLight1)
        this.lights.pointLight1 = pointLight1

        // Point light 2
        const pointLight2 = new THREE.PointLight(
            LIGHTING_CONFIG.pointLight2.color,
            LIGHTING_CONFIG.pointLight2.intensity,
            LIGHTING_CONFIG.pointLight2.distance
        )
        const p2Pos = LIGHTING_CONFIG.pointLight2.position
        pointLight2.position.set(p2Pos.x, p2Pos.y, p2Pos.z)
        this.scene.addObject(pointLight2)
        this.lights.pointLight2 = pointLight2
    }

    update() {
        // Animate lights
        const time = Date.now() * 0.001
        
        if (this.lights.pointLight1) {
            this.lights.pointLight1.position.x = Math.cos(time * 0.5) * 150
            this.lights.pointLight1.position.z = Math.sin(time * 0.5) * 150
        }
        
        if (this.lights.pointLight2) {
            this.lights.pointLight2.position.x = Math.sin(time * 0.3) * 100
            this.lights.pointLight2.position.y = Math.cos(time * 0.4) * 50
        }
    }
}
