export class LoadingScreen {
    constructor() {
        this.loadingDiv = null
        this.isRemoved = false
        this.createLoadingScreen()
    }

    createLoadingScreen() {
        this.loadingDiv = document.createElement('div')
        this.loadingDiv.innerHTML = `
            <div style="margin-bottom: 25px; font-size: 36px;">🚀</div>
            <div style="margin-bottom: 20px;">Loading...</div>
            <div style="font-size: 16px; color: #aaaaaa; margin-bottom: 15px;">
                Jamie CC Huang Portfolio
            </div>
            <div style="font-size: 14px; color: #666666; line-height: 1.6;">
                Controls: WASD | Arrow Keys | R (Reset)<br>
            </div>
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

    remove(onComplete) {
        if (this.isRemoved || !document.body.contains(this.loadingDiv)) return
        
        this.isRemoved = true
        
        setTimeout(() => {
            if (this.loadingDiv && document.body.contains(this.loadingDiv)) {
                this.loadingDiv.style.transition = 'opacity 1s ease-out'
                this.loadingDiv.style.opacity = '0'
                setTimeout(() => {
                    if (this.loadingDiv && document.body.contains(this.loadingDiv)) {
                        this.loadingDiv.remove()
                        if (onComplete) onComplete()
                    }
                }, 1000)
            }
        }, 1500)
    }

    isVisible() {
        return !this.isRemoved && this.loadingDiv && document.body.contains(this.loadingDiv)
    }
}
