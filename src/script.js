console.log('🚀 Space Portfolio Loading... Updated:', new Date().toISOString())
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x081040)

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

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(50, 50, 50)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

const pointLight1 = new THREE.PointLight(0x0088ff, 1.5, 400)
pointLight1.position.set(100, 50, -100)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0xff4400, 1, 300)
pointLight2.position.set(-80, -30, 120)
scene.add(pointLight2)

// Create invisible ground plane for physics reference
const groundGeometry = new THREE.PlaneGeometry(5000, 5000)
const groundMaterial = new THREE.MeshBasicMaterial({ 
    visible: false // Invisible but still affects physics
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.position.y = -50
ground.receiveShadow = true
scene.add(ground)

// Add some floating platforms/areas
const platforms = []
for(let i = 0; i < 5; i++) {
    const platformGeometry = new THREE.BoxGeometry(30, 2, 30)
    const platformMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(i * 0.2, 0.5, 0.3),
        transparent: true,
        opacity: 0.8
    })
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    
    platform.position.set(
        (Math.random() - 0.5) * 500,
        Math.random() * 20,
        (Math.random() - 0.5) * 500
    )
    platform.castShadow = true
    platform.receiveShadow = true
    platforms.push(platform)
    scene.add(platform)
}

// Model loading
const loader = new GLTFLoader()
let spaceship = null
let planets = []
let loadedModels = 0
const totalModels = 4

// Simple car-like physics for spaceship
const spaceshipPhysics = {
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0,
    maxSpeed: 3,
    acceleration: 0.15,
    deceleration: 0.95,
    turnSpeed: 0.03,
    position: new THREE.Vector3(0, 5, 0),
    rotation: 0,
    wheelAngle: 0,
    wheelAngleTarget: 0,
    banking: 0,
    bankingTarget: 0
}

// Simple controls
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
}

// Event listeners
window.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = true
            break
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = true
            break
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = true
            break
        case 'KeyD':
        case 'ArrowRight':
            keys.right = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = false
            break
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = false
            break
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = false
            break
        case 'KeyD':
        case 'ArrowRight':
            keys.right = false
            break
    }
})

// Loading progress
function onModelLoaded() {
    loadedModels++
    console.log(`✅ Models loaded: ${loadedModels}/${totalModels}`)
    
    if(loadedModels === totalModels) {
        console.log('🌟 All models loaded! Ready to fly!')
        startAnimation()
    }
}

// Create simple spaceship if model fails
function createSimpleSpaceship() {
    const group = new THREE.Group()
    
    // Main body
    const bodyGeometry = new THREE.ConeGeometry(1, 4, 8)
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.rotation.x = Math.PI / 2
    body.castShadow = true
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(3, 0.2, 1)
    const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 })
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial)
    leftWing.position.set(-1.5, 0, -1)
    leftWing.castShadow = true
    
    const rightWing = leftWing.clone()
    rightWing.position.set(1.5, 0, -1)
    rightWing.castShadow = true
    
    // Engine glow
    const engineGeometry = new THREE.SphereGeometry(0.3, 8, 6)
    const engineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00aaff,
        emissive: 0x004488
    })
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial)
    leftEngine.position.set(-0.8, 0, 1.5)
    
    const rightEngine = leftEngine.clone()
    rightEngine.position.set(0.8, 0, 1.5)
    
    group.add(body, leftWing, rightWing, leftEngine, rightEngine)
    return group
}

// Load spaceship
loader.load(
    'models/Spaceship.glb',
    (gltf) => {
        spaceship = gltf.scene
        spaceship.scale.setScalar(1.5)
        setupSpaceship()
        console.log('🚀 Spaceship loaded!')
        onModelLoaded()
    },
    (progress) => {
        console.log('Loading spaceship...', Math.round(progress.loaded / progress.total * 100) + '%')
    },
    (error) => {
        console.error('Creating placeholder spaceship...')
        spaceship = createSimpleSpaceship()
        setupSpaceship()
        onModelLoaded()
    }
)

function setupSpaceship() {
    spaceship.position.copy(spaceshipPhysics.position)
    spaceship.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    scene.add(spaceship)
}

