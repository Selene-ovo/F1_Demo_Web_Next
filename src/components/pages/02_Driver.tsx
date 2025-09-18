'use client'

import TjDriverHologram from '@/components/ui/Driver'

export default function Driver() {
  return (
    <section className="section-02">
      <div className="drivers-section">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">
            <span className="title-line">DRIVERS</span>
            <span className="title-description">
              차세대 홀로그램 기술로 만나는 F1 드라이버들. 파티클이 조립되어 선수의 모습을 구현합니다.
            </span>
          </h2>
        </div>

        {/* Three.js 영화 스타일 홀로그램 시스템 */}
        <TjDriverHologram />
      </div>

      <style jsx>{`
        .section-02 {
          min-height: 180vh; /* 다시 적당한 크기로 */
          background: linear-gradient(
            135deg,
            #0d0d1a 0%,
            #1a1a2e 50%,
            #1e2547 100%
          );
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow: visible;
          color: white;
          padding: 6rem 2rem; /* 8rem -> 6rem */
          border-bottom: 2px solid rgba(0, 212, 255, 0.3);
        }

        .drivers-section {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          position: relative; /* 컨테이너 역할 */
          min-height: 120vh; /* 200vh -> 120vh (완전 줄임) */
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
          z-index: 5; /* 홀로그램과 겹치지 않게 조정 */
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
      `}</style>
    </section>
  )
}