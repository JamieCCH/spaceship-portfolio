import * as THREE from 'three'

export class Renderer {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.querySelector('.webgl'),
            antialias: true
        })
        
        this.init()
        this.setupEventListeners()
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    render(scene, camera) {
        this.renderer.render(scene, camera)
    }

    getRenderer() {
        return this.renderer
    }
}
