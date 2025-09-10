import { CONTROLS } from '../utils/Constants.js'

export class Controls {
    constructor(spaceshipPhysics) {
        this.spaceshipPhysics = spaceshipPhysics
        this.crosshair = null // Will be set by main script
        this.isStarted = false // Flag to track if START button has been clicked
        this.keys = {
            forward: false,
            backward: false
        }
        
        // Mouse position for crosshair (absolute screen coordinates)
        this.mousePosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        }
        
        // Track previous forward key state to detect when user stops flying
        this.wasMovingForward = false
        
        this.setupEventListeners()
        this.displayControls()
    }

    setCrosshair(crosshair) {
        this.crosshair = crosshair
    }

    enableControls() {
        this.isStarted = true
        // Don't show crosshair immediately - wait for user to click for pointer lock
        console.log('🎯 Controls enabled - click anywhere to activate crosshair flight mode')
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event))
        window.addEventListener('keyup', (event) => this.onKeyUp(event))
        
        // Mouse move for crosshair positioning
        window.addEventListener('mousemove', (event) => this.onMouseMove(event))
        
        // Request pointer lock on click - but only if started
        document.addEventListener('click', () => {
            if (this.isStarted) {
                document.body.requestPointerLock()
            }
        })
        
        // Handle pointer lock change
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === document.body) {
                console.log('🎯 Mouse locked - crosshair flight mode active!')
                if (this.crosshair && this.isStarted) this.crosshair.show()
            } else {
                console.log('🖱️ Mouse unlocked')
                if (this.crosshair) this.crosshair.hide()
                // Reset crosshair to center when unlocked
                this.mousePosition.x = window.innerWidth / 2
                this.mousePosition.y = window.innerHeight / 2
            }
        })
    }

    onKeyDown(event) {
        if (CONTROLS.forward.includes(event.code)) {
            this.keys.forward = true
        } else if (CONTROLS.backward.includes(event.code)) {
            this.keys.backward = true
        } else if (CONTROLS.reset.includes(event.code)) {
            this.spaceshipPhysics.reset()
        } else if (event.code === 'Escape') {
            // ESC key to toggle crosshair/cursor visibility
            if (this.crosshair && this.crosshair.isVisible) {
                this.crosshair.hide() // This will also restore the cursor
                console.log('🖱️ Cursor restored (ESC pressed)')
            } else if (this.crosshair && this.isStarted) {
                this.crosshair.show() // This will hide the cursor again
                console.log('🎯 Crosshair restored (ESC pressed)')
            }
        }
    }

    onKeyUp(event) {
        if (CONTROLS.forward.includes(event.code)) {
            this.keys.forward = false
            // Reset crosshair to center when stopping forward movement
            this.resetCrosshairToCenter()
        } else if (CONTROLS.backward.includes(event.code)) {
            this.keys.backward = false
        }
    }

    resetCrosshairToCenter() {
        // Reset mouse position to center of screen
        this.mousePosition.x = window.innerWidth / 2
        this.mousePosition.y = window.innerHeight / 2
        
        // Update crosshair position to center
        if (this.crosshair) {
            this.crosshair.updatePosition(this.mousePosition.x, this.mousePosition.y)
        }
        
        console.log('🎯 Crosshair reset to center')
    }

    onMouseMove(event) {
        if (document.pointerLockElement === document.body) {
            // Update mouse position based on movement (pointer lock mode)
            this.mousePosition.x += event.movementX
            this.mousePosition.y += event.movementY
            
            // Clamp to screen bounds
            this.mousePosition.x = Math.max(0, Math.min(window.innerWidth, this.mousePosition.x))
            this.mousePosition.y = Math.max(0, Math.min(window.innerHeight, this.mousePosition.y))
            
            // Update crosshair position
            if (this.crosshair) {
                this.crosshair.updatePosition(this.mousePosition.x, this.mousePosition.y)
            }
        }
    }

    getKeys() {
        return this.keys
    }

    getCrosshairDirection() {
        // Get the direction from crosshair if available
        if (this.crosshair) {
            return this.crosshair.getCrosshairDirection()
        }
        return { x: 0, y: 0 }
    }

    displayControls() {
        console.log(`
🚀 SPACESHIP CROSSHAIR CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Click to lock mouse and show crosshair
🖱️  Mouse - Move crosshair freely
W   - Thrust forward (ship turns toward crosshair)
S   - Thrust backward  
R   - Reset to start position
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
    }
}
