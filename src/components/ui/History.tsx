'use client'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'

export default function History() {
  const containerRef = useRef(null)

  // Three.js 관련 변수들
  const cameraRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const effectRef = useRef(null)
  const sphereRef = useRef(null)
  const planeRef = useRef(null)
  const videoRef = useRef(null)
  const animationIdRef = useRef(null)

  const init = () => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.y = 150
    camera.position.z = 500
    cameraRef.current = camera

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0, 0, 0)
    sceneRef.current = scene

    // Create video element for GIF
    const video = document.createElement('video')
    video.src = '/src/assets/Gif/Win.gif'
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.crossOrigin = 'anonymous'
    video.setAttribute('playsinline', '')
    videoRef.current = video

    // Start video
    video.play().catch(e => console.warn('Video play failed:', e))

    // Create video texture
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter

    // Create plane with video texture
    const planeGeometry = new THREE.PlaneGeometry(500, 300)
    const planeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    scene.add(plane)
    planeRef.current = plane

    // Add some additional geometry for visual interest
    const geometry = new THREE.SphereGeometry(50, 20, 10)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
    sphereRef.current = sphere

    // Lights
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0)
    pointLight1.position.set(500, 500, 500)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0)
    pointLight2.position.set(-500, -500, -500)
    scene.add(pointLight2)

    // Renderer
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer

    // ASCII Effect
    const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: false })
    effect.setSize(window.innerWidth, window.innerHeight)
    effect.domElement.style.color = 'white'
    effect.domElement.style.backgroundColor = 'black'
    effectRef.current = effect

    if (containerRef.current) {
      containerRef.current.appendChild(effect.domElement)
    }

    window.addEventListener('resize', onWindowResize)

    animate()
  }

  const onWindowResize = () => {
    if (cameraRef.current && rendererRef.current && effectRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      effectRef.current.setSize(window.innerWidth, window.innerHeight)
    }
  }

  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate)

    const timer = Date.now() * 0.0001

    if (cameraRef.current && sceneRef.current) {
      cameraRef.current.position.x = Math.cos(timer) * 200
      cameraRef.current.position.z = Math.sin(timer) * 200
      cameraRef.current.lookAt(sceneRef.current.position)
    }

    if (sphereRef.current) {
      sphereRef.current.position.x = Math.cos(timer * 2) * 100
      sphereRef.current.position.z = Math.sin(timer * 2) * 100
      sphereRef.current.rotation.x = timer * 5
      sphereRef.current.rotation.z = timer * 5
    }

    if (planeRef.current) {
      planeRef.current.rotation.x = timer * 0.5
      planeRef.current.rotation.y = timer * 0.2
    }

    if (effectRef.current && sceneRef.current && cameraRef.current) {
      effectRef.current.render(sceneRef.current, cameraRef.current)
    }
  }

  useEffect(() => {
    init()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (effectRef.current) {
        effectRef.current.domElement?.remove()
      }
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
      }
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="ascii-container">
      <style jsx>{`
        .ascii-container {
          width: 100%;
          height: 100vh;
          background: #000000;
          overflow: hidden;
        }

        .ascii-container :global(canvas) {
          display: block;
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}