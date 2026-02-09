import { scene, camera, renderer, sizes } from './scene.js'

import { sun, sunLight, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, ceres, pluto } from './planets.js'
import { luna, phobos, deimos, io, europa, ganymede, callisto, titan, enceladus, triton, ring, uranusRing, asteroids } from './celestialBodies.js'

import { ambientLight, setupShadows } from './effects.js'

import { tick } from './animation.js'

const allBodies = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, ceres, pluto, luna, phobos, deimos, io, europa, ganymede, callisto, titan, enceladus, triton, ring, uranusRing]

ring.castShadow = false
uranusRing.castShadow = false

setupShadows(allBodies)

tick()