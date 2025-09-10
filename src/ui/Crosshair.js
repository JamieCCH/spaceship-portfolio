export class Crosshair {
    constructor() {
        this.crosshairElement = null
        this.isVisible = false
        this.currentX = window.innerWidth / 2
        this.currentY = window.innerHeight / 2
        this.createCrosshair()
        this.hide() // Hide crosshair initially until START is clicked
    }

    createCrosshair() {
        this.crosshairElement = document.createElement('div')
        this.crosshairElement.innerHTML = `
            <div class="crosshair-center"></div>
            <div class="crosshair-line crosshair-top"></div>
            <div class="crosshair-line crosshair-bottom"></div>
            <div class="crosshair-line crosshair-left"></div>
            <div class="crosshair-line crosshair-right"></div>
        `
        
        this.crosshairElement.style.cssText = `
            position: fixed;
            top: ${this.currentY}px;
            left: ${this.currentX}px;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
            display: none;
        `

        // Add crosshair styles
        const style = document.createElement('style')
        style.textContent = `
            .crosshair-center {
                width: 4px;
                height: 4px;
                background: #00ffff;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #00ffff;
            }
            
            .crosshair-line {
                background: #00ffff;
                position: absolute;
                box-shadow: 0 0 5px #00ffff;
            }
            
            .crosshair-top, .crosshair-bottom {
                width: 2px;
                height: 15px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .crosshair-top {
                top: -25px;
            }
            
            .crosshair-bottom {
                bottom: -25px;
            }
            
            .crosshair-left, .crosshair-right {
                width: 15px;
                height: 2px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .crosshair-left {
                left: -25px;
            }
            
            .crosshair-right {
                right: -25px;
            }
        `
        document.head.appendChild(style)
        document.body.appendChild(this.crosshairElement)
    }

    updatePosition(mouseX, mouseY) {
        if (!this.isVisible) return
        
        // Directly set crosshair position to mouse coordinates
        this.currentX = mouseX
        this.currentY = mouseY
        
        // Apply to element
        this.crosshairElement.style.left = `${this.currentX}px`
        this.crosshairElement.style.top = `${this.currentY}px`
    }

    getCrosshairDirection() {
        // Calculate direction from screen center to crosshair
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        const deltaX = this.currentX - centerX
        const deltaY = this.currentY - centerY
        
        // Convert to normalized direction (-1 to 1)
        const normalizedX = deltaX / (window.innerWidth / 2)
        const normalizedY = deltaY / (window.innerHeight / 2)
        
        return { x: normalizedX, y: normalizedY }
    }

    show() {
        if (this.crosshairElement && !this.isVisible) {
            this.crosshairElement.style.display = 'block'
            this.isVisible = true
            // Hide the mouse cursor when crosshair is active
            document.body.style.cursor = 'none'
            console.log('🎯 Crosshair activated')
        }
    }

    hide() {
        if (this.crosshairElement && this.isVisible) {
            this.crosshairElement.style.display = 'none'
            this.isVisible = false
            // Show the mouse cursor when crosshair is hidden
            document.body.style.cursor = 'auto'
            console.log('🎯 Crosshair deactivated')
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide()
        } else {
            this.show()
        }
    }
}
