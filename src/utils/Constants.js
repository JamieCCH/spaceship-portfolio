// Game constants
export const SPACESHIP_CONFIG = {
    maxSpeed: 2,
    acceleration: 0.1,
    deceleration: 0.95,
    turnSpeed: 0.025,
    initialPosition: { x: 0, y: 5, z: 0 },
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
        intensity: 1.2
    },
    directionalLight: {
        color: 0xffffff,
        intensity: 2,
        position: { x: 50, y: 50, z: 50 },
        shadowMapSize: 2048
    },
    pointLight1: {
        color: 0x0088ff,
        intensity: 1.5,
        distance: 400,
        position: { x: 100, y: 50, z: -100 }
    },
    pointLight2: {
        color: 0xff4400,
        intensity: 1,
        distance: 300,
        position: { x: -80, y: -30, z: 120 }
    }
}

export const PLATFORM_CONFIG = {
    geometry: { width: 30, height: 2, depth: 30 },
    minY: -40,
    maxY: -10,
    spreadRange: 500
}

export const PLANET_POSITIONS = [
    { x: 200, y: 30, z: -300 },
    { x: -150, y: 25, z: 200 },
    { x: 300, y: 35, z: 100 }
]

export const CONTROLS = {
    forward: ['KeyW', 'ArrowUp'],
    backward: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    reset: ['KeyR']
}
