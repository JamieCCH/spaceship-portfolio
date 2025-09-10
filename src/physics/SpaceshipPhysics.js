import * as THREE from 'three'
import { SPACESHIP_CONFIG } from '../utils/Constants.js'

export class SpaceshipPhysics {
    constructor() {
        this.initialPosition = new THREE.Vector3(
            SPACESHIP_CONFIG.initialPosition.x,
            SPACESHIP_CONFIG.initialPosition.y,
            SPACESHIP_CONFIG.initialPosition.z
        )
        this.position = this.initialPosition.clone()
        this.initialRotation = SPACESHIP_CONFIG.initialRotation
        this.rotation = this.initialRotation
        this.targetRotation = this.initialRotation // Target rotation for smooth interpolation
        
        this.speed = 0
        this.acceleration = SPACESHIP_CONFIG.acceleration
        this.maxSpeed = SPACESHIP_CONFIG.maxSpeed
        this.deceleration = SPACESHIP_CONFIG.deceleration
        this.turnSpeed = SPACESHIP_CONFIG.turnSpeed
        
        this.velocity = new THREE.Vector3()
        this.banking = 0
        this.wheelAngle = 0
        this.bankingTarget = 0
        this.wheelAngleTarget = 0
        
        this.pitch = 0 // Vertical rotation for 3D flight
        this.targetPitch = 0 // Target pitch for smooth interpolation
        this.defaultPitch = -0.1 // Default slight upward tilt since ship is positioned lower
        this.maxPitch = Math.PI / 4 // Maximum vertical tilt angle (45 degrees)
        this.maxTurnAngle = Math.PI / 4 // Maximum horizontal turn angle (45 degrees)
        
        this.collisionDetector = null
        this.collisionRadius = 4
    }

    setCollisionDetector(collisionDetector) {
        this.collisionDetector = collisionDetector
    }

    update(keys, crosshairDirection = { x: 0, y: 0 }) {
        console.log('SpaceshipPhysics crosshairDirection:', crosshairDirection)
        
        // Store current position for collision resolution
        const previousPosition = this.position.clone()
        
        // 3D flight movement
        let accelerating = false
        
        // Forward/backward thrust
        if (keys.forward) {
            this.speed += this.acceleration
            accelerating = true
            
            // Continuous turning for circular movement when moving forward
            const turnRate = 0.015 // Reduced turn rate for more controlled turning
            const maxRotationChange = turnRate * this.maxTurnAngle // Limit rotation change
            this.targetRotation += THREE.MathUtils.clamp(
                -crosshairDirection.x * turnRate, 
                -maxRotationChange, 
                maxRotationChange
            )
            
            // Calculate target pitch based on crosshair Y position with limits
            this.targetPitch = THREE.MathUtils.clamp(
                crosshairDirection.y * this.maxPitch * 0.6, // Reduced sensitivity
                -this.maxPitch, 
                this.maxPitch
            )
            
            // Add banking (roll) for realistic turning - ship leans into turns
            this.bankingTarget = crosshairDirection.x * 0.3 // Bank based on horizontal input
            
        } else {
            // When not moving, only allow slight horizontal looking, no vertical pitch changes
            const lookRange = Math.PI / 8 // Smaller range when not moving (22.5 degrees)
            // Limit horizontal rotation to max turn angle
            const targetHorizontalChange = -crosshairDirection.x * lookRange * 0.05 // Very limited movement
            this.targetRotation = THREE.MathUtils.clamp(
                this.rotation + targetHorizontalChange,
                this.rotation - this.maxTurnAngle * 0.3, // 30% of max range
                this.rotation + this.maxTurnAngle * 0.3
            )
            // Keep current pitch when not moving - no vertical spinning!
            this.targetPitch = this.pitch
            
            // No banking when not moving
            this.bankingTarget = 0
        }
        
        // Smoothly interpolate to target rotation and pitch
        this.rotation = THREE.MathUtils.lerp(this.rotation, this.targetRotation, 0.1)
        this.pitch = THREE.MathUtils.lerp(this.pitch, this.targetPitch, 0.1)
        
        // Smooth banking animation
        this.banking = THREE.MathUtils.lerp(this.banking, this.bankingTarget, 0.08)
        
        // Apply pitch decay to help ship return to default tilt when crosshair is centered
        if (Math.abs(crosshairDirection.y) < 0.1 && !keys.forward) { // When crosshair is near center vertically and not moving
            this.targetPitch = this.defaultPitch // Return to default upward tilt
        }
        
        if (keys.backward) {
            this.speed -= this.acceleration * 0.7
            accelerating = true
        }
        
        // Apply deceleration when not thrusting
        if (!accelerating) {
            this.speed *= this.deceleration
        }
        
        // Limit speed
        this.speed = Math.max(-this.maxSpeed * 0.7, 
                             Math.min(this.maxSpeed, this.speed))
        
        // Calculate 3D direction vector for circular movement
        // Use the target rotation for movement direction to create circular paths
        const movementRotation = this.targetRotation // Use target rotation for movement
        const movementPitch = this.targetPitch // Use target pitch for movement
        
        const direction = new THREE.Vector3(
            Math.sin(movementRotation) * Math.cos(movementPitch),
            -Math.sin(movementPitch), // Negative to fix the sinking issue
            Math.cos(movementRotation) * Math.cos(movementPitch)
        )
        direction.multiplyScalar(this.speed)
        const targetPosition = this.position.clone().add(direction)

        // Allow free vertical movement - remove ground constraint
        // The ship can now fly up and down freely
        
        // Check for collisions and resolve them
        if (this.collisionDetector) {
            this.position = this.collisionDetector.resolveCollision(
                previousPosition, 
                targetPosition, 
                this.collisionRadius
            )
            
            // Check if collision occurred
            if (!this.position.equals(targetPosition)) {
                this.speed *= 0.1 // Reduce speed on collision
                console.log('💥 Spaceship collision detected!')
            }
        } else {
            this.position.copy(targetPosition)
        }
    }

    reset() {
        this.position.copy(this.initialPosition)
        this.rotation = this.initialRotation
        this.targetRotation = this.initialRotation
        this.pitch = this.defaultPitch // Start with default upward tilt
        this.targetPitch = this.defaultPitch
        this.speed = 0
        this.velocity.set(0, 0, 0)
        this.banking = 0
        this.wheelAngle = 0
        this.bankingTarget = 0
        this.wheelAngleTarget = 0
        console.log('🚀 Spaceship reset to initial position!')
    }

    getPosition() {
        return this.position.clone()
    }

    getRotation() {
        return this.rotation
    }

    getPitch() {
        return this.pitch
    }

    getBanking() {
        return this.banking
    }

    getCollisionRadius() {
        return this.collisionRadius
    }
}
