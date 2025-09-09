import * as THREE from 'three'
import { SPACESHIP_CONFIG } from '../utils/Constants.js'

export class Camera {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
        this.setupEventListeners()
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
        })
    }

    update(spaceshipPhysics) {
        // Camera always stays behind the spaceship
        const spaceshipPos = spaceshipPhysics.getPosition()
        const spaceshipRotation = spaceshipPhysics.getRotation()
        
        // Calculate the position behind the spaceship based on its rotation
        const behindDistance = SPACESHIP_CONFIG.behindDistance
        const heightOffset = SPACESHIP_CONFIG.heightOffset
        
        // Position camera behind the spaceship
        const cameraPosition = new THREE.Vector3(
            spaceshipPos.x - Math.sin(spaceshipRotation) * behindDistance,
            spaceshipPos.y + heightOffset,
            spaceshipPos.z - Math.cos(spaceshipRotation) * behindDistance
        )
        
        // Smooth camera movement
        this.camera.position.lerp(cameraPosition, 0.08)
        
        // Always look at the spaceship with slight forward bias
        const lookTarget = spaceshipPos.clone()
        const forwardBias = new THREE.Vector3(
            Math.sin(spaceshipRotation) * 15,
            0,
            Math.cos(spaceshipRotation) * 15
        )
        lookTarget.add(forwardBias)
        
        this.camera.lookAt(lookTarget)
    }

    getCamera() {
        return this.camera
    }
}
