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

    console.log('Spaceship Portfolio Loading...')

    import * as THREE from 'three'
    
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
    
    // Create starfield
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 5000
    const positions = new Float32Array(starsCount * 3)
    
    for(let i = 0; i < starsCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000
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
    
    // Create a simple spaceship (for now, we'll use a basic shape)
    const spaceshipGeometry = new THREE.ConeGeometry(1, 4, 8)
    const spaceshipMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 })
    const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial)
    spaceship.rotation.x = Math.PI / 2 // Point forward
    scene.add(spaceship)
    
    // Position camera behind spaceship
    camera.position.set(0, 5, 10)
    camera.lookAt(spaceship.position)
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate)
        
        // Rotate starfield slowly
        stars.rotation.y += 0.0005
        
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