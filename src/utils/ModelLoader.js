import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader()
        this.loadedModels = 0
        this.totalModels = 0
        this.onProgress = null
        this.onComplete = null
    }

    setCallbacks(onProgress, onComplete) {
        this.onProgress = onProgress
        this.onComplete = onComplete
    }

    setTotalModels(total) {
        this.totalModels = total
    }

    async loadModel(path, onSuccess, onError) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path,
                (gltf) => {
                    this.loadedModels++
                    console.log(`✅ Model loaded: ${path} (${this.loadedModels}/${this.totalModels})`)
                    
                    if (onSuccess) onSuccess(gltf)
                    if (this.onProgress) this.onProgress(this.loadedModels, this.totalModels)
                    
                    if (this.loadedModels === this.totalModels && this.onComplete) {
                        console.log('🌟 All models loaded! Ready to fly!')
                        this.onComplete()
                    }
                    
                    resolve(gltf)
                },
                (progress) => {
                    const percent = Math.round(progress.loaded / progress.total * 100)
                    console.log(`Loading ${path}...`, percent + '%')
                },
                (error) => {
                    console.error(`Error loading ${path}:`, error)
                    if (onError) {
                        const fallback = onError()
                        this.loadedModels++
                        
                        if (this.onProgress) this.onProgress(this.loadedModels, this.totalModels)
                        
                        if (this.loadedModels === this.totalModels && this.onComplete) {
                            console.log('🌟 All models loaded! Ready to fly!')
                            this.onComplete()
                        }
                        
                        resolve(fallback)
                    } else {
                        reject(error)
                    }
                }
            )
        })
    }

    getProgress() {
        return {
            loaded: this.loadedModels,
            total: this.totalModels,
            percentage: this.totalModels > 0 ? (this.loadedModels / this.totalModels) * 100 : 0
        }
    }
}
