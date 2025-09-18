'use client'

import { useEffect } from 'react'
import { OverlayScrollbars } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import './globals.css'

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize OverlayScrollbars with round theme and custom positioning
    OverlayScrollbars(document.body, {
      className: 'os-theme-round-dark',
      resize: 'none',
      sizeAutoCapable: true,
      clipAlways: true,
      normalizeRTL: true,
      paddingAbsolute: false,
      autoUpdate: null,
      autoUpdateInterval: 33,
      updateOnLoad: ['img'],
      nativeScrollbarsOverlaid: {
        showNativeScrollbars: false,
        initialize: true
      },
      overflowBehavior: {
        x: 'scroll',
        y: 'scroll'
      },
      scrollbars: {
        visibility: 'auto',
        autoHide: 'never',
        autoHideDelay: 800,
        dragScroll: true,
        clickScroll: false,
        touchSupport: true,
        snapHandle: false
      }
    })

    // Custom positioning with CSS
    const style = document.createElement('style')
    style.textContent = `
      .os-scrollbar-vertical {
        right: 30px !important;
        width: 10px !important;
        top: 38% !important;
        height: 24% !important;
      }
      .os-scrollbar-horizontal {
        bottom: 30px !important;
        height: 10px !important;
        left: 38% !important;
        width: 24% !important;
      }
      .os-scrollbar .os-scrollbar-track {
        background: rgba(128, 128, 128, 0.2) !important;
        border-radius: 8px !important;
      }
      .os-scrollbar .os-scrollbar-handle {
        background: white !important;
        border-radius: 6px !important;
        min-height: 35px !important;
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.1) !important;
        pointer-events: none !important;
      }
      .os-scrollbar-track {
        pointer-events: none !important;
      }
    `
    document.head.appendChild(style)

    // Completely disable scrollbar interactions
    setTimeout(() => {
      const scrollbars = document.querySelectorAll('.os-scrollbar, .os-scrollbar-track, .os-scrollbar-handle')
      scrollbars.forEach(element => {
        element.style.pointerEvents = 'none'
      })
    }, 200)

    // Stop any auto-scroll animations
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'auto'
    }, 100)
  }, [])

  return (
    <html lang="ko">
      <head>
        <title>EMOLA</title>
        <meta name="description" content="F1의 속도와 열정을 경험하세요. 드라이버 프로필, 팀 정보, 챔피언십 기록, 최신 뉴스까지 모든 F1 정보를 EMOLA에서." />
        <meta name="keywords" content="F1, Formula1, EMOLA, 레이싱, 드라이버, 포뮬러원, 챔피언십, 모터스포츠" />
        <meta property="og:image" content="/images/og-emola.jpg" />
      </head>
      <body>
        <div id="app" className="app-container">
          {/* Dark Background with Particle Effect */}
          <div className="dark-background">
            <div className="particle-layer"></div>
            <div className="gradient-overlay"></div>
          </div>

          {/* App Header */}
          <AppHeader />

          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>

          {/* App Footer */}
          <AppFooter />
        </div>
      </body>
    </html>
  )
}