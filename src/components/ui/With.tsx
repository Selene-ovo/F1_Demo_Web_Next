'use client'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function With() {
  const threeContainerRef = useRef(null)

  // Three.js 관련 변수들
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const spotLightsRef = useRef([])
  const curtainMeshesRef = useRef([])

  const init = () => {
    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 10, 100)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    if (threeContainerRef.current) {
      threeContainerRef.current.appendChild(renderer.domElement)
    }

    // Red carpet floor
    createRedCarpet(scene)

    // Spotlight effects
    createSpotlights(scene)

    // Velvet curtains
    createVelvetCurtains(scene)

    // Vignetting effect (post-processing alternative using geometry)
    createVignette(scene)

    animate()
  }

  const createRedCarpet = (scene) => {
    const geometry = new THREE.PlaneGeometry(50, 100)

    // Red carpet material with luxury texture
    const material = new THREE.MeshLambertMaterial({
      color: 0x8B0000,
      transparent: true
    })

    // Create carpet texture using canvas
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    // Create red carpet pattern
    const gradient = ctx.createLinearGradient(0, 0, 512, 0)
    gradient.addColorStop(0, '#2a0000')
    gradient.addColorStop(0.3, '#8B0000')
    gradient.addColorStop(0.7, '#DC143C')
    gradient.addColorStop(1, '#2a0000')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 1024)

    // Add pattern lines
    ctx.strokeStyle = '#660000'
    ctx.lineWidth = 2
    for (let i = 0; i < 1024; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 2)

    material.map = texture

    const carpet = new THREE.Mesh(geometry, material)
    carpet.rotation.x = -Math.PI / 2
    carpet.position.y = -2
    carpet.receiveShadow = true
    scene.add(carpet)
  }

  const createSpotlights = (scene) => {
    // Main spotlight
    const mainSpotLight = new THREE.SpotLight(0xffffff, 2, 30, Math.PI / 6, 0.5, 1)
    mainSpotLight.position.set(0, 15, 0)
    mainSpotLight.target.position.set(0, 0, 0)
    mainSpotLight.castShadow = true
    mainSpotLight.shadow.mapSize.width = 2048
    mainSpotLight.shadow.mapSize.height = 2048
    scene.add(mainSpotLight)
    scene.add(mainSpotLight.target)
    spotLightsRef.current.push(mainSpotLight)

    // Side spotlights
    for (let i = 0; i < 4; i++) {
      const spotLight = new THREE.SpotLight(0xffd700, 1, 25, Math.PI / 8, 0.3, 1)
      const angle = (i / 4) * Math.PI * 2
      spotLight.position.set(
        Math.cos(angle) * 12,
        10,
        Math.sin(angle) * 12
      )
      spotLight.target.position.set(0, 0, 0)
      spotLight.castShadow = true
      scene.add(spotLight)
      scene.add(spotLight.target)
      spotLightsRef.current.push(spotLight)
    }

    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)
  }

  const createVelvetCurtains = (scene) => {
    const curtainGeometry = new THREE.PlaneGeometry(8, 20)

    // Velvet material
    const curtainMaterial = new THREE.MeshLambertMaterial({
      color: 0x8B0000,
      transparent: true,
      opacity: 0.8
    })

    // Left curtain
    const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
    leftCurtain.position.set(-20, 5, -10)
    leftCurtain.rotation.y = Math.PI / 6
    scene.add(leftCurtain)
    curtainMeshesRef.current.push(leftCurtain)

    // Right curtain
    const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial)
    rightCurtain.position.set(20, 5, -10)
    rightCurtain.rotation.y = -Math.PI / 6
    scene.add(rightCurtain)
    curtainMeshesRef.current.push(rightCurtain)
  }

  const createVignette = (scene) => {
    // Create a ring geometry for vignetting effect
    const vignetteGeometry = new THREE.RingGeometry(15, 25, 32)
    const vignetteMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    })

    const vignette = new THREE.Mesh(vignetteGeometry, vignetteMaterial)
    vignette.position.set(0, 0, -5)
    scene.add(vignette)
  }

  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate)

    // Animate spotlight intensity
    const time = Date.now() * 0.001
    spotLightsRef.current.forEach((light, index) => {
      light.intensity = 1 + Math.sin(time + index) * 0.3
    })

    // Gentle curtain movement
    curtainMeshesRef.current.forEach((curtain, index) => {
      curtain.rotation.z = Math.sin(time * 0.5 + index) * 0.05
    })

    // Subtle camera movement
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(time * 0.3) * 0.5
      cameraRef.current.position.y = 5 + Math.cos(time * 0.2) * 0.3
      cameraRef.current.lookAt(0, 0, 0)
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }

  const handleResize = () => {
    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }
  }

  useEffect(() => {
    init()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  return (
    <div ref={threeContainerRef} className="three-container">
      <style jsx>{`
        .three-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}