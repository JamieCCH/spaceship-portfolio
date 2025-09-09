import * as THREE from 'three'

export class CollisionDetector {
    constructor() {
        this.colliders = []
    }

    addCollider(object, radius, position) {
        this.colliders.push({
            object,
            radius,
            position: position.clone()
        })
    }

    updateColliderPosition(object, newPosition) {
        const collider = this.colliders.find(c => c.object === object)
        if (collider) {
            collider.position.copy(newPosition)
        }
    }

    checkCollision(position, radius) {
        for (const collider of this.colliders) {
            const distance = position.distanceTo(collider.position)
            const minDistance = radius + collider.radius
            
            if (distance < minDistance) {
                return {
                    collided: true,
                    collider: collider,
                    distance: distance,
                    minDistance: minDistance,
                    penetration: minDistance - distance
                }
            }
        }
        return { collided: false }
    }

    resolveCollision(currentPosition, targetPosition, radius) {
        const collision = this.checkCollision(targetPosition, radius)
        
        if (!collision.collided) {
            return targetPosition.clone()
        }

        // Calculate the direction from collider to spaceship
        const colliderPos = collision.collider.position
        const direction = new THREE.Vector3()
            .subVectors(currentPosition, colliderPos)
            .normalize()

        // Place spaceship just outside the collision radius
        const safeDistance = collision.collider.radius + radius + 1 // +1 for safety margin
        const safePosition = colliderPos.clone().add(direction.multiplyScalar(safeDistance))
        
        // Keep the Y position from the target (allow vertical movement)
        safePosition.y = targetPosition.y

        return safePosition
    }

    getColliders() {
        return this.colliders
    }

    clearColliders() {
        this.colliders = []
    }
}