// Load planets
const planetPositions = [
    { x: 200, y: 30, z: -300 },
    { x: -150, y: 25, z: 200 },
    { x: 300, y: 35, z: 100 }
]

for(let i = 1; i <= 3; i++) {
    loader.load(
        `models/Planet${i}.glb`,
        (gltf) => {
            const planet = gltf.scene
            const scale = 20 + Math.random() * 25
            planet.scale.setScalar(scale)
            
            const pos = planetPositions[i - 1]
            planet.position.set(pos.x, pos.y, pos.z)
            
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
            console.error(`Creating placeholder planet ${i}...`)
            const planetGeometry = new THREE.SphereGeometry(25, 32, 16)
            const planetMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
            })
            const planet = new THREE.Mesh(planetGeometry, planetMaterial)
            const pos = planetPositions[i - 1]
            planet.position.set(pos.x, pos.y, pos.z)
            planet.castShadow = true
            planet.receiveShadow = true
            scene.add(planet)
            planets.push(planet)
            onModelLoaded()
        }
    )
}

// Animation variables
let animationStarted = false
let cameraOffset = new THREE.Vector3(0, 15, 25)

function startAnimation() {
    animationStarted = true
    updateCamera()
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate)
    
    if (!animationStarted || !spaceship) return
    
    // Update physics
    updateSpaceshipPhysics()
    
    // Apply physics to spaceship
    spaceship.position.copy(spaceshipPhysics.position)
    spaceship.rotation.y = spaceshipPhysics.rotation
    spaceship.rotation.z = spaceshipPhysics.banking
    
    // Update camera
    updateCamera()
    
    // Rotate starfield
    stars.rotation.y += 0.0003
    stars.rotation.x += 0.0001
    
    // Rotate planets
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.005 + (index * 0.002)
        planet.rotation.x += 0.001
    })
    
    // Animate lights
    const time = Date.now() * 0.001
    pointLight1.position.x = Math.cos(time * 0.5) * 150
    pointLight1.position.z = Math.sin(time * 0.5) * 150
    
    pointLight2.position.x = Math.sin(time * 0.3) * 100
    pointLight2.position.y = Math.cos(time * 0.4) * 50
    
    renderer.render(scene, camera)
}

function updateSpaceshipPhysics() {
    // Simple car-like controls
    let accelerating = false
    
    // Forward/backward
    if (keys.forward) {
        spaceshipPhysics.speed += spaceshipPhysics.acceleration
        accelerating = true
    }
    if (keys.backward) {
        spaceshipPhysics.speed -= spaceshipPhysics.acceleration * 0.7
        accelerating = true
    }
    
    // Apply deceleration when not accelerating
    if (!accelerating) {
        spaceshipPhysics.speed *= spaceshipPhysics.deceleration
    }
    
    // Limit speed
    spaceshipPhysics.speed = Math.max(-spaceshipPhysics.maxSpeed * 0.7, 
                                     Math.min(spaceshipPhysics.maxSpeed, spaceshipPhysics.speed))
    
    // Turning (only when moving)
    if (Math.abs(spaceshipPhysics.speed) > 0.1) {
        if (keys.left) {
            spaceshipPhysics.rotation += spaceshipPhysics.turnSpeed * (spaceshipPhysics.speed / spaceshipPhysics.maxSpeed)
            spaceshipPhysics.wheelAngleTarget = 0.5
            spaceshipPhysics.bankingTarget = -0.3
        } else if (keys.right) {
            spaceshipPhysics.rotation -= spaceshipPhysics.turnSpeed * (spaceshipPhysics.speed / spaceshipPhysics.maxSpeed)
            spaceshipPhysics.wheelAngleTarget = -0.5
            spaceshipPhysics.bankingTarget = 0.3
        } else {
            spaceshipPhysics.wheelAngleTarget = 0
            spaceshipPhysics.bankingTarget = 0
        }
    } else {
        spaceshipPhysics.wheelAngleTarget = 0
        spaceshipPhysics.bankingTarget = 0
    }
    
    // Smooth wheel angle and banking
    spaceshipPhysics.wheelAngle = THREE.MathUtils.lerp(spaceshipPhysics.wheelAngle, spaceshipPhysics.wheelAngleTarget, 0.1)
    spaceshipPhysics.banking = THREE.MathUtils.lerp(spaceshipPhysics.banking, spaceshipPhysics.bankingTarget, 0.05)
    
    // Update position based on rotation and speed
    const direction = new THREE.Vector3(
        Math.sin(spaceshipPhysics.rotation),
        0,
        Math.cos(spaceshipPhysics.rotation)
    )
    direction.multiplyScalar(spaceshipPhysics.speed)
    spaceshipPhysics.position.add(direction)
    
    // Keep spaceship above ground with gentle floating
    const targetY = 5 + Math.sin(Date.now() * 0.002) * 2
    spaceshipPhysics.position.y = THREE.MathUtils.lerp(spaceshipPhysics.position.y, targetY, 0.02)
}

