export class LoadingScreen {
    constructor() {
        this.loadingDiv = null
        this.backgroundOverlay = null
        this.isRemoved = false
        this.isLoaded = false
        this.createLoadingScreen()
        this.createBackgroundOverlay()
    }

    createBackgroundOverlay() {
        this.backgroundOverlay = document.createElement('div')
        this.backgroundOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a1f 0%, #1a0f2e 50%, #2d1b3d 100%);
            z-index: 999;
        `
        document.body.appendChild(this.backgroundOverlay)
    }

    createLoadingScreen() {
        this.loadingDiv = document.createElement('div')
        this.loadingDiv.innerHTML = `
            <div style="margin-bottom: 25px; font-size: 36px;">🚀</div>
            <div id="loading-text" style="margin-bottom: 20px;">Loading...</div>
            <div style="font-size: 16px; color: #aaaaaa; margin-bottom: 15px;">
                Jamie CC Huang Portfolio
            </div>
            <div style="font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 25px;">
                Controls: W (Forward) | S (Reverse) | Mouse (Steer) | R (Reset)
            </div>
            <button id="start-button" style="
                display: none;
                background: #00ffff;
                color: #081040;
                border: none;
                padding: 12px 30px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Arial', sans-serif;
            " onmouseover="this.style.background='#00dddd'" onmouseout="this.style.background='#00ffff'">
                START
            </button>
        `
        this.loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ffff;
            font-family: 'Arial', sans-serif;
            font-size: 28px;
            z-index: 1000;
            text-align: center;
            background: rgba(8, 16, 64, 0.95);
            padding: 40px;
            border-radius: 15px;
            border: 2px solid #00ffff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        `
        document.body.appendChild(this.loadingDiv)
    }

    onLoadingComplete() {
        this.isLoaded = true
        // Hide the "Loading..." text
        const loadingText = document.getElementById('loading-text')
        if (loadingText) {
            loadingText.style.display = 'none'
        }
        
        // Show the START button in place of loading text
        const startButton = document.getElementById('start-button')
        if (startButton) {
            startButton.style.display = 'inline-block'
            startButton.addEventListener('click', () => {
                this.startExperience()
            })
        }
    }

    startExperience() {
        if (!this.isLoaded) return
        
        // Remove loading panel and white background
        this.remove(() => {
            // Callback will be handled by the main script
        })
    }

    remove(onComplete) {
        if (this.isRemoved) return
        
        this.isRemoved = true
        
        // Fade out loading panel
        if (this.loadingDiv && document.body.contains(this.loadingDiv)) {
            this.loadingDiv.style.transition = 'opacity 0.5s ease-out'
            this.loadingDiv.style.opacity = '0'
            setTimeout(() => {
                if (this.loadingDiv && document.body.contains(this.loadingDiv)) {
                    this.loadingDiv.remove()
                }
            }, 500)
        }
        
        // Fade out white background
        if (this.backgroundOverlay && document.body.contains(this.backgroundOverlay)) {
            this.backgroundOverlay.style.transition = 'opacity 0.8s ease-out'
            this.backgroundOverlay.style.opacity = '0'
            setTimeout(() => {
                if (this.backgroundOverlay && document.body.contains(this.backgroundOverlay)) {
                    this.backgroundOverlay.remove()
                    if (onComplete) onComplete()
                }
            }, 800)
        } else if (onComplete) {
            onComplete()
        }
    }

    isVisible() {
        return !this.isRemoved && this.loadingDiv && document.body.contains(this.loadingDiv)
    }
}
