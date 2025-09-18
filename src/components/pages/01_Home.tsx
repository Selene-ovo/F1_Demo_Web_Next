'use client'

import React, { useEffect, useState } from 'react'
import TjHomeBackground from '@/components/ui/Home'

// F1 자동차 이미지들 import
import mclarenCarImage from '@/assets/images/Cars/McLaren_MCL39.png'
import redBullCarImage from '@/assets/images/Cars/Red_Bull_Racing_RB21.jpg'
import ferrariCarImage from '@/assets/images/Cars/Ferrari_SF-25.jpg'
import mercedesCarImage from '@/assets/images/Cars/Mercedes-AMG_F1_W16_E_Performance.jpg'
import astonMartinCarImage from '@/assets/images/Cars/Aston_Martin_AMR25.jpg'
import alpineCarImage from '@/assets/images/Cars/Alpine_A525.jpg'
import williamsCarImage from '@/assets/images/Cars/Williams_FW47.jpg'
import racingBullsCarImage from '@/assets/images/Cars/Racing_Bulls_RB_VCARB_02.jpg'
import haasCarImage from '@/assets/images/Cars/Haas_VF-25.jpg'
import sauberCarImage from '@/assets/images/Cars/Sauber_C45.jpg'

// F1 자동차 배열 정의
const carImages = [
  { src: mclarenCarImage.src, name: 'McLaren' },
  { src: redBullCarImage.src, name: 'Red Bull' },
  { src: ferrariCarImage.src, name: 'Ferrari' },
  { src: mercedesCarImage.src, name: 'Mercedes' },
  { src: astonMartinCarImage.src, name: 'Aston Martin' },
  { src: alpineCarImage.src, name: 'Alpine' },
  { src: williamsCarImage.src, name: 'Williams' },
  { src: racingBullsCarImage.src, name: 'Racing Bulls' },
  { src: haasCarImage.src, name: 'Haas' },
  { src: sauberCarImage.src, name: 'Sauber' }
]

const Section01Home: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0)
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState<number>(1)
  const [currentCarIndex, setCurrentCarIndex] = useState<number>(0)

  useEffect(() => {
    // 홈 섹션 초기화
    initHomeEffects()

    let throttleTimer: NodeJS.Timeout | null = null

    // 스크롤 이벤트 리스너 추가 (throttled)
    const handleScroll = () => {
      if (throttleTimer) return

      throttleTimer = setTimeout(() => {
        const currentScrollY = window.scrollY
        setScrollY(currentScrollY)

        const windowHeight = window.innerHeight

        // 스크롤이 뷰포트의 30%를 넘으면 페이드 아웃 시작
        const fadeStartPoint = windowHeight * 0.3

        if (currentScrollY <= fadeStartPoint) {
          setScrollIndicatorOpacity(1)
        } else {
          // fadeStartPoint부터 40% 구간에서 부드럽게 페이드 아웃
          const fadeDistance = windowHeight * 0.4
          const fadeProgress = Math.min((currentScrollY - fadeStartPoint) / fadeDistance, 1)
          setScrollIndicatorOpacity(Math.max(0, 1 - fadeProgress))
        }

        throttleTimer = null
      }, 16)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      // 스크롤 이벤트 리스너 제거
      window.removeEventListener('scroll', handleScroll)
      if (throttleTimer) {
        clearTimeout(throttleTimer)
      }
    }
  }, [])

  // 자동차 순환 효과를 위한 useEffect
  useEffect(() => {
    const carChangeInterval = setInterval(() => {
      setCurrentCarIndex((prevIndex) => {
        return (prevIndex + 1) % carImages.length
      })
    }, 3000) // 3초마다 자동차 변경

    return () => clearInterval(carChangeInterval)
  }, [])

  const initHomeEffects = () => {
    // Three.js 배경이 자동으로 초기화됨
    console.log('Three.js background initialized')
  }

  return (
    <>
      <section className="section-01">
        {/* 모든 홀로그램 관련 코드를 여기에 통합 */}
        {/* HolographicDrivers */}
        <div className="home-content">
          <div className="hero-section">
            <span className="section-number">01</span>
            <h1 className="hero-title">
              <span className="title-line">FORMULA 1</span>
              <span className="title-subtitle">BEYOND THE LIMIT</span>
            </h1>
            <p className="hero-description">
              시속 350km의 극한.<br/>
              0.001초가 승부를 가르는 세계.
            </p>

            {/* 스크롤 유도 */}
            <div
              className="scroll-indicator"
              style={{
                transform: `translate(-50%, ${scrollY}px)`,
                opacity: scrollIndicatorOpacity
              }}
            >
              <p className="scroll-text">Scroll down to explore more</p>
              <div className="scroll-arrow">
                <div className="arrow-line"></div>
                <div className="arrow-head"></div>
              </div>
            </div>
          </div>

          {/* 홈 배경 효과 */}
          <div className="home-background-effects">
            {/* Three.js 3D 배경 */}
            <TjHomeBackground />

            {/* F1 카 지나가는 효과 */}
            <div className="f1-car-animation">
              <div
                className="f1-car"
                style={{
                  backgroundImage: `url('${carImages[currentCarIndex].src}')`
                }}
              ></div>
              <div className="car-trail"></div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-01 {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: white;
          padding: 2rem;
        }

        .home-content {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
          z-index: 2;
          position: relative;
        }

        .hero-section {
          padding: 0;
          margin-top: -8rem;
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
          margin: 0 0 2rem 0;
        }

        .title-line {
          display: block;
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .title-subtitle {
          display: block;
          font-size: clamp(0.8rem, 2vw, 1.2rem);
          font-weight: 600;
          color: #dc2626;
          letter-spacing: 0.3em;
          margin-top: 1rem;
          text-transform: uppercase;
        }

        .hero-description {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto 8rem auto;
          font-weight: 300;
        }

        /* 스크롤 유도 */
        .scroll-indicator {
          position: fixed;
          bottom: 6rem;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          animation: scrollBounce 2s ease-in-out infinite;
          z-index: 3;
        }

        .scroll-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          letter-spacing: 0.1em;
        }

        .scroll-arrow {
          position: relative;
          width: 2px;
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .arrow-line {
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.8));
        }

        .arrow-head {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid rgba(255, 255, 255, 0.8);
          margin-top: -2px;
        }

        @keyframes scrollBounce {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, 10px);
          }
        }

        /* 홈 배경 효과 */
        .home-background-effects {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        /* F1 카 애니메이션 */
        .f1-car-animation {
          position: absolute;
          top: 35%;
          left: 0;
          width: 100%;
          height: 100px;
          transform: translateY(-50%);
          animation: carPass 12s linear infinite;
          transition: all 1s ease;
        }

        .f1-car {
          position: absolute;
          left: -120px;
          top: 50%;
          width: 120px;
          height: 50px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;
          transform: translateY(-50%);
          filter: brightness(1.2) contrast(1.1);
          transition: background-image 0.5s ease-in-out;
        }

        .car-trail {
          position: absolute;
          left: -250px;
          top: 60%;
          width: 200px;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
          transform: translateY(-50%);
          opacity: 0.4;
        }


        @keyframes carPass {
          0% {
            left: -120px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

export default React.memo(Section01Home)