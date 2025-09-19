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

  // [스크롤 효과] 스크롤 에 따른 페이드 인 아웃 및 인디케이터 애니메이션
  useEffect(() => {
    // 홈 섹션 초기화
    initHomeEffects()

    let throttleTimer: NodeJS.Timeout | null = null

    // [스크롤-1] 스크롤 이벤트 리스너 추가 (성능 최적화: 16ms throttle)
    const handleScroll = () => {
      if (throttleTimer) return  // 중복 실행 방지

      throttleTimer = setTimeout(() => {
        const currentScrollY = window.scrollY
        setScrollY(currentScrollY)

        const windowHeight = window.innerHeight

        // [스크롤-2] 페이드 아웃 계산 로직
        // 스크롤이 뷰포트의 30%를 넘으면 페이드 아웃 시작
        const fadeStartPoint = windowHeight * 0.3  // 30% 지점

        if (currentScrollY <= fadeStartPoint) {
          // [페이드-1] 0~30% 구간: 완전히 보임
          setScrollIndicatorOpacity(1)
        } else {
          // [페이드-2] 30~70% 구간: 점진적 투명화
          // fadeStartPoint부터 40% 구간에서 부드럽게 페이드 아웃
          const fadeDistance = windowHeight * 0.4   // 페이드 구간 (40% 거리)
          const fadeProgress = Math.min((currentScrollY - fadeStartPoint) / fadeDistance, 1)  // 0~1 사이 비율
          setScrollIndicatorOpacity(Math.max(0, 1 - fadeProgress))  // 1에서 0으로 감소
        }

        throttleTimer = null
      }, 16)  // 60fps 유지를 위한 16ms 딘레이
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

  // [자동차 하이라이트] 3초마다 다른 F1 팀 자동차로 순환 전환
  useEffect(() => {
    const carChangeInterval = setInterval(() => {
      setCurrentCarIndex((prevIndex) => {
        // [자동차-1] 0~9 인덱스 순환 (10개 팀)
        // McLaren(0) → Red Bull(1) → Ferrari(2) → ... → Sauber(9) → McLaren(0)
        return (prevIndex + 1) % carImages.length
      })
    }, 3000) // [자동차-2] 3초마다 자동차 변경

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

            {/* [자동차 지나가는 효과] 화면을 가로지르는 F1 애니메이션 */}
            <div className="f1-car-animation">
              {/* [자동차-3] 동적 자동차 이미지 - 현재 인덱스의 자동차 표시 */}
              <div
                className="f1-car"
                style={{
                  backgroundImage: `url('${carImages[currentCarIndex].src}')`  // 3초마다 바뀔
                }}
              ></div>
              {/* [자동차-4] 자동차 뒤에 따라오는 광선 효과 */}
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

        /* [자동차 애니메이션] 12초 주기로 화면 가로지르는 효과 */
        .f1-car-animation {
          position: absolute;
          top: 35%;           /* 화면 안쓸 35% 위치 */
          left: 0;
          width: 100%;
          height: 100px;
          transform: translateY(-50%);
          animation: carPass 12s linear infinite;  /* 12초 주기 무한 반복 */
          transition: all 1s ease;  /* 자동차 변경 시 부드러운 전환 */
        }

        .f1-car {
          position: absolute;
          left: -120px;        /* 시작 위치: 화면 왼쪽 밖 */
          top: 50%;
          width: 120px;        /* 자동차 크기 */
          height: 50px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: contain;  /* 비율 유지하며 크기 맞춤 */
          transform: translateY(-50%);
          filter: brightness(1.2) contrast(1.1);  /* 약간 밝게 처리 */
          transition: background-image 0.5s ease-in-out;  /* 자동차 변경 시 부드러운 전환 */
        }

        .car-trail {
          position: absolute;
          left: -250px;        /* 자동차보다 더 왼쪽에 위치 */
          top: 60%;
          width: 200px;        /* 광선 전체 길이 */
          height: 2px;         /* 얀은 선 */
          /* [광선 효과] 가운데가 밝고 양끝이 투명한 그라데이션 */
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
          transform: translateY(-50%);
          opacity: 0.4;        /* 전체적으로 약간 투명하게 */
        }


        /* [자동차 지나가기 애니메이션] 12초 동안 왼쪽에서 오른쪽으로 이동 */
        @keyframes carPass {
          0% {
            left: -120px;      /* 시작: 화면 왼쪽 밖 */
            opacity: 0;        /* 시작: 투명 */
          }
          10% {
            opacity: 1;        /* 등장: 1.2초 후 완전히 보임 */
          }
          50% {
            opacity: 1;        /* 중간: 6초까지 계속 보임 */
          }
          90% {
            opacity: 1;        /* 거의 끝: 10.8초까지 보임 */
          }
          100% {
            left: 100%;        /* 끝: 화면 오른쪽 밖으로 */
            opacity: 0;        /* 끝: 다시 투명 */
          }
        }
      `}</style>
    </>
  )
}

export default React.memo(Section01Home)