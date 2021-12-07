import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass"
import { camera, pane, renderer, scene, sizes } from "./Experience"
import gsap from "gsap/all"

export class PostProcessing {
  constructor() {
    this.setPostProcessing()
    this.setPostProcessingTweaks()
    this.setPostProcessingAnimation()
  }

  setPostProcessing() {
    this.composer = new EffectComposer(renderer.renderer)

    const renderPass = new RenderPass(scene, camera.camera)
    this.composer.addPass(renderPass)

    this.unrealBloomPass = new UnrealBloomPass()
    this.unrealBloomPass.strength = 1.5
    this.unrealBloomPass.radius = 1
    // unrealBloomPass.threshold = 0.6
    this.composer.addPass(this.unrealBloomPass)
    // this.unrealBloomPass.enabled = false

    this.bokehPass = new BokehPass(scene, camera.camera, {
      focus: 4.5,
      aperture: 0.025,
      maxblur: 0.003,
    })
    this.composer.addPass(this.bokehPass)
  }

  setPostProcessingTweaks() {
    //Bloom Tweaks
    pane.addInput(this.unrealBloomPass, "strength", {
      label: "UnrealBloomPass Strength",
      min: 0,
      max: 20,
      step: 0.1,
    })

    //DOF Tweaks
    pane.addInput(this.bokehPass.uniforms.maxblur, "value", {
      label: "BokehPass Maxblur",
      min: 0,
      max: 0.02,
      step: 0.0001,
    })
  }

  setPostProcessingAnimation() {
    gsap.from(this.unrealBloomPass, {
      strength: 3,
      duration: 4,
    })
  }
}
