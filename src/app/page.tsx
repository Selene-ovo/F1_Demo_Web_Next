'use client'

import Section01Home from '@/components/pages/01_Home'
import Section02Driver from '@/components/pages/02_Driver'
import Section03Team from '@/components/pages/03_Teams'
import Section04Rule from '@/components/pages/04_Rule'
import Section05History from '@/components/pages/05_History'
import Section06With from '@/components/pages/06_With'
import Section07Circuit from '@/components/pages/07_Circuit'

export default function HomePage() {
  return (
    <div className="home-view">
      {/* Section 01: Home */}
      <Section01Home />

      {/* Section 02: Driver */}
      <Section02Driver />

      {/* Section 03: Team */}
      <Section03Team />

      {/* Section 04: Rule */}
      <Section04Rule />

      {/* Section 05: History */}
      <Section05History />

      {/* Section 06: With */}
      <Section06With />

      {/* Section 07: Circuit */}
      <Section07Circuit />
    </div>
  )
}

// 홈 뷰 스타일
const homeViewStyles = `
.home-view {
  position: relative;
  min-height: 100vh;
  background: transparent;
}

.drivers-3d-section,
.cards-section {
  padding: 6rem 0;
  position: relative;
  z-index: 2;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-number {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #00ffff, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.card-content {
  padding: 2rem;
  text-align: center;
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.card-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .section-container {
    padding: 0 1rem;
  }
}
`

// 스타일을 DOM에 추가
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = homeViewStyles
  document.head.appendChild(styleElement)
}