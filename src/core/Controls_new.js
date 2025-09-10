import { CONTROLS } from '../utils/Constants.js'

export class Controls {
    constructor(spaceshipPhysics) {
        this.spaceshipPhysics = spaceshipPhysics
        this.keys = {
            forward: false,
            backward: false
        }
        
        // Mouse controls for ship rotation
        this.mouse = {
            x: 0,
            y: 0,
            sensitivity: 0.002
        }
        
        this.setupEventListeners()
        this.displayControls()
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event))
        window.addEventListener('keyup', (event) => this.onKeyUp(event))
        
        // Mouse move for ship rotation
        window.addEventListener('mousemove', (event) => this.onMouseMove(event))
        
        // Request pointer lock on click for better mouse control
        document.addEventListener('click', () => {
            document.body.requestPointerLock()
        })
        
        // Handle pointer lock change
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === document.body) {
                console.log('🎯 Mouse locked - spaceship flight mode active!')
            } else {
                console.log('🖱️ Mouse unlocked')
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
        }
    }

    onKeyUp(event) {
        if (CONTROLS.forward.includes(event.code)) {
            this.keys.forward = false
        } else if (CONTROLS.backward.includes(event.code)) {
            this.keys.backward = false
        }
    }

    onMouseMove(event) {
        if (document.pointerLockElement === document.body) {
            // Use mouse movement for ship rotation
            this.mouse.x += event.movementX * this.mouse.sensitivity
            this.mouse.y += event.movementY * this.mouse.sensitivity
            
            // Limit vertical rotation to prevent flipping
            this.mouse.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouse.y))
        }
    }

    getKeys() {
        return this.keys
    }

    getMouseRotation() {
        return { x: this.mouse.x, y: this.mouse.y }
    }

    displayControls() {
        console.log(`
🚀 SPACESHIP FLIGHT CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Click to lock mouse cursor
🖱️  Mouse - Rotate ship direction
W   - Thrust forward
S   - Thrust backward  
R   - Reset to start position
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
    }
}
