/* console.log('Spaceship Portfolio Loading...')

// Basic Three.js test
import * as THREE from 'three'

// Create scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') })

renderer.setSize(window.innerWidth, window.innerHeight)

// Create a simple cube to test
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

// Animation loop
function animate() {
    requestAnimationFrame(animate)
    
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    
    renderer.render(scene, camera)
}

animate()

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}) */


console.log('🚀 Spaceship Portfolio Loading...')

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000011) // Dark space background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('.webgl'),
    antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Create starfield
const starsGeometry = new THREE.BufferGeometry()
const starsCount = 8000
const positions = new Float32Array(starsCount * 3)

for(let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 3000
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.8
})

const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.8) // Increased from 0.4 to 0.8
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2) // Increased from 1 to 2
directionalLight.position.set(50, 50, 50)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

// Add some point lights for dramatic effect
const pointLight1 = new THREE.PointLight(0x0088ff, 1.2, 300) // Increased intensity and range
pointLight1.position.set(100, 50, -100)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0xff4400, 0.8, 250) // Increased intensity and range
pointLight2.position.set(-80, -30, 120)
scene.add(pointLight2)

// Add additional fill lights
const fillLight1 = new THREE.DirectionalLight(0x6666ff, 0.6)
fillLight1.position.set(-50, 20, 30)
scene.add(fillLight1)

const fillLight2 = new THREE.DirectionalLight(0xff6666, 0.4)
fillLight2.position.set(30, -40, -20)
scene.add(fillLight2)

// Model loading
const loader = new GLTFLoader()
let spaceship = null
let planets = []
let loadedModels = 0
const totalModels = 4

// Loading progress
function onModelLoaded() {
    loadedModels++
    console.log(`✅ Models loaded: ${loadedModels}/${totalModels}`)
    
    if(loadedModels === totalModels) {
        console.log('🌟 All models loaded! Starting animation...')
        startAnimation()
    }
}

// Load spaceship
loader.load(
    'models/Spaceship.glb',
    (gltf) => {
        spaceship = gltf.scene
        spaceship.scale.setScalar(1) // Adjust size as needed
        spaceship.position.set(0, 0, 0)
        
        // Enable shadows
        spaceship.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        
        scene.add(spaceship)
        console.log('🚀 Spaceship loaded!')
        onModelLoaded()
    },
    (progress) => {
        console.log('Loading spaceship...', Math.round(progress.loaded / progress.total * 100) + '%')
    },
    (error) => {
        console.error('Error loading spaceship:', error)
    }
)

// Load planets
const planetPositions = [
    { x: 200, y: 50, z: -300 },   // Planet 1
    { x: -150, y: -80, z: 200 },  // Planet 2
    { x: 300, y: 20, z: 100 }     // Planet 3
]

for(let i = 1; i <= 3; i++) {
    loader.load(
        `models/Planet${i}.glb`,
        (gltf) => {
            const planet = gltf.scene
            const scale = 15 + Math.random() * 20 // Random size between 15-35
            planet.scale.setScalar(scale)
            
            const pos = planetPositions[i - 1]
            planet.position.set(pos.x, pos.y, pos.z)
            
            // Enable shadows
            planet.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })
            
            scene.add(planet)
            planets.push(planet)
            console.log(`🪐 Planet ${i} loaded!`)
            onModelLoaded()
        },
        (progress) => {
            console.log(`Loading planet ${i}...`, Math.round(progress.loaded / progress.total * 100) + '%')
        },
        (error) => {
            console.error(`Error loading planet ${i}:`, error)
        }
    )
}

// Camera controls
let cameraAngle = 0
let cameraRadius = 15
let cameraHeight = 5

// Basic controls
const keys = {
    w: false,      // Forward
    a: false,      // Rotate left  
    s: false,      // Backward
    d: false,      // Rotate right
    q: false,      // Roll left
    e: false,      // Roll right
    space: false,  // Move up
    shift: false   // Move down
}

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    if (keys.hasOwnProperty(key)) {
        keys[key] = true
    } else if (event.code === 'Space') {
        event.preventDefault() // Prevent page scroll
        keys.space = true
    } else if (event.key === 'Shift') {
        keys.shift = true
    }
})

window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase()
    if (keys.hasOwnProperty(key)) {
        keys[key] = false
    } else if (event.code === 'Space') {
        keys.space = false
    } else if (event.key === 'Shift') {
        keys.shift = false
    }
})

// Animation variables
let animationStarted = false

function startAnimation() {
    animationStarted = true
    
    // Position camera behind spaceship
    camera.position.set(0, cameraHeight, cameraRadius)
    camera.lookAt(0, 0, 0)
}

