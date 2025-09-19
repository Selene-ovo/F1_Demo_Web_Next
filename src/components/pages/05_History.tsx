'use client'

import { useState, useEffect, useRef } from 'react'
import libraryBackgroundImage from '@/assets/images/backgrounds/library_B.jpg'
export default function History() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isPageTurning, setIsPageTurning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mouseRotation, setMouseRotation] = useState({ x: 0, y: 0 })
  const [floatY, setFloatY] = useState(0)
  const [isBookVisible, setIsBookVisible] = useState(false)
  const [isFlippingLeft, setIsFlippingLeft] = useState(false)
  const [isFlippingRight, setIsFlippingRight] = useState(false)
  const floatAnimationRef = useRef(null)

  // Show/Hide book functions
  const showInteractiveBook = () => {
    setIsBookVisible(true)
  }

  const hideBook = () => {
    setIsBookVisible(false)
    setMouseRotation({ x: 0, y: 0 })
    setCurrentPageIndex(0) // 다음에 열 때를 위해 첫 페이지로
  }

  // Floating animation
  useEffect(() => {
    const startFloatingAnimation = () => {
      let time = 0
      const animate = () => {
        time += 0.01
        setFloatY(Math.sin(time) * 10)
        floatAnimationRef.current = requestAnimationFrame(animate)
      }
      animate()
    }

    startFloatingAnimation()

    return () => {
      if (floatAnimationRef.current) {
        cancelAnimationFrame(floatAnimationRef.current)
      }
    }
  }, [])

  // Mouse interaction
  const handleMouseMove = (event) => {
    if (!isHovered) return

    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotationX = (event.clientY - centerY) / 20
    const rotationY = (event.clientX - centerX) / 20

    setMouseRotation({
      x: -rotationX * 0.5,
      y: rotationY * 0.5
    })
  }

  const historyPages = [
    {
      year: '1946-1950',
      title: 'F1의 시작',
      leftImage: '/assets/images/History/History_01.gif',
      leftAlt: '초기 레이싱',
      leftDescription: '제2차 세계대전 이후, 모터스포츠는 전쟁으로 중단되었던 평화의 상징으로 다시 시작되었습니다.',
      rightImage: '/assets/images/History/History_02.jpg',
      rightAlt: '첫 번째 챔피언십',
      rightDescription: '1950년 5월 13일, 영국 실버스톤에서 첫 번째 F1 월드 챔피언십이 개최되었습니다. 주세페 파리나가 첫 번째 챔피언이 되었습니다.'
    },
    {
      year: '1960-1970',
      title: '안전성의 각성',
      leftImage: '/assets/images/History/History_03.gif',
      leftAlt: '안전 장비 발전',
      leftDescription: '이 시대는 많은 드라이버들이 목숨을 잃으면서 안전에 대한 인식이 높아진 시기였습니다.',
      rightImage: '/assets/images/History/History_04.gif',
      rightAlt: '헬멧 발전사',
      rightDescription: '헬멧, 안전벨트, 그리고 서킷 안전 시설의 개선이 시작되었습니다. 이는 스포츠의 위험성을 줄이는 중요한 전환점이었습니다.'
    },
    {
      year: '1980-1990',
      title: '기술 혁신의 시대',
      leftImage: '/assets/images/History/History_05.gif',
      leftAlt: '터보 엔진 시대',
      leftDescription: '터보차저 엔진과 첨단 공기역학이 도입되면서 F1은 기술적으로 크게 발전했습니다.',
      rightImage: '/assets/images/History/History_06.gif',
      rightAlt: '전자 시스템',
      rightDescription: '전자 제어 시스템, 자동 변속기, 그리고 능동 서스펜션 등의 혁신적인 기술들이 등장했습니다.'
    },
    {
      year: '2000-현재',
      title: '글로벌 스포츠로의 발전',
      leftImage: '/assets/images/History/History_07.png',
      leftAlt: '글로벌 확장',
      leftDescription: 'F1은 유럽을 넘어 아시아, 중동, 미주 등 전 세계로 확장되며 진정한 글로벌 스포츠가 되었습니다.',
      rightImage: '/assets/images/History/History_08.gif',
      rightAlt: '현대 F1',
      rightDescription: '하이브리드 파워 유닛, 지속가능성, 그리고 디지털 기술의 도입으로 F1은 미래를 향해 나아가고 있습니다. 2018년부터 도입된 헤일로(Halo) 안전 시스템은 드라이버의 머리를 보호하는 혁신적인 안전 장치로, F1의 안전성을 한 단계 더 끌어올렸습니다.'
    }
  ]

  const currentPage = historyPages[currentPageIndex]

  const nextPage = () => {
    if (currentPageIndex < historyPages.length - 1) {
      setIsFlippingRight(true)

      // 오른쪽 페이지를 손으로 넘기는 듯한 애니메이션
      setTimeout(() => {
        setCurrentPageIndex(prev => prev + 1)
      }, 400)

      setTimeout(() => {
        setIsFlippingRight(false)
      }, 1200)
    }
  }

  const previousPage = () => {
    if (currentPageIndex > 0) {
      setIsFlippingLeft(true)

      // 왼쪽 페이지를 손으로 넘기는 듯한 애니메이션
      setTimeout(() => {
        setCurrentPageIndex(prev => prev - 1)
      }, 400)

      setTimeout(() => {
        setIsFlippingLeft(false)
      }, 1200)
    }
  }

  return (
    <section className="history-05" onMouseMove={handleMouseMove}>
      <div className="section-header">
        <span className="section-number">05</span>
        <h2 className="section-title">
          <span className="title-line">History</span>
          <span className="title-description">모터스포츠의 시작부터 현재까지, F1의 깊은 역사</span>
        </h2>
      </div>

      {/* Fireflies */}
      <div className="fireflies">
        {[...Array(15)].map((_, n) => (
          <div key={n} className="firefly"></div>
        ))}
      </div>

      {/* Clickable Background Book Area */}
      <div className="background-book-area" onClick={showInteractiveBook}>
        {!isBookVisible && (
          <div className="click-hint">
            <div className="glow-effect"></div>
            <div className="click-text">Click to explore F1 History</div>
          </div>
        )}
      </div>

      {/* Interactive Book Container */}
      {isBookVisible && (
        <div className={`floating-book-container ${isBookVisible ? 'book-visible' : ''}`}>
          {/* Magical Particles */}
          <div className="magic-particles">
            {[...Array(20)].map((_, n) => (
              <div key={n} className="particle"></div>
            ))}
          </div>

          {/* Close Button */}
          <button className="close-book-btn" onClick={hideBook}>×</button>

          {/* Book Bookmark */}
          <div className="book-bookmark"></div>

          {/* Book */}
          <div
            className="book"
            style={{
              transform: `rotateX(${mouseRotation.x}deg) rotateY(${mouseRotation.y}deg) translateY(${floatY}px)`
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Book Pages (always visible) */}
            <div className="book-pages visible">
              {/* Page Stack (for thickness) */}
              <div className="page-stack">
                {[...Array(12)].map((_, n) => (
                  <div
                    key={n}
                    className="stack-layer"
                    style={{ transform: `translateZ(${-n * 2}px)` }}
                  ></div>
                ))}
              </div>

              {/* Current Page Spread */}
              <div className="page-spread">
                {/* Left Page (Click to go previous) */}
                <div
                  className={`magazine-page left-page ${currentPageIndex > 0 ? 'clickable' : ''} ${isFlippingLeft ? 'flipping-left' : ''}`}
                  onClick={previousPage}
                >
                  <div className="page-content">
                    {/* Year Badge */}
                    <div className="year-badge">{currentPage.year}</div>

                    {/* Main Image */}
                    <div className="page-image">
                      <img src={currentPage.leftImage} alt={currentPage.leftAlt} />
                    </div>

                    {/* Text Content */}
                    <div className="text-content">
                      <p>{currentPage.leftDescription}</p>
                    </div>
                  </div>
                  {/* Page Curl Indicator */}
                  {currentPageIndex > 0 && <div className="page-curl-hint left"></div>}
                </div>

                {/* Right Page (Click to go next) */}
                <div
                  className={`magazine-page right-page ${currentPageIndex < historyPages.length - 1 ? 'clickable' : ''} ${isFlippingRight ? 'flipping-right' : ''}`}
                  onClick={nextPage}
                >
                  <div className="page-content">
                    {/* Article Title */}
                    <div className="article-header">
                      <h1 className="article-title">{currentPage.title}</h1>
                      <div className="article-subtitle">{currentPage.year}</div>
                    </div>

                    {/* Featured Image */}
                    <div className="featured-image">
                      <img src={currentPage.rightImage} alt={currentPage.rightAlt} />
                    </div>

                    {/* Article Text */}
                    <div className="article-text">
                      <p>{currentPage.rightDescription}</p>
                    </div>
                  </div>
                  {/* Page Curl Indicator */}
                  {currentPageIndex < historyPages.length - 1 && <div className="page-curl-hint right"></div>}
                </div>
              </div>

              {/* Page Number */}
              <div className="page-number-scroll">
                {currentPageIndex + 1} / {historyPages.length}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .history-05 {
          min-height: 120vh;
          background:
            radial-gradient(
              ellipse 800px 600px at center 40%,
              rgba(255, 215, 0, 0.2) 0%,
              rgba(139, 69, 19, 0.3) 30%,
              rgba(0, 0, 0, 0.5) 60%,
              rgba(0, 0, 0, 0.7) 100%
            ),
            linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)),
            url('${libraryBackgroundImage.src}');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          padding: 4rem 2rem;
          color: white;
          position: relative;
          overflow: hidden;
          perspective: 1000px;
        }

        .history-05::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(139,69,19,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(160,82,45,0.1)"/><circle cx="50" cy="10" r="0.8" fill="rgba(205,133,63,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          pointer-events: none;
          opacity: 0.3;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
          z-index: 2;
        }

        .section-number {
          display: block;
          font-size: 1.5rem;
          color: #666;
          font-weight: 300;
          margin-bottom: 1rem;
          letter-spacing: 0.2em;
        }

        .title-line {
          display: block;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          color: white;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          margin-bottom: 1rem;
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

        .title-description {
          display: block;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 300;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Fireflies */
        .fireflies {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .firefly {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 150, 0.8);
          border-radius: 50%;
          box-shadow:
            0 0 8px rgba(255, 255, 150, 0.6),
            0 0 15px rgba(255, 255, 150, 0.3);
          animation: firefly-float 8s infinite ease-in-out;
        }

        .firefly:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; animation-duration: 12s; }
        .firefly:nth-child(2) { top: 60%; left: 80%; animation-delay: 1s; animation-duration: 10s; }
        .firefly:nth-child(3) { top: 30%; left: 60%; animation-delay: 2s; animation-duration: 15s; }
        .firefly:nth-child(4) { top: 80%; left: 20%; animation-delay: 3s; animation-duration: 11s; }
        .firefly:nth-child(5) { top: 10%; left: 70%; animation-delay: 4s; animation-duration: 13s; }
        .firefly:nth-child(6) { top: 70%; left: 40%; animation-delay: 5s; animation-duration: 9s; }
        .firefly:nth-child(7) { top: 40%; left: 90%; animation-delay: 6s; animation-duration: 14s; }
        .firefly:nth-child(8) { top: 90%; left: 50%; animation-delay: 7s; animation-duration: 8s; }
        .firefly:nth-child(9) { top: 15%; left: 30%; animation-delay: 8s; animation-duration: 16s; }
        .firefly:nth-child(10) { top: 55%; left: 15%; animation-delay: 9s; animation-duration: 12s; }
        .firefly:nth-child(11) { top: 75%; left: 75%; animation-delay: 10s; animation-duration: 10s; }
        .firefly:nth-child(12) { top: 25%; left: 85%; animation-delay: 11s; animation-duration: 15s; }
        .firefly:nth-child(13) { top: 85%; left: 65%; animation-delay: 12s; animation-duration: 11s; }
        .firefly:nth-child(14) { top: 45%; left: 25%; animation-delay: 13s; animation-duration: 13s; }
        .firefly:nth-child(15) { top: 65%; left: 95%; animation-delay: 14s; animation-duration: 9s; }

        @keyframes firefly-float {
          0% {
            transform: translateX(0) translateY(0) scale(0.5);
            opacity: 0.3;
          }
          25% {
            transform: translateX(-20px) translateY(-30px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateX(30px) translateY(-50px) scale(0.8);
            opacity: 0.7;
          }
          75% {
            transform: translateX(-10px) translateY(-20px) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translateX(0) translateY(0) scale(0.5);
            opacity: 0.3;
          }
        }

        /* Background Book Click Area */
        .background-book-area {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 300px;
          cursor: pointer;
          z-index: 3;
          transition: all 0.3s ease;
        }

        .background-book-area:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        .click-hint {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse-hint 2s infinite;
        }

        .glow-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 200px;
          background: radial-gradient(
            ellipse,
            rgba(255, 215, 0, 0.3) 0%,
            rgba(255, 215, 0, 0.1) 40%,
            transparent 70%
          );
          border-radius: 50%;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .click-text {
          background: rgba(0, 0, 0, 0.7);
          color: #FFD700;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 500;
          border: 2px solid rgba(255, 215, 0, 0.5);
          backdrop-filter: blur(10px);
          animation: text-glow 2s ease-in-out infinite alternate;
          z-index: 2;
          position: relative;
        }

        @keyframes pulse-hint {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes glow-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.6;
          }
        }

        @keyframes text-glow {
          0% {
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          }
        }

        /* Close Button */
        .close-book-btn {
          position: absolute;
          top: 10%;
          right: 25%;
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-book-btn:hover {
          background: rgba(255, 0, 0, 0.7);
          border-color: rgba(255, 0, 0, 0.8);
          transform: scale(1.1);
        }

        /* Book Bookmark */
        .book-bookmark {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 120px;
          background: linear-gradient(135deg, #8B4513 0%, #D2691E  50%, #CD853F 100%);
          border-radius: 5px 5px 0 0;
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1);
          z-index: 15;
        }

        .book-bookmark::before {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-top: 10px solid #8B4513;
        }

        .book-bookmark::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 2px;
          height: 60px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 1px;
        }

        /* Floating Book Container */
        .floating-book-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 2000px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease;
        }

        .floating-book-container.book-visible {
          opacity: 1;
          visibility: visible;
        }

        /* Magic Particles */
        .magic-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 215, 0, 0.8);
          border-radius: 50%;
          animation: float-particle 4s infinite ease-in-out;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .particle:nth-child(odd) {
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
          animation-duration: 6s;
        }

        .particle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
        .particle:nth-child(2) { top: 20%; left: 80%; animation-delay: 0.5s; }
        .particle:nth-child(3) { top: 80%; left: 10%; animation-delay: 1s; }
        .particle:nth-child(4) { top: 70%; left: 90%; animation-delay: 1.5s; }
        .particle:nth-child(5) { top: 30%; left: 50%; animation-delay: 2s; }
        .particle:nth-child(6) { top: 60%; left: 30%; animation-delay: 2.5s; }
        .particle:nth-child(7) { top: 40%; left: 70%; animation-delay: 3s; }
        .particle:nth-child(8) { top: 90%; left: 60%; animation-delay: 3.5s; }
        .particle:nth-child(9) { top: 15%; left: 40%; animation-delay: 4s; }
        .particle:nth-child(10) { top: 85%; left: 75%; animation-delay: 4.5s; }
        .particle:nth-child(11) { top: 25%; left: 15%; animation-delay: 5s; }
        .particle:nth-child(12) { top: 75%; left: 85%; animation-delay: 5.5s; }
        .particle:nth-child(13) { top: 50%; left: 5%; animation-delay: 6s; }
        .particle:nth-child(14) { top: 35%; left: 95%; animation-delay: 6.5s; }
        .particle:nth-child(15) { top: 65%; left: 25%; animation-delay: 7s; }
        .particle:nth-child(16) { top: 45%; left: 85%; animation-delay: 7.5s; }
        .particle:nth-child(17) { top: 55%; left: 45%; animation-delay: 8s; }
        .particle:nth-child(18) { top: 95%; left: 35%; animation-delay: 8.5s; }
        .particle:nth-child(19) { top: 5%; left: 65%; animation-delay: 9s; }
        .particle:nth-child(20) { top: 85%; left: 55%; animation-delay: 9.5s; }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }

        /* Book */
        .book {
          position: relative;
          width: 800px;
          height: 600px;
          transform-style: preserve-3d;
          cursor: pointer;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Book Pages */
        .book-pages {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        /* Book Spine - 제본선 */
        .book-pages::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg,
            #f0f0f0 0%,
            #e0e0e0 25%,
            #d0d0d0 50%,
            #e0e0e0 75%,
            #f0f0f0 100%);
          box-shadow:
            inset 1px 0 2px rgba(0, 0, 0, 0.1),
            inset -1px 0 2px rgba(255, 255, 255, 0.5);
          z-index: 10;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        /* Page Stack for Thickness */
        .page-stack {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .stack-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #F5E6D3, #E6D3C1);
          border: 2px solid #8B4513;
          border-radius: 4px;
          opacity: 0.7;
        }

        /* Page Spread */
        .page-spread {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          transform-style: preserve-3d;
          z-index: 5;
        }

        /* Magazine Pages */
        .magazine-page {
          flex: 1;
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(200, 200, 200, 0.3);
          border-radius: 12px;
          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.12),
            0 3px 10px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        /* Natural Page Flip Animations */
        .magazine-page.flipping-right {
          animation: handFlipRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: left center;
          z-index: 20;
        }

        .magazine-page.flipping-left {
          animation: handFlipLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: right center;
          z-index: 20;
        }

        @keyframes handFlipRight {
          0% {
            transform: rotateY(0deg) scale(1);
            opacity: 1;
            z-index: 20;
          }
          25% {
            transform: rotateY(-15deg) scale(0.98) translateZ(10px);
            opacity: 0.95;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: rotateY(-45deg) scale(0.95) translateZ(20px);
            opacity: 0.85;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          }
          75% {
            transform: rotateY(-75deg) scale(0.98) translateZ(10px);
            opacity: 0.95;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
          100% {
            transform: rotateY(-90deg) scale(1);
            opacity: 1;
            z-index: 20;
          }
        }

        @keyframes handFlipLeft {
          0% {
            transform: rotateY(0deg) scale(1);
            opacity: 1;
            z-index: 20;
          }
          25% {
            transform: rotateY(15deg) scale(0.98) translateZ(10px);
            opacity: 0.95;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: rotateY(45deg) scale(0.95) translateZ(20px);
            opacity: 0.85;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          }
          75% {
            transform: rotateY(75deg) scale(0.98) translateZ(10px);
            opacity: 0.95;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
          100% {
            transform: rotateY(90deg) scale(1);
            opacity: 1;
            z-index: 20;
          }
        }

        .left-page {
          border-right: 2px solid #e0e0e0;
          margin-right: 8px;
        }

        .right-page {
          border-left: 2px solid #e0e0e0;
          margin-left: 8px;
        }

        /* Magazine Page Content */
        .page-content {
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: #333;
        }

        /* Year Badge */
        .year-badge {
          display: inline-block;
          background: #2563eb !important;
          color: white !important;
          border-radius: 25px;
          padding: 0.8rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          align-self: flex-start;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 2px solid white;
        }

        /* Page Image */
        .page-image {
          width: 100%;
          height: 200px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .page-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

      .text-content {
          flex: 1;
          position: relative;   /* 레이어 기준 생성 */
          z-index: 10;          /* 이미지보다 위로 */
        }

        .text-content p {
          font-family: 'Arial', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #222 !important; /* 강제 적용 (투명/덮임 방지) */
          margin: 0;
          text-align: justify;
          font-weight: 500;
          position: relative;
          z-index: 11;           /* 텍스트는 더 위 */
        }

        /* Article Header */
        .article-header {
          margin-bottom: 2rem;
          text-align: left;
        }

       .article-title {
          position: relative;   /* 위치는 그대로 */
          z-index: 20;          /* 단순히 위로만 올림 */
          color: #111 !important;
        }

        .article-subtitle {
          position: relative;
          z-index: 19;
          color: #333 !important;
        }

        /* Featured Image */
        .featured-image {
          width: 100%;
          height: 200px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .article-text {
          position: relative;   /* 레이어 생성 */
          z-index: 10;          /* 이미지보다 위 */
        }

        .article-text p {
          font-family: 'Arial', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #222 !important; /* 확실히 보이도록 강제 */
          margin: 0;
          text-align: justify;
          font-weight: 500;
          position: relative;
          z-index: 11;          /* 텍스트 자체는 더 위 */
        }

        /* Page Number - Always on top */
        .floating-book-container .page-number-scroll {
          position: fixed !important;
          bottom: 2rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: #ffffff !important;
          border: 3px solid #333 !important;
          border-radius: 25px !important;
          padding: 0.8rem 1.2rem !important;
          font-size: 1rem !important;
          color: #333 !important;
          font-weight: 700 !important;
          z-index: 999999 !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
          pointer-events: none !important;
          backdrop-filter: blur(15px) !important;
          isolation: isolate !important;
        }

        .page-number-scroll {
          position: fixed !important;
          bottom: 2rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: #ffffff !important;
          border: 3px solid #333 !important;
          border-radius: 25px !important;
          padding: 0.8rem 1.2rem !important;
          font-size: 1rem !important;
          color: #333 !important;
          font-weight: 700 !important;
          z-index: 999999 !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
          pointer-events: none !important;
          backdrop-filter: blur(15px) !important;
          isolation: isolate !important;
        }

        /* Page Click Areas & Cursor */
        .magazine-page.clickable {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .magazine-page.clickable:hover {
          transform: scale(1.02) translateZ(5px);
          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.2),
            0 5px 15px rgba(0, 0, 0, 0.1);
        }

        /* Page Curl Hints */
        .page-curl-hint {
          position: absolute;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, transparent 50%, rgba(139, 69, 19, 0.2) 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .page-curl-hint.left {
          top: 20px;
          left: 20px;
          transform: rotate(45deg);
        }

        .page-curl-hint.right {
          top: 20px;
          right: 20px;
          transform: rotate(-45deg);
        }

        .manuscript-page.clickable:hover .page-curl-hint {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .book {
            flex-direction: column;
            min-height: auto;
          }

          .page {
            padding: 2rem 1.5rem;
          }

          .book::before {
            left: 0;
            top: 50%;
            width: 100%;
            height: 4px;
          }

          .left-page {
            border-right: none;
            border-bottom: 2px solid rgba(139, 69, 19, 0.2);
          }

          .right-page {
            border-left: none;
            border-top: 2px solid rgba(139, 69, 19, 0.2);
          }

          .image-box,
          .main-image {
            height: 200px;
          }

          .navigation {
            position: static;
            margin-top: 2rem;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  )
}