import { composer } from './effects.js'
import { settingControls } from './utils.js'
import { sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, ceres, pluto } from './planets.js'
import { luna, phobos, deimos, io, europa, ganymede, callisto, titan, enceladus, triton, ring, uranusRing, asteroids } from './celestialBodies.js'
import { updateTooltips } from './interactions.js'

let startTime = performance.now()

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

const orbitData = [
    [mercury, 0.24, 6.78, 0.206],
    [venus, 0.615, 7.44, 0.007],
    [earth, 1, 8, 0.017],
    [mars, 1.88, 9.04, 0.093],
    [jupiter, 11.86, 16.4, 0.049],
    [saturn, 29.46, 25.08, 0.056],
    [uranus, 84.01, 44.38, 0.047],
    [neptune, 164.79, 66.14, 0.009],
    [ceres, 4.6, 12, 0.076],
    [pluto, 248, 98, 0.249]
]

export const updateMoonOrbit = (moon, parent, period, distance, elapsedTime) => {
    const angle = (elapsedTime / (period * 500)) * settingControls.speed
    const orbitRadius = parent.geometry.parameters.radius * 2 + distance
    moon.position.x = Math.cos(angle) * orbitRadius
    moon.position.z = Math.sin(angle) * orbitRadius
}

export const tick = () => {
    const elapsedTime = (performance.now() - startTime) * 0.001

    const allPlanets = [sun, mercury, venus, earth, mars, luna, phobos, deimos, jupiter, saturn, uranus, neptune, ceres, pluto, io, europa, ganymede, callisto, titan, enceladus, triton]
    allPlanets.forEach(planet => {
        if (rotationSpeeds[planet.uuid]) {
            planet.rotation.y += rotationSpeeds[planet.uuid] * settingControls.speed * 0.016
        }
    })


    ring.position.copy(saturn.position)
    uranusRing.position.copy(uranus.position)

    for(const asteroid of asteroids.children) {
        const angle = asteroid.userData.startAngle + elapsedTime * (0.01 + asteroid.position.y * 0.01) * settingControls.speed
        const radius = Math.sqrt(asteroid.position.x * asteroid.position.x + asteroid.position.z * asteroid.position.z)
        asteroid.position.x = Math.cos(angle) * radius
        asteroid.position.z = Math.sin(angle) * radius
    }

    orbitData.forEach(([planet, period, semiMajorAxis, eccentricity]) => {
        const angle = planet.userData.startAngle + (elapsedTime / (period * (period < 15 ? 100 : 20))) * settingControls.speed
        const b = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity)
        planet.position.x = Math.cos(angle) * semiMajorAxis
        planet.position.z = Math.sin(angle) * b
    })

    updateMoonOrbit(luna, earth, 0.0748, 0.3, elapsedTime)
    updateMoonOrbit(phobos, mars, 0.03, 0.15, elapsedTime)
    updateMoonOrbit(deimos, mars, 0.07, 0.25, elapsedTime)
    updateMoonOrbit(io, jupiter, 0.004, 0.4, elapsedTime)
    updateMoonOrbit(europa, jupiter, 0.009, 0.65, elapsedTime)
    updateMoonOrbit(ganymede, jupiter, 0.022, 1.0, elapsedTime)
    updateMoonOrbit(callisto, jupiter, 0.051, 1.5, elapsedTime)
    updateMoonOrbit(titan, saturn, 0.038, 1.2, elapsedTime)
    updateMoonOrbit(enceladus, saturn, 0.0074, 0.5, elapsedTime)
    updateMoonOrbit(triton, neptune, 0.063, 0.8, elapsedTime)

    const celestialBodies = [sun, mercury, venus, earth, mars, luna, phobos, deimos, jupiter, saturn, uranus, neptune, ceres, pluto, io, europa, ganymede, callisto, titan, enceladus, triton, ring, uranusRing]
    updateTooltips(celestialBodies)

    composer.render()
    requestAnimationFrame(tick)
}