// Animation loop
function animate() {
    requestAnimationFrame(animate)
    
    if (!animationStarted) return
    
    // Rotate starfield slowly
    stars.rotation.y += 0.0002
    stars.rotation.x += 0.0001
    
    // Rotate planets
    planets.forEach((planet, index) => {
        if (planet) {
            planet.rotation.y += 0.005 + (index * 0.002)
            planet.rotation.x += 0.001
        }
    })
    
    // Basic spaceship movement (if loaded)
    if (spaceship) {
        // Handle basic movement
        if (keys.w) spaceship.translateZ(-0.8)  // Forward (increased speed)
        if (keys.s) spaceship.translateZ(0.8)   // Backward (increased speed)
        if (keys.a) spaceship.rotation.y += 0.03 // Rotate left (increased speed)
        if (keys.d) spaceship.rotation.y -= 0.03 // Rotate right (increased speed)
        if (keys.q) spaceship.rotation.z += 0.03 // Roll left (increased speed)
        if (keys.e) spaceship.rotation.z -= 0.03 // Roll right (increased speed)
        if (keys.space) spaceship.translateY(0.8)   // Move up
        if (keys.shift) spaceship.translateY(-0.8)  // Move down
        
        // Camera follows spaceship
        const spaceshipPos = spaceship.position
        const cameraOffset = new THREE.Vector3(0, cameraHeight, cameraRadius)
        
        // Apply spaceship's rotation to camera offset
        cameraOffset.applyQuaternion(spaceship.quaternion)
        
        camera.position.copy(spaceshipPos).add(cameraOffset)
        camera.lookAt(spaceshipPos)
    }
    
    // Animate point lights
    const time = Date.now() * 0.001
    pointLight1.position.x = Math.cos(time * 0.5) * 100
    pointLight1.position.z = Math.sin(time * 0.5) * 100
    
    pointLight2.position.x = Math.sin(time * 0.3) * 80
    pointLight2.position.y = Math.cos(time * 0.4) * 60
    
    renderer.render(scene, camera)
}

animate()

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Display controls
console.log(`
🎮 ENHANCED CONTROLS:
W/S - Move forward/backward
A/D - Rotate left/right  
Q/E - Roll left/right
SPACE - Move up ⬆️
SHIFT - Move down ⬇️
`)

// Loading screen helper
const loadingDiv = document.createElement('div')
loadingDiv.innerHTML = `
    <div style="margin-bottom: 20px;">🚀 Loading 3D models...</div>
    <div style="font-size: 14px; color: #aaaaaa;">
        Controls: WASD + Q/E + SPACE/SHIFT
    </div>
`
loadingDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ffff;
    font-family: Arial, sans-serif;
    font-size: 24px;
    z-index: 1000;
    text-align: center;
