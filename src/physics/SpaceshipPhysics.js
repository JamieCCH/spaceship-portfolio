import * as THREE from 'three'
import { SPACESHIP_CONFIG } from '../utils/Constants.js'

export class SpaceshipPhysics {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.speed = 0
        this.maxSpeed = SPACESHIP_CONFIG.maxSpeed
        this.acceleration = SPACESHIP_CONFIG.acceleration
        this.deceleration = SPACESHIP_CONFIG.deceleration
        this.turnSpeed = SPACESHIP_CONFIG.turnSpeed
        this.collisionRadius = 4 // Increased from 3 to 4 for better collision detection
        
        this.initialPosition = new THREE.Vector3(
            SPACESHIP_CONFIG.initialPosition.x,
            SPACESHIP_CONFIG.initialPosition.y,
            SPACESHIP_CONFIG.initialPosition.z
        )
        this.initialRotation = SPACESHIP_CONFIG.initialRotation
        
        this.position = this.initialPosition.clone()
        this.rotation = this.initialRotation
        this.wheelAngle = 0
        this.wheelAngleTarget = 0
        this.banking = 0
        this.bankingTarget = 0

        // Collision system
        this.collisionDetector = null
    }

    setCollisionDetector(collisionDetector) {
        this.collisionDetector = collisionDetector
    }

    update(keys) {
        // Store current position for collision resolution
        const previousPosition = this.position.clone()
        
        // Simple car-like controls
        let accelerating = false
        
        // Forward/backward
        if (keys.forward) {
            this.speed += this.acceleration
            accelerating = true
        }
        if (keys.backward) {
            this.speed -= this.acceleration * 0.7
            accelerating = true
        }
        
        // Apply deceleration when not accelerating
        if (!accelerating) {
            this.speed *= this.deceleration
        }
        
        // Limit speed
        this.speed = Math.max(-this.maxSpeed * 0.7, 
                             Math.min(this.maxSpeed, this.speed))
        
        // Turning (only when moving)
        if (Math.abs(this.speed) > 0.1) {
            if (keys.left) {
                this.rotation += this.turnSpeed * (this.speed / this.maxSpeed)
                this.wheelAngleTarget = 0.5
                this.bankingTarget = -0.3
            } else if (keys.right) {
                this.rotation -= this.turnSpeed * (this.speed / this.maxSpeed)
                this.wheelAngleTarget = -0.5
                this.bankingTarget = 0.3
            } else {
                this.wheelAngleTarget = 0
                this.bankingTarget = 0
            }
        } else {
            this.wheelAngleTarget = 0
            this.bankingTarget = 0
        }
        
        // Smooth wheel angle and banking
        this.wheelAngle = THREE.MathUtils.lerp(this.wheelAngle, this.wheelAngleTarget, 0.1)
        this.banking = THREE.MathUtils.lerp(this.banking, this.bankingTarget, 0.05)
        
        // Calculate target position based on movement
        const direction = new THREE.Vector3(
            Math.sin(this.rotation),
            0,
            Math.cos(this.rotation)
        )
        direction.multiplyScalar(this.speed)
        const targetPosition = this.position.clone().add(direction)
        
        // Keep spaceship above ground with gentle floating
        const targetY = SPACESHIP_CONFIG.initialPosition.y + 
                       Math.sin(Date.now() * SPACESHIP_CONFIG.floatSpeed) * SPACESHIP_CONFIG.floatAmplitude
        targetPosition.y = THREE.MathUtils.lerp(this.position.y, targetY, 0.02)
        
        // Check for collisions and resolve them
        if (this.collisionDetector) {
            this.position = this.collisionDetector.resolveCollision(
                previousPosition, 
                targetPosition, 
                this.collisionRadius
            )
            
            // If we hit something, reduce speed
            const collision = this.collisionDetector.checkCollision(targetPosition, this.collisionRadius)
            if (collision.collided) {
                this.speed *= 0.1 // Dramatically reduce speed when hitting something
                console.log('💥 Spaceship collision detected!')
            }
        } else {
            this.position.copy(targetPosition)
        }
    }

    reset() {
        this.position.copy(this.initialPosition)
        this.rotation = this.initialRotation
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

    getBanking() {
        return this.banking
    }

    getCollisionRadius() {
        return this.collisionRadius
    }
}
