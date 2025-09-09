// Game constants
export const SPACESHIP_CONFIG = {
    maxSpeed: 2,
    acceleration: 0.1,
    deceleration: 0.95,
    turnSpeed: 0.025,
    initialPosition: { x: 0, y: 100, z: -400 }, // Further back and much higher for overview
    initialRotation: 0,
    floatAmplitude: 2,
    floatSpeed: 0.002,
    behindDistance: 25,
    heightOffset: 15
}

export const SCENE_CONFIG = {
    backgroundColor: 0x081040,
    starsCount: 8000,
    starsSize: 2,
    starsOpacity: 0.8,
    platformCount: 5,
    totalModels: 4
}

export const LIGHTING_CONFIG = {
    ambientLight: {
        color: 0x404040,
        intensity: 1.8 // Increased from 1.2 for brighter overall lighting
    },
    directionalLight: {
        color: 0xffffff,
        intensity: 3.0, // Increased intensity to light everything in front
        position: { x: 0, y: 150, z: -500 }, // Behind and above spaceship to light everything forward
        shadowMapSize: 2048
    },
    pointLight1: {
        color: 0x0088ff,
        intensity: 2.0, // Increased intensity
        distance: 500, // Increased range
        position: { x: -100, y: 120, z: -450 } // Behind and to the left of spaceship
    },
    pointLight2: {
        color: 0xff4400,
        intensity: 1.5, // Increased intensity
        distance: 400, // Increased range
        position: { x: 100, y: 80, z: -350 } // Behind and to the right of spaceship
    }
}

export const PLATFORM_CONFIG = {
    geometry: { width: 30, height: 2, depth: 30 },
    minY: -40,
    maxY: -10,
    spreadRange: 500
}

export const PLANET_POSITIONS = [
    { x: -300, y: 50, z: 150 },   // Planet1 - far left, good separation
    { x: 0, y: 30, z: 350 },      // Planet2 (Saturn) - center but much further out
    { x: 400, y: 70, z: 200 }     // Planet3 - far right, widely spaced
]

export const CONTROLS = {
    forward: ['KeyW', 'ArrowUp'],
    backward: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    reset: ['KeyR']
}
