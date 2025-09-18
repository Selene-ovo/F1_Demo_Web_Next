import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface ParticleUserData {
  originalX: number
  originalY: number
  originalZ: number
  speed: number
}

const Home: React.FC = () => {
  const threeCanvasRef = useRef<HTMLCanvasElement>(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [subtleParticles, setSubtleParticles] = useState<THREE.Mesh[]>([])
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const clockRef = useRef<THREE.Clock | null>(null)

  useEffect(() => {
    initThreeJS()

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX - window.innerWidth / 2) * 0.3
      mouseRef.current.y = (event.clientY - window.innerHeight / 2) * 0.3
    }

    const handleResize = () => {
      if (!camera || !renderer) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (renderer) {
        renderer.dispose()
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const initThreeJS = () => {
    const canvas = threeCanvasRef.current
    if (!canvas) return

    clockRef.current = new THREE.Clock()

    // Scene 설정
    const newScene = new THREE.Scene()
    const newCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    const newRenderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    })

    newRenderer.setSize(window.innerWidth, window.innerHeight)
    newRenderer.setClearColor(0x000000, 0)
    newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 매우 간단한 배경만 생성 - 스크롤에 방해되지 않게
    const particles = createSimpleBackground(newScene)

    // 카메라 초기 위치
    newCamera.position.set(0, 0, 400)

    setScene(newScene)
    setCamera(newCamera)
    setRenderer(newRenderer)
    setSubtleParticles(particles)

    // 애니메이션 시작
    animate(newScene, newCamera, newRenderer, particles)
  }

  const createSimpleBackground = (scene: THREE.Scene): THREE.Mesh[] => {
    // Three.js anaglyph 예제 스타일의 구체들
    const geometry = new THREE.SphereGeometry(1, 8, 6)
    const particles: THREE.Mesh[] = []

    for (let i = 0; i < 100; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, Math.random() * 0.3 + 0.2), // 밝기 0.05-0.25 → 0.2-0.5
        transparent: true,
        opacity: 0.8 // 0.6 → 0.8로 증가
      })

      const sphere = new THREE.Mesh(geometry, material)

      sphere.position.x = Math.random() * 800 - 400
      sphere.position.y = Math.random() * 800 - 400
      sphere.position.z = Math.random() * 800 - 400

      sphere.scale.x = sphere.scale.y = sphere.scale.z = Math.random() * 3 + 1

      // anaglyph 예제처럼 애니메이션을 위한 초기값 저장
      sphere.userData = {
        originalX: sphere.position.x,
        originalY: sphere.position.y,
        originalZ: sphere.position.z,
        speed: Math.random() * 0.02 + 0.005
      } as ParticleUserData

      scene.add(sphere)
      particles.push(sphere)
    }

    // 안개 설정 (anaglyph 예제처럼)
    scene.fog = new THREE.Fog(0x000000, 1, 1000)

    return particles
  }

  const animate = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, particles: THREE.Mesh[]) => {
    let lastTime = 0
    const targetFPS = 30
    const interval = 1000 / targetFPS

    const animateLoop = (currentTime: number) => {
      animationIdRef.current = requestAnimationFrame(animateLoop)

      if (currentTime - lastTime < interval) return
      lastTime = currentTime

      const timer = currentTime * 0.0005

      // 마우스에 따른 카메라 움직임 (anaglyph 예제 스타일)
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      // 구체들 애니메이션 (anaglyph 예제 스타일)
      particles.forEach((sphere, index) => {
        const userData = sphere.userData as ParticleUserData

        sphere.position.x = userData.originalX + Math.cos(timer * userData.speed + index) * 100
        sphere.position.y = userData.originalY + Math.sin(timer * userData.speed * 1.1 + index) * 100
        sphere.position.z = userData.originalZ + Math.sin(timer * userData.speed * 0.7 + index) * 100

        // 회전
        sphere.rotation.x += userData.speed
        sphere.rotation.y += userData.speed * 0.5
        sphere.rotation.z += userData.speed * 0.3
      })

      renderer.render(scene, camera)
    }

    animateLoop(0)
  }

  return (
    <div className="threejs-background">
      <canvas ref={threeCanvasRef} className="three-canvas"></canvas>

      <style jsx>{`
        .threejs-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .three-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  )
}

export default Home