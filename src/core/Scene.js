import * as THREE from 'three'
import { SCENE_CONFIG } from '../utils/Constants.js'

export class Scene {
    constructor() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor)
        this.init()
    }

    init() {
        this.createStarfield()
        this.createGround()
    }

    createStarfield() {
        const starsGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(SCENE_CONFIG.starsCount * 3)

        for(let i = 0; i < SCENE_CONFIG.starsCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3000
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: SCENE_CONFIG.starsSize,
            transparent: true,
            opacity: SCENE_CONFIG.starsOpacity
        })
        
        this.stars = new THREE.Points(starsGeometry, starsMaterial)
        this.scene.add(this.stars)
    }

    createGround() {
        // Create invisible ground plane for physics reference
        const groundGeometry = new THREE.PlaneGeometry(5000, 5000)
        const groundMaterial = new THREE.MeshBasicMaterial({ 
            visible: false // Invisible but still affects physics
        })
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial)
        this.ground.rotation.x = -Math.PI / 2
        this.ground.position.y = -50
        this.ground.receiveShadow = true
        this.scene.add(this.ground)
    }

    addObject(object) {
        this.scene.add(object)
    }

    removeObject(object) {
        this.scene.remove(object)
    }

    update() {
        // Rotate starfield
        if (this.stars) {
            this.stars.rotation.y += 0.0003
            this.stars.rotation.x += 0.0001
        }
    }

    getScene() {
        return this.scene
    }
}
