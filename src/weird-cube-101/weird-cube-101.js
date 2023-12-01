import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Canvas
const elCanvas = document.querySelector('[data-canvas]')

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }
let aspectRatio = sizes.width / sizes.height

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)
//or 
// const positionArray = new Float32Array(9)
// // vertex 1
// positionArray[0] = 0
// positionArray[1] = 0
// positionArray[2] = 0

// // vertex 2
// positionArray[3] = 0
// positionArray[4] = 0
// positionArray[5] = 0

// // vertex 3
// positionArray[6] = 0
// positionArray[7] = 0
// positionArray[8] = 0

// or 
// const positionArray = new Float32Array([
//   0, 0, 0,
//   0, 1, 0,
//   1, 0, 0,
// ])

// const positionsAttribute = new THREE.BufferAttribute(positionArray, 3)
// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position', positionsAttribute)

// or
const geometry = new THREE.BufferGeometry()
const count = 3 //number of triangles
const positionsArray = new Float32Array(count * 3 * 3)
for (let i = 0; i < count * 3 * 3; i++) {
  // positionsArray[i] = Math.random() - 0.5 // centered
  positionsArray[i] = (Math.random() - 0.5) * 1
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})


const mesh = new THREE.Mesh(
  geometry,
  material
)

scene.add(mesh)

let newCount = 4
setInterval(() => {
  if (isAddingTriangles === true && newCount < 10000) {
    newCount++
  } else {
    if (newCount > 3) {
      newCount = newCount - 2
    }
  }


  const newGeometry = new THREE.BufferGeometry()
  const newPositionsArray = new Float32Array(newCount * 3 * 3)
  for (let i = 0; i < newCount * 3 * 3; i++) {
    newPositionsArray[i] = (Math.random() - 0.5) * 1
  }

  const newPositionsAttribute = new THREE.BufferAttribute(newPositionsArray, 3)
  newGeometry.setAttribute('position', newPositionsAttribute)

  mesh.geometry.dispose()
  mesh.geometry = newGeometry
}, 1);

// Camera
const fov = 75 // Field of View
const camera = new THREE.PerspectiveCamera(
  fov, 
  aspectRatio,
  0.1,
  100
)

camera.position.z = 3
// camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, elCanvas)
controls.enableDamping = true

// Axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: elCanvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let cursorTarget = { x:0, y: 0}
let cubePosition = { x:0, y: 0}
const dampingCubePosition = 0.08
let isAddingTriangles = false;

const lerp = (start, end, amt)  => {
  return start * (1 - amt) + end * amt
}

// Animate
const tick = () => {
  cubePosition.x = lerp(cubePosition.x, cursorTarget.x, dampingCubePosition)
  cubePosition.y = lerp(cubePosition.y, cursorTarget.y, dampingCubePosition)
  // console.log(cubePosition.x)
  mesh.rotateY(cubePosition.x * 0.01)
  mesh.rotateX(cubePosition.y * 0.005)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}
tick()

const onResize = () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  aspectRatio = sizes.width / sizes.height
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', onResize)

window.addEventListener('dblclick', () => {
  const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement

  if(!isFullScreen) {
    if(elCanvas.requestFullscreen) {
      elCanvas.requestFullscreen()
    } else if(elCanvas.webkitRequestFullscreen) {
      elCanvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

window.addEventListener('mousemove', (e) => {
  cursorTarget.x = e.clientX / window.innerWidth
  cursorTarget.x = cursorTarget.x > 0.5 ? (cursorTarget.x - 0.5) : (-0.5 + cursorTarget.x)

  cursorTarget.y = e.clientY / window.innerHeight
  cursorTarget.y = cursorTarget.y > 0.5 ? (cursorTarget.y - 0.5) : (-0.5 + cursorTarget.y)
})

document.querySelector('[data-hover-top]').addEventListener('mouseenter', () => {
  isAddingTriangles = true;
})

document.querySelector('[data-hover-top]').addEventListener('mouseleave', () => {
  isAddingTriangles = false;
})