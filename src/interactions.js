import * as THREE from 'three'
import { camera } from './scene.js'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const tooltip = document.querySelector('.tooltip')

export { raycaster, mouse, tooltip }

let mouseEvent = null

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    mouseEvent = event
})

export const updateTooltips = (celestialBodies) => {
    raycaster.setFromCamera(mouse, camera)
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
}
