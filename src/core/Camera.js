import * as THREE from 'three'
import { SPACESHIP_CONFIG } from '../utils/Constants.js'

export class Camera {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 2000) // Wider FOV to see all planets
        this.setupEventListeners()
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
        })
    }

    update(spaceshipPhysics, crosshairDirection = { x: 0, y: 0 }) {
        // Camera positioned to show spaceship at bottom of viewport
        const spaceshipPos = spaceshipPhysics.getPosition()
        const spaceshipRotation = spaceshipPhysics.getRotation()
        
        // Calculate the position behind the spaceship
        const behindDistance = SPACESHIP_CONFIG.behindDistance * 1.2 // Slightly further back for wider view
        const heightOffset = 25 // Moderate height to show ship in bottom portion
        const minDistance = 5 // Minimum distance to prevent ship going behind camera
        
        // Use only the horizontal rotation (yaw) for camera positioning
        const directionX = Math.sin(spaceshipRotation)
        const directionZ = Math.cos(spaceshipRotation)
        
        // Calculate camera to ship distance to prevent ship going behind camera
        const currentDistance = this.camera.position.distanceTo(spaceshipPos)
        const adjustedBehindDistance = Math.max(minDistance, 
            currentDistance < minDistance ? minDistance : behindDistance)
        
        // Base camera position (fixed behind the ship with minimum distance)
        const baseCameraPosition = new THREE.Vector3(
            spaceshipPos.x - directionX * adjustedBehindDistance,
            spaceshipPos.y + heightOffset, // Reduced height for closer view
            spaceshipPos.z - directionZ * adjustedBehindDistance
        )
        
        // Add subtle panning based on crosshair position
        const panRange = 3 // Reduced panning for more stability and closer view
        const panOffset = new THREE.Vector3(
            crosshairDirection.x * panRange, // Pan left/right
            -crosshairDirection.y * panRange * 0.2, // Minimal vertical panning
            0 // No forward/back panning
        )
        
        const finalCameraPosition = baseCameraPosition.add(panOffset)
        
        // Smooth camera movement with faster response for closer view
        this.camera.position.lerp(finalCameraPosition, 0.08)
        
        // Look ahead of the ship like typical space shooters
        const lookAheadDistance = 25 // Look ahead for space shooter feel
        const lookTarget = new THREE.Vector3(
            spaceshipPos.x + directionX * lookAheadDistance,
            spaceshipPos.y + 2, // Look slightly above ship level
            spaceshipPos.z + directionZ * lookAheadDistance
        )
        
        this.camera.lookAt(lookTarget)
    }

    getCamera() {
        return this.camera
    }
}
