import * as THREE from 'three'
import { scene } from './scene.js'
import { createPlanet, textureLoader, earth, mars, saturn, jupiter, neptune, uranus } from './planets.js'

export const luna = createPlanet(0.05, '#888888', 0.3, earth, false, 'Moon', '/textures/luna/moon-color-512.webp')

export const phobos = createPlanet(0.001, '#777777', 0.15, mars, false, 'Phobos')
export const deimos = createPlanet(0.0005, '#666666', 0.25, mars, false, 'Deimos')

export const io = createPlanet(0.06, '#ffcc00', 0.4, jupiter, false, 'Io')
export const europa = createPlanet(0.045, '#ccddff', 0.65, jupiter, false, 'Europa')
export const ganymede = createPlanet(0.075, '#aaaaaa', 1.0, jupiter, false, 'Ganymede')
export const callisto = createPlanet(0.07, '#888888', 1.5, jupiter, false, 'Callisto')

const innerRadius = 2.3
const outerRadius = 3.7
const segments = 128

const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

const uvs = ringGeometry.attributes.uv
const pos = ringGeometry.attributes.position
const v2 = new THREE.Vector2()

for (let i = 0; i < pos.count; i++) {
  v2.fromBufferAttribute(pos, i)
  const r = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
  const radiusT = (r - innerRadius) / (outerRadius - innerRadius)
  const angle = Math.atan2(v2.y, v2.x)
  const angleT = (angle + Math.PI) / (Math.PI * 2)

  uvs.setXY(i, radiusT, angleT)
}
uvs.needsUpdate = true

const ringTexture = textureLoader.load('/textures/saturn/2k_saturn_ring_alpha.png')
ringTexture.wrapS = THREE.ClampToEdgeWrapping
ringTexture.wrapT = THREE.RepeatWrapping

const ringMaterial = new THREE.MeshStandardMaterial({
  map: ringTexture,
  side: THREE.DoubleSide,
  transparent: true,
  alphaTest: 0.5,
  metalness: 0.2,
  roughness: 0.8
})

export const ring = new THREE.Mesh(ringGeometry, ringMaterial)
ring.name = "Saturn's Rings"
ring.rotation.x = -Math.PI / 2.5
ring.castShadow = false
ring.receiveShadow = false
scene.add(ring)

export const titan = createPlanet(0.075, '#ff9933', 1.2, saturn, false, 'Titan')
export const enceladus = createPlanet(0.007, '#ffffff', 0.5, saturn, false, 'Enceladus')

const uranusRingGeometry = new THREE.RingGeometry(0.96, 1.4, 64)
const uranusRingMaterial = new THREE.MeshStandardMaterial({ color: '#afeeee', side: THREE.DoubleSide })
export const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial)
uranusRing.name = "Uranus's Rings"
uranusRing.rotation.x = -Math.PI / 2.5
scene.add(uranusRing)

export const triton = createPlanet(0.07, '#ddddff', 0.8, neptune, false, 'Triton')

const asteroidMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.3,
    roughness: 0.8
})
export const asteroids = new THREE.Group()
scene.add(asteroids)

for (let i = 0; i < 1000; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 9.75 + Math.random() * 3
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const scale = 0.01 + Math.random() * 0.015
    const asteroidGeometry = new THREE.BoxGeometry(scale, scale * 1.2, scale * 1.1)
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial)
    asteroid.position.set(x, Math.random() * 0.4, z)
    asteroid.rotation.x = (Math.random() - 0.5) * 0.4
    asteroid.rotation.y = (Math.random() - 0.5) * 0.4
    asteroid.rotation.z = (Math.random() - 0.5) * 0.4
    asteroid.userData.startAngle = angle
    asteroids.add(asteroid)
}