`
document.body.appendChild(loadingDiv)

// Remove loading screen when all models are loaded
function removeLoadingScreen() {
    if (loadedModels === totalModels) {
        setTimeout(() => {
            loadingDiv.remove()
        }, 1000)
    }
}

// Check for loading completion
setInterval(() => {
    if (loadedModels === totalModels && document.body.contains(loadingDiv)) {
        removeLoadingScreen()
    }
}, 100) 

/*
console.log('🚀 Spaceship Portfolio Loading...')

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000011) // Dark space background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('.webgl'),
    antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Create starfield
const starsGeometry = new THREE.BufferGeometry()
const starsCount = 8000
const positions = new Float32Array(starsCount * 3)

for(let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 3000
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.8
})

const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

// Lighting setup - Much brighter!
const ambientLight = new THREE.AmbientLight(0x404040, 0.8) // Increased from 0.4 to 0.8
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2) // Increased from 1 to 2
directionalLight.position.set(50, 50, 50)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

// Add some point lights for dramatic effect - brighter
const pointLight1 = new THREE.PointLight(0x0088ff, 1.2, 300) // Increased intensity and range
pointLight1.position.set(100, 50, -100)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0xff4400, 0.8, 250) // Increased intensity and range
pointLight2.position.set(-80, -30, 120)
scene.add(pointLight2)

// Add additional fill lights
const fillLight1 = new THREE.DirectionalLight(0x6666ff, 0.6)
fillLight1.position.set(-50, 20, 30)
scene.add(fillLight1)

const fillLight2 = new THREE.DirectionalLight(0xff6666, 0.4)
fillLight2.position.set(30, -40, -20)
scene.add(fillLight2)

// Model loading - TEST VERSION (just spaceship first)
const loader = new GLTFLoader()
let spaceship = null
let planets = []

// Simple test - load just spaceship
console.log('🔍 Attempting to load spaceship...')

loader.load(
    'models/Spaceship.glb',
    (gltf) => {
        console.log('✅ Spaceship loaded successfully!', gltf)
        spaceship = gltf.scene
        spaceship.scale.setScalar(1)
        spaceship.position.set(0, 0, 0)
        
        spaceship.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        
        scene.add(spaceship)
        startAnimation()
    },
    (progress) => {
        console.log('Loading spaceship progress:', Math.round(progress.loaded / progress.total * 100) + '%')
    },
    (error) => {
        console.error('❌ Error loading spaceship:', error)
        console.error('Check if models/spaceship.glb exists in your public folder')
        // Start animation anyway to show the scene
        startAnimation()
    }
)

// Camera controls
let cameraAngle = 0
let cameraRadius = 15
let cameraHeight = 5

// Basic controls - Added vertical movement
const keys = {
    w: false,      // Forward
    a: false,      // Rotate left  
    s: false,      // Backward
    d: false,      // Rotate right
    q: false,      // Roll left
    e: false,      // Roll right
    space: false,  // Move up
    shift: false   // Move down
}

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()
    if (keys.hasOwnProperty(key)) {
        keys[key] = true
    } else if (event.code === 'Space') {
        event.preventDefault() // Prevent page scroll
        keys.space = true
    } else if (event.key === 'Shift') {
        keys.shift = true
    }
})

window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase()
    if (keys.hasOwnProperty(key)) {
        keys[key] = false
    } else if (event.code === 'Space') {
        keys.space = false
    } else if (event.key === 'Shift') {
        keys.shift = false
    }
})

// Animation variables
let animationStarted = false

function startAnimation() {
    animationStarted = true
    
    // Position camera behind spaceship
    camera.position.set(0, cameraHeight, cameraRadius)
    camera.lookAt(0, 0, 0)
}

// Animation loop
function animate() {
    requestAnimationFrame(animate)
    
    if (!animationStarted) return
    
    // Rotate starfield slowly
    stars.rotation.y += 0.0002
    stars.rotation.x += 0.0001
    
    // Rotate planets
    planets.forEach((planet, index) => {
        if (planet) {
            planet.rotation.y += 0.005 + (index * 0.002)
            planet.rotation.x += 0.001
        }
    })
    
    // Basic spaceship movement (if loaded) - Added vertical controls
    if (spaceship) {
        // Handle movement
        if (keys.w) spaceship.translateZ(-0.8)      // Forward (increased speed)
        if (keys.s) spaceship.translateZ(0.8)       // Backward (increased speed)
        if (keys.a) spaceship.rotation.y += 0.03    // Rotate left (increased speed)
        if (keys.d) spaceship.rotation.y -= 0.03    // Rotate right (increased speed)
        if (keys.q) spaceship.rotation.z += 0.03    // Roll left (increased speed)
        if (keys.e) spaceship.rotation.z -= 0.03    // Roll right (increased speed)
        if (keys.space) spaceship.translateY(0.8)   // Move up
        if (keys.shift) spaceship.translateY(-0.8)  // Move down
        
        // Camera follows spaceship
        const spaceshipPos = spaceship.position
        const cameraOffset = new THREE.Vector3(0, cameraHeight, cameraRadius)
        
        // Apply spaceship's rotation to camera offset
        cameraOffset.applyQuaternion(spaceship.quaternion)
        
        camera.position.copy(spaceshipPos).add(cameraOffset)
        camera.lookAt(spaceshipPos)
    }
    
    // Animate point lights
    const time = Date.now() * 0.001
    pointLight1.position.x = Math.cos(time * 0.5) * 100
    pointLight1.position.z = Math.sin(time * 0.5) * 100
    
    pointLight2.position.x = Math.sin(time * 0.3) * 80
    pointLight2.position.y = Math.cos(time * 0.4) * 60
    
    renderer.render(scene, camera)
}

animate()

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Display controls
console.log(`
🎮 ENHANCED CONTROLS:
W/S - Move forward/backward
A/D - Rotate left/right  
Q/E - Roll left/right
SPACE - Move up ⬆️
SHIFT - Move down ⬇️
`)

// Loading screen helper
const loadingDiv = document.createElement('div')
loadingDiv.innerHTML = `
    <div style="margin-bottom: 20px;">🚀 Loading 3D models...</div>
    <div style="font-size: 14px; color: #aaaaaa;">
        Controls: WASD + Q/E + SPACE/SHIFT
    </div>
`
loadingDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #00ffff;
    font-family: Arial, sans-serif;
    font-size: 24px;
    z-index: 1000;
    text-align: center;
`
document.body.appendChild(loadingDiv)

// Remove loading screen when all models are loaded
function removeLoadingScreen() {
    if (loadedModels === totalModels) {
        setTimeout(() => {
            loadingDiv.remove()
        }, 1000)
    }
}

// Check for loading completion
setInterval(() => {
    if (loadedModels === totalModels && document.body.contains(loadingDiv)) {
        removeLoadingScreen()
    }
}, 100)
*/