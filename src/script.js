import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import GUI from 'lil-gui'

const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()

// raycasting for tooltips
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const tooltip = document.getElementById('tooltip')

// sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32)
const sunTexture = textureLoader.load('/textures/sun/sun-color.webp')
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.name = 'Sun'
scene.add(sun)

const sunLight = new THREE.PointLight('#fceaca', 600, 200)
scene.add(sunLight)

// controls
const settingControls = {
    sunScale: 1,
    planetScale: 1,
    speed: 1
}

const scaleFolder = gui.addFolder('Scales')
scaleFolder.add({ label: 'Planet sizes are ~1:3.7 billion from actual, Orbital distances are ~1:149 billion from actual' }, 'label').disable()
scaleFolder.add(settingControls, 'sunScale', 0.1, 3, 0.1).onChange((value) => {
    sun.scale.set(value, value, value)
})

const planetsToScale = []

scaleFolder.add(settingControls, 'planetScale', 0.1, 3, 0.1).onChange((value) => {
    planetsToScale.forEach(p => p.scale.set(value, value, value))
})

gui.add(settingControls, 'speed', 0, 10, 0.1).name('Orbital Speed')

const createPlanet = (size, color, distance, parent = scene, storeForScale = true, name = '', textureFile = null) => {
    const geo = new THREE.SphereGeometry(size, 32, 32)
    let mat
    
    if (textureFile) {
        const texture = textureLoader.load(textureFile)
        mat = new THREE.MeshStandardMaterial({ map: texture })
    } else {
        mat = new THREE.MeshStandardMaterial({ color })
    }
    
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = distance
    mesh.userData.startAngle = Math.random() * Math.PI * 2
    mesh.name = name
    parent.add(mesh)
    if (storeForScale) planetsToScale.push(mesh)
    return mesh
}

// terrestrial planets
const mercury = createPlanet(0.07, '#aaaaaa', 6.78, scene, true, 'Mercury', '/textures/mercury/mercury-color-1k.webp')
const venus = createPlanet(0.174, '#b38c5f', 7.44, scene, true, 'Venus', '/textures/venus/venus-color-1k.webp')
venus.rotation.z = Math.PI * (177 / 180) // 177° retrograde tilt

const earth = createPlanet(0.184, '#0077ff', 8, scene, true, 'Earth', '/textures/earth/earth-color-1k.webp')
earth.rotation.z = Math.PI * (23.4 / 180) // 23.4° axial tilt

const mars = createPlanet(0.098, '#ff3300', 9.04, scene, true, 'Mars', '/textures/mars/mars-color-1k.webp')
mars.rotation.z = Math.PI * (25.2 / 180) // 25.2° axial tilt

// earth's moon
const luna = createPlanet(0.05, '#888888', 0.3, earth, false, 'Moon', '/textures/luna/moon-color-512.webp')

// mars' moons
const phobos = createPlanet(0.001, '#777777', 0.15, mars, false, 'Phobos')
const deimos = createPlanet(0.0005, '#666666', 0.25, mars, false, 'Deimos')

// asteroid belt
const asteroidMaterial = new THREE.MeshStandardMaterial({})
const asteroids = new THREE.Group()
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

// gas giants
const jupiter = createPlanet(2.024, '#7d4739', 16.4, scene, true, 'Jupiter', '/textures/jupiter/jupiter-color.webp')
jupiter.rotation.z = Math.PI * (3.1 / 180) // 3.1° axial tilt

const saturn = createPlanet(1.748, '#be9352', 25.08, scene, true, 'Saturn', '/textures/saturn/saturn-color.webp')
saturn.rotation.z = Math.PI * (26.7 / 180) // 26.7° axial tilt

const uranus = createPlanet(0.736, '#7fffd4', 44.38, scene, true, 'Uranus', '/textures/uranus/uranus-color.webp')
uranus.rotation.z = Math.PI * (97.8 / 180) // 97.8° extreme tilt

const neptune = createPlanet(0.718, '#0000ff', 66.14, scene, true, 'Neptune', '/textures/neptune/neptune-color.webp')
neptune.rotation.z = Math.PI * (28.3 / 180) // 28.3° axial tilt

