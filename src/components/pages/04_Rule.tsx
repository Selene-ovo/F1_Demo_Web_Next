'use client'

import RulesPeriodicTable from '../ui/Rules'

export default function Rule() {
  return (
    <section className="section-04">
      {/* 섹션 헤더 */}
      <div className="section-header">
        <span className="section-number">04</span>
        <h2 className="section-title">
          <span className="title-line flashing-rule">Rule</span>
          <span className="title-description">포뮬러 원의 기본 규칙과 경기 방식을 알아보세요</span>
        </h2>
      </div>

      {/* RulesPeriodicTable 컴포넌트 */}
      <RulesPeriodicTable />

      <style jsx>{`
        .section-04 {
          min-height: 150vh;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .section-header {
          position: absolute;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
          width: 100%;
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

        .flashing-rule {
          animation: gentleFlash 3s infinite;
          position: relative;
        }

        @keyframes gentleFlash {
          0%, 100% {
            color: white;
            text-shadow:
              0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            color: #ffffff;
            text-shadow:
              0 0 15px rgba(255, 255, 255, 0.6),
              0 0 25px rgba(255, 255, 255, 0.4),
              0 0 35px rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </section>
  )
}