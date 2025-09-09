export class ControlsOverlay {
    constructor() {
        this.controlsDiv = null
        this.createControlsOverlay()
    }

    createControlsOverlay() {
        this.controlsDiv = document.createElement('div')
        this.controlsDiv.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 10px; color: #00ffff;">🚀 CONTROLS</div>
            <div style="font-size: 14px; line-height: 1.8; color: #ffffff;">
                <div><strong>W</strong> or <strong>↑</strong> - Accelerate</div>
                <div><strong>S</strong> or <strong>↓</strong> - Reverse</div>
                <div><strong>A</strong> or <strong>←</strong> - Turn Left</div>
                <div><strong>D</strong> or <strong>→</strong> - Turn Right</div>
                <div><strong>R</strong> - Reset Position</div>
            </div>
            <div style="font-size: 12px; margin-top: 10px; color: #888888;">
            [Jamie CC Huang Portfolio]
            </div>
        `
        this.controlsDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(8, 16, 64, 0.85);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #00ffff;
            font-family: 'Arial', sans-serif;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
            display: none;
        `
        document.body.appendChild(this.controlsDiv)
    }

    show() {
        if (this.controlsDiv) {
            this.controlsDiv.style.display = 'block'
            this.controlsDiv.style.opacity = '0'
            this.controlsDiv.style.transition = 'opacity 1s ease-in'
            setTimeout(() => {
                if (this.controlsDiv) {
                    this.controlsDiv.style.opacity = '1'
                }
            }, 100)
        }
    }

    hide() {
        if (this.controlsDiv) {
            this.controlsDiv.style.opacity = '0'
            setTimeout(() => {
                if (this.controlsDiv) {
                    this.controlsDiv.style.display = 'none'
                }
            }, 1000)
        }
    }

    isVisible() {
        return this.controlsDiv && this.controlsDiv.style.display !== 'none'
    }
}