// jupiter moons
const io = createPlanet(0.06, '#ffcc00', 0.4, jupiter, false, 'Io')
const europa = createPlanet(0.045, '#ccddff', 0.65, jupiter, false, 'Europa')
const ganymede = createPlanet(0.075, '#aaaaaa', 1.0, jupiter, false, 'Ganymede')
const callisto = createPlanet(0.07, '#888888', 1.5, jupiter, false, 'Callisto')

// saturns rings
const innerRadius = 2.3
const outerRadius = 3.7
const segments = 128

const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments)

const uvs = ringGeometry.attributes.uv
const pos = ringGeometry.attributes.position
const v2 = new THREE.Vector2()

// uv mapping (big brain)
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
  transparent: true
})

const ring = new THREE.Mesh(ringGeometry, ringMaterial)
ring.name = "Saturn's Rings"
ring.rotation.x = -Math.PI / 2.5
scene.add(ring)

// saturn moons
const titan = createPlanet(0.075, '#ff9933', 1.2, saturn, false, 'Titan')
const enceladus = createPlanet(0.007, '#ffffff', 0.5, saturn, false, 'Enceladus')

// uranus rings
const uranusRingGeometry = new THREE.RingGeometry(0.96, 1.4, 64)
const uranusRingMaterial = new THREE.MeshStandardMaterial({ color: '#afeeee', side: THREE.DoubleSide })
const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial)
uranusRing.name = "Uranus's Rings"
uranusRing.rotation.x = -Math.PI / 2.5
scene.add(uranusRing)

// neptune moon
const triton = createPlanet(0.07, '#ddddff', 0.8, neptune, false, 'Triton')

// dwarf planets
const ceres = createPlanet(0.015, '#7b7b7b', 12, scene, true, 'Ceres')
const pluto = createPlanet(0.035, '#a0a0a0', 98, scene, true, 'Pluto')
pluto.rotation.z = Math.PI * (120 / 180) // 120° axial tilt

// ambient light
const ambientLight = new THREE.AmbientLight('#ffeddf', 0.025)
scene.add(ambientLight)

// sizing
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// mouse tracking for tooltips
let mouseEvent = null
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    mouseEvent = event
})

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 1.25, 14)
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// load HDRI background asynchronously
let hdriLoaded = false
const pmremGenerator = new THREE.PMREMGenerator(renderer)
const hdrLoader = new HDRLoader()
hdrLoader.load('/textures/background/HDR_hazy_nebulae_4k.hdr', (texture) => {
  // defer PMREM processing to next frame to avoid lag spike
  requestAnimationFrame(() => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.background = envMap
    scene.environment = envMap
    texture.dispose()
    pmremGenerator.dispose()
    hdriLoaded = true
  })
})

// shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// set up shadows for all celestial bodies
const allBodies = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, ceres, pluto, luna, phobos, deimos, io, europa, ganymede, callisto, titan, enceladus, triton, ring, uranusRing]

sunLight.castShadow = true
sunLight.shadow.mapSize.width = 2048
sunLight.shadow.mapSize.height = 2048
sunLight.shadow.radius = 8

allBodies.forEach(body => {
    body.receiveShadow = true
    body.castShadow = true
})

ring.castShadow = false
uranusRing.castShadow = false

// animation loop
let startTime = performance.now()

