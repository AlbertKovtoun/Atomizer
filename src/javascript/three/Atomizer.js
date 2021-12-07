import * as THREE from "three"

import { pane, scene } from "./Experience"

import insideSphereVertexShader from "../../shaders/insideSphere/vertex.glsl"
import insideSphereFragmentShader from "../../shaders/insideSphere/fragment.glsl"

import middleSphereVertexShader from "../../shaders/middleSphere/vertex.glsl"
import middleSphereFragmentShader from "../../shaders/middleSphere/fragment.glsl"

import outsideSphereVertexShader from "../../shaders/outsideSphere/vertex.glsl"
import outsideSphereFragmentShader from "../../shaders/outsideSphere/fragment.glsl"

export class Atomizer {
  constructor() {
    this.debugObject = {
      insideParticleSphereColor: "violet",
      middleParticleSphereColor: "white",
      domeColor: "skyblue",
      outsideParticleSphereColor: "white",
    }

    this.outsideParticles = new THREE.Vector3()

    this.setDome()
    this.setInsideParticleSphere()
    this.setMiddleParticleSphere()
    this.setOutsideParticleSphere()

    this.setAtomizerTweaks()
  }

  randomPointOnSphere(radius) {
    const x = THREE.Math.randFloat(-1, 1)
    const y = THREE.Math.randFloat(-1, 1)
    const z = THREE.Math.randFloat(-1, 1)
    const normalizationFactor = 1 / Math.sqrt(x * x + y * y + z * z)

    this.outsideParticles.x = x * normalizationFactor * radius
    this.outsideParticles.y = y * normalizationFactor * radius
    this.outsideParticles.z = z * normalizationFactor * radius

    return this.outsideParticles
  }

  setDome() {
    this.domeGeometry = new THREE.SphereGeometry(1.5, 15, 15)
    this.domeMaterial = new THREE.MeshBasicMaterial({
      color: this.debugObject.domeColor,
      wireframe: true,
    })
    this.dome = new THREE.Mesh(this.domeGeometry, this.domeMaterial)
    scene.add(this.dome)
  }

  setInsideParticleSphere() {
    const particleCount = 20000

    const geometry = new THREE.BufferGeometry()

    const positions = []
    const positionVectors = []
    const randoms = new Float32Array(particleCount)
    const colors = []

    const color = new THREE.Color()

    const n = 1.2,
      n2 = n / 2 // particles spread in the sphere + put sphere in center

    for (let i = 0; i < particleCount; i++) {
      // positions
      const x = Math.random() * n - n2
      const y = Math.random() * n - n2
      const z = Math.random() * n - n2

      positionVectors.push(new THREE.Vector3(x, y, z))

      if (positionVectors[i].distanceTo(new THREE.Vector3(0, 0, 0)) < n / 2) {
        positions.push(x, y, z)
        randoms[i] = Math.random()
      }

      // Colors
      // const vx = x / n + 0.5
      // const vy = y / n + 0.5
      // const vz = z / n + 0.5

      // color.setRGB(vx, vy, vz)

      // colors.push(color.r, color.g, color.b)
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1))
    // geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    geometry.computeBoundingSphere()

    // const material = new THREE.PointsMaterial({
    //   color: "white",
    //   size: 0.02,
    //   transparent: true,
    //   // vertexColors: true,
    // })

    this.insideSphereMaterial = new THREE.ShaderMaterial({
      vertexShader: insideSphereVertexShader,
      fragmentShader: insideSphereFragmentShader,
      transparent: true,

      uniforms: {
        uTime: { value: 0 },
        uColor: {
          value: new THREE.Color(this.debugObject.insideParticleSphereColor),
        },
      },
    })

    this.insidePoints = new THREE.Points(geometry, this.insideSphereMaterial)
    scene.add(this.insidePoints)
  }

  setAtomizerTweaks() {
    pane.addInput(this.debugObject, "domeColor").on("change", (val) => {
      //!2 Ways to change color in debugger
      //Solution 1
      // this.domeMaterial.color = new THREE.Color(this.debugObject.domeColor)

      //Solution 2
      this.domeMaterial.color = new THREE.Color(val.value)
    })
  }

  setMiddleParticleSphere() {
    const particleAmount = 2000
    const geometry = new THREE.BufferGeometry()
    let positions = []

    for (var i = 0; i < particleAmount; i++) {
      var vertex = this.randomPointOnSphere(0.8)
      positions.push(vertex.x, vertex.y, vertex.z)
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    )

    this.middleSphereMaterial = new THREE.ShaderMaterial({
      vertexShader: middleSphereVertexShader,
      fragmentShader: middleSphereFragmentShader,
      transparent: true,

      uniforms: {
        uTime: { value: 0 },
        uColor: {
          value: new THREE.Color(this.debugObject.middleParticleSphereColor),
        },
      },
    })

    this.middlePoints = new THREE.Points(geometry, this.middleSphereMaterial)
    scene.add(this.middlePoints)
  }

  setOutsideParticleSphere() {
    const particleAmount = 2000
    const geometry = new THREE.BufferGeometry()
    let positions = []

    for (var i = 0; i < particleAmount; i++) {
      var vertex = this.randomPointOnSphere(2)
      positions.push(vertex.x, vertex.y, vertex.z)
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    )

    this.outsideSphereMaterial = new THREE.ShaderMaterial({
      vertexShader: outsideSphereVertexShader,
      fragmentShader: outsideSphereFragmentShader,
      transparent: true,

      uniforms: {
        uTime: { value: 0 },
        uColor: {
          value: new THREE.Color(this.debugObject.outsideParticleSphereColor),
        },
      },
    })

    this.outsidePoints = new THREE.Points(geometry, this.outsideSphereMaterial)
    scene.add(this.outsidePoints)
  }
}
