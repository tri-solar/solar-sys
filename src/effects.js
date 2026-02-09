import * as THREE from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { scene, renderer, camera, sizes } from './scene.js'
import { sun, sunLight } from './planets.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

export const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    1.5,
    0.4,
    0.85 
)
composer.addPass(bloomPass)

const outputPass = new OutputPass()
composer.addPass(outputPass)

camera.layers.enable(1)

export let hdriLoaded = false
const pmremGenerator = new THREE.PMREMGenerator(renderer)
const hdrLoader = new HDRLoader()
hdrLoader.load('/textures/background/HDR_hazy_nebulae_4k.hdr', (texture) => {
  texture.flipY = false
  requestAnimationFrame(() => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.background = envMap
    scene.environment = envMap
    texture.dispose()
    pmremGenerator.dispose()
    hdriLoaded = true
  })
})

export const setupShadows = (allBodies) => {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.radius = 8

    allBodies.forEach(body => {
        body.receiveShadow = true
        body.castShadow = true
    })
}

export const ambientLight = new THREE.AmbientLight('#ffeddf', 0.025)
scene.add(ambientLight)
