import { CONTROLS } from '../utils/Constants.js'

export class Controls {
    constructor(spaceshipPhysics) {
        this.spaceshipPhysics = spaceshipPhysics
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        }
        
        this.setupEventListeners()
        this.displayControls()
    }

    setupEventListeners() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event))
        window.addEventListener('keyup', (event) => this.onKeyUp(event))
    }

    onKeyDown(event) {
        if (CONTROLS.forward.includes(event.code)) {
            this.keys.forward = true
        } else if (CONTROLS.backward.includes(event.code)) {
            this.keys.backward = true
        } else if (CONTROLS.left.includes(event.code)) {
            this.keys.left = true
        } else if (CONTROLS.right.includes(event.code)) {
            this.keys.right = true
        } else if (CONTROLS.reset.includes(event.code)) {
            this.spaceshipPhysics.reset()
        }
    }

    onKeyUp(event) {
        if (CONTROLS.forward.includes(event.code)) {
            this.keys.forward = false
        } else if (CONTROLS.backward.includes(event.code)) {
            this.keys.backward = false
        } else if (CONTROLS.left.includes(event.code)) {
            this.keys.left = false
        } else if (CONTROLS.right.includes(event.code)) {
            this.keys.right = false
        }
    }

    getKeys() {
        return this.keys
    }

    displayControls() {
        console.log(`
🎮 SPACE CAR CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 WASD or Arrow Keys
W/↑ - Accelerate forward
S/↓ - Reverse / Brake
A/← - Turn left
D/→ - Turn right
R   - Reset to start position
━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
    }
}