function updateCamera() {
    // Follow spaceship
    const spaceshipPos = spaceshipPhysics.position
    const cameraTarget = spaceshipPos.clone().add(cameraOffset)
    
    // Apply spaceship rotation to camera offset
    const rotatedOffset = cameraOffset.clone()
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), spaceshipPhysics.rotation)
    cameraTarget.copy(spaceshipPos).add(rotatedOffset)
    
    // Smooth camera movement
    camera.position.lerp(cameraTarget, 0.05)
    
    // Look at spaceship with slight forward bias
    const lookTarget = spaceshipPos.clone()
    const forwardBias = new THREE.Vector3(
        Math.sin(spaceshipPhysics.rotation) * 10,
        0,
        Math.cos(spaceshipPhysics.rotation) * 10
    )
    lookTarget.add(forwardBias)
    
    camera.lookAt(lookTarget)
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
🎮 SPACE CAR CONTROLS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 WASD or Arrow Keys
W/↑ - Accelerate forward
S/↓ - Reverse / Brake
A/← - Turn left
D/→ - Turn right
━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

// Loading screen
const loadingDiv = document.createElement('div')
loadingDiv.innerHTML = `
    <div style="margin-bottom: 25px; font-size: 36px;">🚀</div>
    <div style="margin-bottom: 20px;">Loading...</div>
    <div style="font-size: 16px; color: #aaaaaa; margin-bottom: 15px;">
        Jamie CC Huang Portfolio
    </div>
    <div style="font-size: 14px; color: #666666; line-height: 1.6;">
        Controls: WASD | Arrow Keys<br>
    </div>
`
loadingDiv.style.cssText = `
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
document.body.appendChild(loadingDiv)

// Create control instructions overlay
const controlsDiv = document.createElement('div')
controlsDiv.innerHTML = `
    <div style="font-size: 18px; margin-bottom: 10px; color: #00ffff;">🚀 CONTROLS</div>
    <div style="font-size: 14px; line-height: 1.8; color: #ffffff;">
        <div><strong>W</strong> or <strong>↑</strong> - Accelerate</div>
        <div><strong>S</strong> or <strong>↓</strong> - Reverse</div>
        <div><strong>A</strong> or <strong>←</strong> - Turn Left</div>
        <div><strong>D</strong> or <strong>→</strong> - Turn Right</div>
    </div>
    <div style="font-size: 12px; margin-top: 10px; color: #888888;">
    [Jamie CC Huang Portfolio]
    </div>
`
controlsDiv.style.cssText = `
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
document.body.appendChild(controlsDiv)

// Remove loading screen and show controls
function removeLoadingScreen() {
    if (loadedModels === totalModels) {
        setTimeout(() => {
            if (document.body.contains(loadingDiv)) {
                loadingDiv.style.transition = 'opacity 1s ease-out'
                loadingDiv.style.opacity = '0'
                setTimeout(() => {
                    loadingDiv.remove()
                    // Show controls after loading screen is gone
                    controlsDiv.style.display = 'block'
                    controlsDiv.style.opacity = '0'
                    controlsDiv.style.transition = 'opacity 1s ease-in'
                    setTimeout(() => {
                        controlsDiv.style.opacity = '1'
                    }, 100)
                }, 1000)
            }
        }, 1500)
    }
}

setInterval(() => {
    if (loadedModels === totalModels && document.body.contains(loadingDiv)) {
        removeLoadingScreen()
    }
}, 100)