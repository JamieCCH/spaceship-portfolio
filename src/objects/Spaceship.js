import * as THREE from 'three'

export class Spaceship {
    constructor(scene, modelLoader, spaceshipPhysics) {
        this.scene = scene
        this.modelLoader = modelLoader
        this.spaceshipPhysics = spaceshipPhysics
        this.spaceship = null
        this.init()
    }

    async init() {
        await this.loadSpaceship()
    }

    async loadSpaceship() {
        try {
            const gltf = await this.modelLoader.loadModel(
                'models/Spaceship.glb',
                null,
                () => this.createSimpleSpaceship()
            )
            
            this.spaceship = gltf.scene || gltf
            this.spaceship.scale.setScalar(1.5)
            this.setupSpaceship()
            
            console.log('🚀 Spaceship loaded!')
        } catch (error) {
            console.error('Error loading spaceship:', error)
            this.spaceship = this.createSimpleSpaceship()
            this.setupSpaceship()
        }
    }

    // Create simple spaceship if model fails
    createSimpleSpaceship() {
        const group = new THREE.Group()
        
        // Main body
        const bodyGeometry = new THREE.ConeGeometry(1, 4, 8)
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 })
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
        body.rotation.x = Math.PI / 2
        body.castShadow = true
        
        // Wings
        const wingGeometry = new THREE.BoxGeometry(3, 0.2, 1)
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 })
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial)
        leftWing.position.set(-1.5, 0, -1)
        leftWing.castShadow = true
        
        const rightWing = leftWing.clone()
        rightWing.position.set(1.5, 0, -1)
        rightWing.castShadow = true
        
        // Engine glow
        const engineGeometry = new THREE.SphereGeometry(0.3, 8, 6)
        const engineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00aaff,
            emissive: 0x004488
        })
        const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial)
        leftEngine.position.set(-0.8, 0, 1.5)
        
        const rightEngine = leftEngine.clone()
        rightEngine.position.set(0.8, 0, 1.5)
        
        group.add(body, leftWing, rightWing, leftEngine, rightEngine)
        console.log('Creating placeholder spaceship...')
        return group
    }

    setupSpaceship() {
        if (!this.spaceship) return
        
        this.spaceship.position.copy(this.spaceshipPhysics.getPosition())
        this.spaceship.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        this.scene.addObject(this.spaceship)
    }

    update() {
        if (!this.spaceship) return
        
        // Apply physics to spaceship
        this.spaceship.position.copy(this.spaceshipPhysics.getPosition())
        this.spaceship.rotation.y = this.spaceshipPhysics.getRotation()
        this.spaceship.rotation.z = this.spaceshipPhysics.getBanking()
    }

    getSpaceship() {
        return this.spaceship
    }
}
