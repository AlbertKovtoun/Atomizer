import * as THREE from "three"
import Stats from "stats.js"
import { Pane } from "tweakpane"

import { Atomizer } from "./Atomizer"
import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { PostProcessing } from "./Postprocessing"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

export const pane = new Pane()

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

export const atomizer = new Atomizer()

export const sizes = new Sizes()

export const camera = new Camera()

export const renderer = new Renderer()

export const postProcessing = new PostProcessing()

//Animate
const clock = new THREE.Clock()

const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  atomizer.insideSphereMaterial.uniforms.uTime.value = elapsedTime
  atomizer.middleSphereMaterial.uniforms.uTime.value = elapsedTime
  atomizer.outsideSphereMaterial.uniforms.uTime.value = elapsedTime

  atomizer.insidePoints.rotation.y = elapsedTime * 0.2
  atomizer.middlePoints.rotation.y = elapsedTime * 0.2
  atomizer.dome.rotation.y = elapsedTime * 0.2

  // Update controls
  camera.controls.update()

  // Render
  // renderer.renderer.render(scene, camera.camera)
  postProcessing.composer.render()

  //Lock to 60fps
  setTimeout(() => {
    window.requestAnimationFrame(tick)
  }, 1000 / 60)

  stats.end()
}

tick()
