'use client'

import TjTeams from '@/components/ui/Teams'

export default function Teams() {
  return (
    <section className="teams-03">
      <div className="section-header">
        <span className="section-number">03</span>
        <h2 className="section-title">
          <span className="title-line">Teams</span>
          <span className="title-description">F1 팀들의 역동적인 세계</span>
        </h2>
      </div>

      {/* 3D Teams Component */}
      <TjTeams />

      <style jsx>{`
        .teams-03 {
          min-height: 100vh;
          background:
            linear-gradient(135deg, rgba(10, 10, 10, 0.7), rgba(26, 26, 26, 0.7), rgba(42, 42, 42, 0.7)),
            url('../../assets/images/backgrounds/Teams_B.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: 3rem 0 0 0;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 10;
          padding: 0 2rem;
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

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .team-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .team-logo img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 1.5rem;
        }

        .team-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .team-country {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1rem 0;
        }

        .team-colors {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          margin: 1rem 0 2rem 0;
        }

        .team-stats {
          display: flex;
          justify-content: space-around;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #00aaff;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </section>
  )
}