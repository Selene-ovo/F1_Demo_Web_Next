'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import TjCircuitGlobe from '@/components/ui/Circuit'

export default function Circuit() {
  const starCanvasRef = useRef(null)
  const starSceneRef = useRef(null)
  const starCameraRef = useRef(null)
  const starRendererRef = useRef(null)
  const starAnimationIdRef = useRef(null)

  useEffect(() => {
    const initStarBackground = () => {
      const canvas = starCanvasRef.current
      if (!canvas) return

      // Scene 설정
      starSceneRef.current = new THREE.Scene()

      // 캔버스 크기에 맞춰 카메라와 렌더러 설정
      const rect = canvas.getBoundingClientRect()
      starCameraRef.current = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 10000)
      starRendererRef.current = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      starRendererRef.current.setSize(rect.width, rect.height)
      starRendererRef.current.setPixelRatio(window.devicePixelRatio)
      starRendererRef.current.setClearColor(0x000011, 1)

      // 별 배경 생성
      createFullScreenStars()

      // 카메라 고정
      starCameraRef.current.position.set(0, 0, 1)
      starCameraRef.current.lookAt(0, 0, 0)

      // 애니메이션 시작
      animateStars()
    }

    const createFullScreenStars = () => {
      // 큰 별 텍스처
      const createBigStarTexture = () => {
        const canvas = document.createElement('canvas')
        const size = 128
        canvas.width = size
        canvas.height = size

        const context = canvas.getContext('2d')
        const center = size / 2

        // 중심 밝은 점
        const gradient = context.createRadialGradient(center, center, 0, center, center, center)
        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)')
        gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')

        context.fillStyle = gradient
        context.fillRect(0, 0, size, size)

        // 십자 광선 (더 길고 밝게)
        const gradient2 = context.createLinearGradient(0, center, size, center)
        gradient2.addColorStop(0, 'rgba(255,255,255,0)')
        gradient2.addColorStop(0.2, 'rgba(255,255,255,0.9)')
        gradient2.addColorStop(0.5, 'rgba(255,255,255,1)')
        gradient2.addColorStop(0.8, 'rgba(255,255,255,0.9)')
        gradient2.addColorStop(1, 'rgba(255,255,255,0)')

        context.fillStyle = gradient2
        context.fillRect(0, center-3, size, 6)

        const gradient3 = context.createLinearGradient(center, 0, center, size)
        gradient3.addColorStop(0, 'rgba(255,255,255,0)')
        gradient3.addColorStop(0.2, 'rgba(255,255,255,0.9)')
        gradient3.addColorStop(0.5, 'rgba(255,255,255,1)')
        gradient3.addColorStop(0.8, 'rgba(255,255,255,0.9)')
        gradient3.addColorStop(1, 'rgba(255,255,255,0)')

        context.fillStyle = gradient3
        context.fillRect(center-3, 0, 6, size)

        return new THREE.CanvasTexture(canvas)
      }

      const bigStarTexture = createBigStarTexture()

      // 메인 별들
      const mainStarGeometry = new THREE.BufferGeometry()
      const mainStarCount = 300
      const mainPositions = new Float32Array(mainStarCount * 3)
      const mainColors = new Float32Array(mainStarCount * 3)

      for (let i = 0; i < mainStarCount; i++) {
        const i3 = i * 3

        mainPositions[i3] = (Math.random() - 0.5) * 2000
        mainPositions[i3 + 1] = (Math.random() - 0.5) * 2000
        mainPositions[i3 + 2] = -500 - Math.random() * 1500

        // 별 색상
        const temp = Math.random()
        if (temp < 0.15) { // 적색거성
          mainColors[i3] = 1.0
          mainColors[i3 + 1] = 0.6
          mainColors[i3 + 2] = 0.4
        } else if (temp < 0.35) { // 주황색 별
          mainColors[i3] = 1.0
          mainColors[i3 + 1] = 0.8
          mainColors[i3 + 2] = 0.5
        } else if (temp < 0.65) { // 황색 별
          mainColors[i3] = 1.0
          mainColors[i3 + 1] = 1.0
          mainColors[i3 + 2] = 0.9
        } else if (temp < 0.85) { // 흰색 별
          mainColors[i3] = 1.0
          mainColors[i3 + 1] = 1.0
          mainColors[i3 + 2] = 1.0
        } else { // 청색거성
          mainColors[i3] = 0.8
          mainColors[i3 + 1] = 0.9
          mainColors[i3 + 2] = 1.0
        }
      }

      mainStarGeometry.setAttribute('position', new THREE.BufferAttribute(mainPositions, 3))
      mainStarGeometry.setAttribute('color', new THREE.BufferAttribute(mainColors, 3))

      const mainStarMaterial = new THREE.PointsMaterial({
        size: 8,
        map: bigStarTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        alphaTest: 0.01,
        blending: THREE.AdditiveBlending
      })

      const mainStars = new THREE.Points(mainStarGeometry, mainStarMaterial)
      starSceneRef.current.add(mainStars)

      // 배경 별들 (많고 작은)
      createBackgroundStars()
    }

    const createBackgroundStars = () => {
      const bgStarGeometry = new THREE.BufferGeometry()
      const bgStarCount = 8000
      const bgPositions = new Float32Array(bgStarCount * 3)
      const bgColors = new Float32Array(bgStarCount * 3)

      for (let i = 0; i < bgStarCount; i++) {
        const i3 = i * 3

        bgPositions[i3] = (Math.random() - 0.5) * 3000
        bgPositions[i3 + 1] = (Math.random() - 0.5) * 3000
        bgPositions[i3 + 2] = -200 - Math.random() * 2000

        const brightness = 0.3 + Math.random() * 0.7
        bgColors[i3] = brightness
        bgColors[i3 + 1] = brightness
        bgColors[i3 + 2] = brightness + Math.random() * 0.2
      }

      bgStarGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3))
      bgStarGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3))

      const bgStarMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
      })

      const bgStars = new THREE.Points(bgStarGeometry, bgStarMaterial)
      starSceneRef.current.add(bgStars)
    }

    const animateStars = () => {
      starAnimationIdRef.current = requestAnimationFrame(animateStars)

      if (starRendererRef.current && starSceneRef.current && starCameraRef.current) {
        starRendererRef.current.render(starSceneRef.current, starCameraRef.current)
      }
    }

    // 윈도우 리사이즈 핸들링
    const handleStarResize = () => {
      if (!starCameraRef.current || !starRendererRef.current || !starCanvasRef.current) return

      const canvas = starCanvasRef.current
      const rect = canvas.getBoundingClientRect()

      starCameraRef.current.aspect = rect.width / rect.height
      starCameraRef.current.updateProjectionMatrix()
      starRendererRef.current.setSize(rect.width, rect.height)
    }

    setTimeout(() => {
      initStarBackground()
    }, 100)

    window.addEventListener('resize', handleStarResize)

    return () => {
      if (starAnimationIdRef.current) {
        cancelAnimationFrame(starAnimationIdRef.current)
      }
      if (starRendererRef.current) {
        starRendererRef.current.dispose()
      }
      window.removeEventListener('resize', handleStarResize)
    }
  }, [])

  return (
    <section className="home-07">
      {/* 별 배경 */}
      <canvas ref={starCanvasRef} className="star-background"></canvas>

      <div className="section-header">
        <span className="section-number">07</span>
        <h1 className="hero-title">
          <span className="title-line">Circuits</span>
          <span className="title-subtitle">세계 각지의 F1 서킷을 인터랙티브 맵에서 확인하세요</span>
        </h1>
      </div>

      <div className="circuits-content">
        <TjCircuitGlobe />
      </div>

      <style jsx>{`
        .home-07 {
          min-height: 100vh;
          background: #000000;
          background-image:
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
            radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
            radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
            radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
          background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
          background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
          background-attachment: fixed;
          padding: 6rem 0;
          position: relative;
          overflow: hidden;
        }

        .star-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .section-header {
          text-align: center;
          color: white;
          margin-bottom: 4rem;
          position: relative;
          z-index: 10;
        }

        .section-number {
          display: block;
          font-size: 1.5rem;
          color: #666;
          font-weight: 300;
          margin-bottom: 1rem;
          letter-spacing: 0.2em;
        }

        .hero-title {
          margin: 0 0 4rem 0;
        }

        .title-line {
          display: block;
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
          animation: sparkle 2s ease-in-out infinite alternate;
        }

        @keyframes sparkle {
          0% {
            text-shadow:
              0 0 30px rgba(255, 255, 255, 0.3),
              0 0 60px rgba(0, 212, 255, 0.4);
          }
          100% {
            text-shadow:
              0 0 50px rgba(255, 255, 255, 0.6),
              0 0 80px rgba(0, 212, 255, 0.8),
              0 0 100px rgba(255, 255, 255, 0.4);
          }
        }

        .title-subtitle {
          display: block;
          font-size: 1.2rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: normal;
          margin-top: 1rem;
          text-transform: none;
        }

        .circuits-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 5;
        }
      `}</style>
    </section>
  )
}