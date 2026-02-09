import * as THREE from 'three'
import { scene } from './scene.js'
import { planetsToScale } from './utils.js'

const textureLoader = new THREE.TextureLoader()

export { textureLoader }

export const createPlanet = (size, color, distance, parent = scene, storeForScale = true, name = '', textureFile = null) => {
    const geo = new THREE.SphereGeometry(size, 32, 32)
    let mat
    
    if (textureFile) {
        const texture = textureLoader.load(textureFile)
        texture.colorSpace = THREE.SRGBColorSpace
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

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32)
const sunTexture = textureLoader.load('/textures/sun/sun-color.webp')
sunTexture.colorSpace = THREE.SRGBColorSpace
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, toneMapped: false })
export const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.name = 'Sun'
sun.layers.enable(1)
scene.add(sun)

export const sunLight = new THREE.PointLight('#fceaca', 400, 200)
scene.add(sunLight)

export const mercury = createPlanet(0.07, '#aaaaaa', 6.78, scene, true, 'Mercury', '/textures/mercury/mercury-color-1k.webp')
export const venus = createPlanet(0.174, '#b38c5f', 7.44, scene, true, 'Venus', '/textures/venus/venus-color-1k.webp')
venus.rotation.z = Math.PI * (177 / 180) // 177° retrograde tilt

export const earth = createPlanet(0.184, '#0077ff', 8, scene, true, 'Earth', '/textures/earth/earth-color-1k.webp')
earth.rotation.z = Math.PI * (23.4 / 180) // 23.4° axial tilt

export const mars = createPlanet(0.098, '#ff3300', 9.04, scene, true, 'Mars', '/textures/mars/mars-color-1k.webp')
mars.rotation.z = Math.PI * (25.2 / 180) // 25.2° axial tilt

export const jupiter = createPlanet(2.024, '#7d4739', 16.4, scene, true, 'Jupiter', '/textures/jupiter/jupiter-color.webp')
jupiter.rotation.z = Math.PI * (3.1 / 180) // 3.1° axial tilt

export const saturn = createPlanet(1.748, '#be9352', 25.08, scene, true, 'Saturn', '/textures/saturn/saturn-color.webp')
saturn.rotation.z = Math.PI * (26.7 / 180) // 26.7° axial tilt

export const uranus = createPlanet(0.736, '#7fffd4', 44.38, scene, true, 'Uranus', '/textures/uranus/uranus-color.webp')
uranus.rotation.z = Math.PI * (97.8 / 180) // 97.8° extreme tilt

export const neptune = createPlanet(0.718, '#0000ff', 66.14, scene, true, 'Neptune', '/textures/neptune/neptune-color.webp')
neptune.rotation.z = Math.PI * (28.3 / 180) // 28.3° axial tilt

export const ceres = createPlanet(0.015, '#7b7b7b', 12, scene, true, 'Ceres')
export const pluto = createPlanet(0.035, '#a0a0a0', 98, scene, true, 'Pluto')
pluto.rotation.z = Math.PI * (120 / 180) // 120° axial tilt
