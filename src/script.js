console.log('🚀 Space Portfolio Loading... Updated:', new Date().toISOString())

// Import all modules
import { Scene } from './core/Scene.js'
import { Camera } from './core/Camera.js'
import { Renderer } from './core/Renderer.js'
import { Controls } from './core/Controls.js'
import { SpaceshipPhysics } from './physics/SpaceshipPhysics.js'
import { Environment } from './objects/Environment.js'
import { Platforms } from './objects/Platforms.js'
import { Planets } from './objects/Planets.js'
import { Spaceship } from './objects/Spaceship.js'
import { ModelLoader } from './utils/ModelLoader.js'
import { CollisionDetector } from './utils/CollisionDetector.js'
import { LoadingScreen } from './ui/LoadingScreen.js'
import { ControlsOverlay } from './ui/ControlsOverlay.js'
import { Crosshair } from './ui/Crosshair.js'
import { SCENE_CONFIG } from './utils/Constants.js'

class SpacePortfolio {
    constructor() {
        this.animationStarted = false
        this.init()
    }

    async init() {
        // Initialize collision system
        this.collisionDetector = new CollisionDetector()
        
        // Initialize core systems
        this.scene = new Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        
        // Initialize physics
        this.spaceshipPhysics = new SpaceshipPhysics()
        this.spaceshipPhysics.setCollisionDetector(this.collisionDetector)
        
        // Initialize controls
        this.controls = new Controls(this.spaceshipPhysics)
        
        // Initialize UI
        this.loadingScreen = new LoadingScreen()
        this.controlsOverlay = new ControlsOverlay()
        this.crosshair = new Crosshair()
        
        // Initialize model loader
        this.modelLoader = new ModelLoader()
        this.modelLoader.setTotalModels(SCENE_CONFIG.totalModels)
        this.modelLoader.setCallbacks(
            (loaded, total) => this.onLoadingProgress(loaded, total),
            () => this.onLoadingComplete()
        )
        
        // Initialize world objects
        this.environment = new Environment(this.scene)
        this.platforms = new Platforms(this.scene, this.collisionDetector)
        this.planets = new Planets(this.scene, this.modelLoader, this.collisionDetector)
        this.spaceship = new Spaceship(this.scene, this.modelLoader, this.spaceshipPhysics)
        
        // Connect crosshair to controls
        this.controls.setCrosshair(this.crosshair)
        
        // Start animation loop
        this.animate()
    }

    onLoadingProgress(loaded, total) {
        console.log(`Loading progress: ${loaded}/${total}`)
    }

    onLoadingComplete() {
        console.log('🌟 All models loaded! Ready to fly!')
        console.log('💥 Collision detection enabled - try flying into planets!')
        
        // Notify loading screen that loading is complete (shows START button)
        this.loadingScreen.onLoadingComplete()
        
        // Override the startExperience method to handle the actual start
        this.loadingScreen.startExperience = () => {
            this.animationStarted = true
            this.controls.enableControls() // Enable controls and show crosshair when starting
            this.loadingScreen.remove(() => {
                this.controlsOverlay.show()
            })
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate())
        
        if (!this.animationStarted) return
        
        // Update physics
        // Update spaceship physics with keyboard and crosshair input
        this.spaceshipPhysics.update(this.controls.getKeys(), this.controls.getCrosshairDirection())
        
        // Update all objects
        this.scene.update()
        this.environment.update()
        this.planets.update()
        this.spaceship.update()
        
        // Update camera with crosshair direction for subtle panning
        this.camera.update(this.spaceshipPhysics, this.controls.getCrosshairDirection())
        
        // Render
        this.renderer.render(this.scene.getScene(), this.camera.getCamera())
    }
}

// Start the application
new SpacePortfolio()