const tick = () => {
    const elapsedTime = (performance.now() - startTime) * 0.001

    // planet axial rotations
    const rotationSpeeds = {
        [sun.uuid]: 0.004,
        [mercury.uuid]: 0.0008,
        [venus.uuid]: -0.0004,
        [earth.uuid]: 0.01,
        [mars.uuid]: 0.0097,
        [jupiter.uuid]: 0.02,
        [saturn.uuid]: 0.018,
        [uranus.uuid]: 0.014,
        [neptune.uuid]: 0.016,
        [luna.uuid]: 0.003,
        [phobos.uuid]: 0.03,
        [deimos.uuid]: 0.008,
        [ceres.uuid]: 0.01,
        [pluto.uuid]: 0.005,
        [io.uuid]: 0.015,
        [europa.uuid]: 0.01,
        [ganymede.uuid]: 0.012,
        [callisto.uuid]: 0.008,
        [titan.uuid]: 0.005,
        [enceladus.uuid]: 0.02,
        [triton.uuid]: -0.015
    }

    const allPlanets = [sun, mercury, venus, earth, mars, luna, phobos, deimos, jupiter, saturn, uranus, neptune, ceres, pluto, io, europa, ganymede, callisto, titan, enceladus, triton]
    allPlanets.forEach(planet => {
        if (rotationSpeeds[planet.uuid]) {
            planet.rotation.y += rotationSpeeds[planet.uuid] * settingControls.speed * 0.016
        }
    })

    // update ring positions
    ring.position.copy(saturn.position)
    uranusRing.position.copy(uranus.position)

    // update asteroid belt
    for(const asteroid of asteroids.children) {
        const angle = asteroid.userData.startAngle + elapsedTime * (0.01 + asteroid.position.y * 0.01) * settingControls.speed
        const radius = Math.sqrt(asteroid.position.x * asteroid.position.x + asteroid.position.z * asteroid.position.z)
        asteroid.position.x = Math.cos(angle) * radius
        asteroid.position.z = Math.sin(angle) * radius
    }

    // update planet orbits
    const orbitData = [
        [mercury, 0.24, 6.78],
        [venus, 0.615, 7.44],
        [earth, 1, 8],
        [mars, 1.88, 9.04],
        [jupiter, 11.86, 16.4],
        [saturn, 29.46, 25.08],
        [uranus, 84.01, 44.38],
        [neptune, 164.79, 66.14],
        [ceres, 4.6, 12],
        [pluto, 248, 98]
    ]

    orbitData.forEach(([planet, period, distance]) => {
        const angle = planet.userData.startAngle + (elapsedTime / (period * (period < 15 ? 100 : 20))) * settingControls.speed
        planet.position.x = Math.cos(angle) * distance
        planet.position.z = Math.sin(angle) * distance
    })

    // earth's moon
    updateMoonOrbit(luna, earth, 0.0748, 0.3, elapsedTime)

    // mars' moons
    updateMoonOrbit(phobos, mars, 0.03, 0.15, elapsedTime)
    updateMoonOrbit(deimos, mars, 0.07, 0.25, elapsedTime)

    // jupiter's moons
    updateMoonOrbit(io, jupiter, 0.004, 0.4, elapsedTime)
    updateMoonOrbit(europa, jupiter, 0.009, 0.65, elapsedTime)
    updateMoonOrbit(ganymede, jupiter, 0.022, 1.0, elapsedTime)
    updateMoonOrbit(callisto, jupiter, 0.051, 1.5, elapsedTime)

    // saturn's moons
    updateMoonOrbit(titan, saturn, 0.038, 1.2, elapsedTime)
    updateMoonOrbit(enceladus, saturn, 0.0074, 0.5, elapsedTime)

    // neptune's moon
    updateMoonOrbit(triton, neptune, 0.063, 0.8, elapsedTime)

    // raycasting for tooltips
    raycaster.setFromCamera(mouse, camera)
    const celestialBodies = [sun, mercury, venus, earth, mars, luna, phobos, deimos, jupiter, saturn, uranus, neptune, ceres, pluto, io, europa, ganymede, callisto, titan, enceladus, triton, ring, uranusRing]
    const intersects = raycaster.intersectObjects(celestialBodies)
    
    if (intersects.length > 0 && mouseEvent) {
        const object = intersects[0].object
        tooltip.textContent = object.name
        tooltip.classList.add('visible')
        tooltip.style.left = mouseEvent.clientX + 10 + 'px'
        tooltip.style.top = mouseEvent.clientY + 10 + 'px'
    } else {
        tooltip.classList.remove('visible')
    }

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

const updateMoonOrbit = (moon, parent, period, distance, elapsedTime) => {
    const angle = (elapsedTime / (period * 500)) * settingControls.speed
    const orbitRadius = parent.geometry.parameters.radius * 2 + distance
    moon.position.x = Math.cos(angle) * orbitRadius
    moon.position.z = Math.sin(angle) * orbitRadius
}

tick()