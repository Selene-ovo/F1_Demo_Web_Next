'use client'

import { useState, useEffect, useRef } from 'react'
import WithCinematic from '@/components/ui/With'

export default function With() {
  const [currentOffset, setCurrentOffset] = useState(0)
  const [secondRowOffset, setSecondRowOffset] = useState(-1600)
  const [thirdRowOffset, setThirdRowOffset] = useState(0)
  const carouselSpeed = 1
  const animationIdRef = useRef(null)

  const allSponsors = [
    { id: 1, name: 'American Express', logo: '/assets/images/Sponsor/AMEX.svg' },
    { id: 2, name: 'AWS', logo: '/assets/images/Sponsor/Aws.svg' },
    { id: 3, name: 'Heineken', logo: '/assets/images/Sponsor/Heineken.svg' },
    { id: 4, name: 'Hennessy', logo: '/assets/images/Sponsor/Hennessy.webp' },
    { id: 5, name: 'LVMH', logo: '/assets/images/Sponsor/LVMH.svg' },
    { id: 6, name: 'Lenovo', logo: '/assets/images/Sponsor/Lenovo.svg' },
    { id: 7, name: 'McDonald\'s', logo: '/assets/images/Sponsor/McD.svg' },
    { id: 8, name: 'MSC', logo: '/assets/images/Sponsor/Msc.svg' },
    { id: 9, name: 'Nestle', logo: '/assets/images/Sponsor/Nestle.svg' },
    { id: 10, name: 'Paramount', logo: '/assets/images/Sponsor/Paramount.svg' },
    { id: 11, name: 'Puma', logo: '/assets/images/Sponsor/Puma.svg' },
    { id: 12, name: 'Qatar', logo: '/assets/images/Sponsor/Qatar.svg' }
  ]

  const [firstRowSponsors, setFirstRowSponsors] = useState([])
  const [secondRowSponsors, setSecondRowSponsors] = useState([])
  const [thirdRowSponsors, setThirdRowSponsors] = useState([])


  const getSponsorLogo = (sponsorName) => {
    const sponsor = allSponsors.find(s => s.name.toLowerCase().includes(sponsorName.toLowerCase()))
    return sponsor ? sponsor.logo : ''
  }

  const animateCarousel = () => {
    setCurrentOffset(prev => prev + carouselSpeed)
    setSecondRowOffset(prev => prev + carouselSpeed)
    setThirdRowOffset(prev => prev + carouselSpeed)

    // 무한 스크롤을 위한 리셋
    const resetPoint = 1600 // 스폰서 4개 * 200px(min-width) * 2 = 1600px

    setCurrentOffset(prev => prev >= resetPoint ? 0 : prev)
    setSecondRowOffset(prev => prev >= 0 ? -resetPoint : prev)
    setThirdRowOffset(prev => prev >= resetPoint ? 0 : prev)

    animationIdRef.current = requestAnimationFrame(animateCarousel)
  }

  useEffect(() => {
    // 스폰서들을 세 줄로 분배
    const firstThird = allSponsors.slice(0, 4)  // 첫 4개
    const secondThird = allSponsors.slice(4, 8) // 중간 4개
    const thirdThird = [...allSponsors.slice(0, 3), ...allSponsors.slice(4, 7)] // 첫번째줄 3개 + 두번째줄 3개

    // 무한 스크롤을 위해 20번 복제
    let first = []
    let second = []
    let third = []

    for (let i = 0; i < 20; i++) {
      first = [...first, ...firstThird]
      second = [...second, ...secondThird]
      third = [...third, ...thirdThird]
    }

    setFirstRowSponsors(first)
    setSecondRowSponsors(second)
    setThirdRowSponsors(third)

    animateCarousel()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  return (
    <section className="with-06">
      <WithCinematic />

      <div className="section-header">
        <span className="section-number">06</span>
        <h2 className="section-title">
          <span className="title-line">WITH</span>
          <span className="title-description">글로벌 파트너십과 함께하는 F1의 미래</span>
        </h2>
      </div>

      <div className="sponsors-carousel">
        <div className="sponsor-carousel-box">
          <div className="sponsor-track first-row" style={{ transform: `translateX(-${currentOffset}px)` }}>
            {firstRowSponsors.map((sponsor, index) => (
              <div key={`first-${sponsor.id}-${index}`} className="sponsor-item">
                <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
              </div>
            ))}
          </div>
        </div>

        <div className="sponsor-carousel-box">
          <div className="sponsor-track second-row" style={{ transform: `translateX(${secondRowOffset}px)` }}>
            {secondRowSponsors.map((sponsor, index) => (
              <div key={`second-${sponsor.id}-${index}`} className="sponsor-item">
                <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
              </div>
            ))}
          </div>
        </div>

        <div className="sponsor-carousel-box">
          <div className="sponsor-track third-row" style={{ transform: `translateX(-${thirdRowOffset}px)` }}>
            {thirdRowSponsors.map((sponsor, index) => (
              <div key={`third-${sponsor.id}-${index}`} className="sponsor-item">
                <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .with-06 {
          min-height: 100vh;
          background: #000000;
          padding: 6rem 2rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .with-06::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse 50% 35% at center center, transparent 0%, transparent 15%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 0.98) 80%, #000000 100%);
          pointer-events: none;
          z-index: 2;
        }

        .with-06::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800px;
          height: 600px;
          background:
            radial-gradient(ellipse at center,
              rgba(255, 255, 255, 0.03) 0%,
              rgba(255, 255, 255, 0.015) 30%,
              transparent 60%
            );
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
          animation: spotlightPulse 4s ease-in-out infinite alternate;
        }

        @keyframes spotlightPulse {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
          z-index: 3;
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
          text-shadow:
            0 0 20px rgba(255, 255, 255, 0.4),
            0 0 40px rgba(255, 255, 255, 0.2),
            0 0 60px rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
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

        .sponsors-carousel {
          width: 100%;
          margin: 4rem 0;
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sponsor-carousel-box {
          width: 100%;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(139, 0, 0, 0.1);
          padding: 2rem 0;
          border: 1px solid rgba(255, 215, 0, 0.2);
          box-shadow:
            0 0 20px rgba(255, 215, 0, 0.1),
            inset 0 0 20px rgba(139, 0, 0, 0.3);
        }

        .sponsor-track {
          display: flex;
          transition: transform 0.1s linear;
          will-change: transform;
        }

        .sponsor-item {
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem;
        }

        .sponsor-logo {
          width: 120px;
          height: 60px;
          object-fit: contain;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        // 로고 색상 변경 brightness는 검정, invert 흰색
        .sponsor-logo[alt="Puma"],
        .sponsor-logo[alt="Hennessy"],
        .sponsor-logo[alt="LVMH"],
        .sponsor-logo[alt="MSC"] {
          filter: brightness(0) invert(1);
        }

        .sponsor-logo:hover {
          opacity: 1;
        }

        .partnership-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 4rem auto 0;
        }

        .partnership-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .partnership-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 170, 255, 0.3);
        }

        .category-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #00aaff;
        }

        .category-description {
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .category-sponsors {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .category-sponsor-logo {
          width: 60px;
          height: 30px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.6;
        }
      `}</style>
    </section>
  )
}