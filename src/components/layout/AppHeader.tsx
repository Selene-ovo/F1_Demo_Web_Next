'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  // 음악 트랙 리스트
  const tracks = [
    {
      name: 'Lose My Mind (feat. Doja Cat)',
      src: '/assets/music/Lose_My_Mind_(feat_Doja_Cat).mp3'
    },
    {
      name: 'Messy',
      src: '/assets/music/Messy.mp3'
    }
  ]

  const navigation = [
    { name: 'HOME', path: '/', section: 'home' },
    { name: 'DRIVERS', path: '/#drivers', section: 'drivers' },
    { name: 'TEAMS', path: '/#teams', section: 'teams' },
    { name: 'RULES', path: '/#rules', section: 'rules' },
    { name: 'HISTORY', path: '/#history', section: 'history' },
    { name: 'WITH', path: '/#with', section: 'with' },
    { name: 'CIRCUITS', path: '/#circuits', section: 'circuits' }
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Body scroll lock
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  const scrollToContact = () => {
    console.log('scrollToContact called')

    // 여러 방법으로 footer 찾기 시도
    const footer = document.querySelector('.emola-footer') ||
                   document.querySelector('footer') ||
                   document.querySelector('[class*="footer"]')

    console.log('Found footer:', footer)

    if (footer) {
      console.log('Scrolling to footer')
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      console.log('Footer not found, scrolling to bottom')
      // fallback: scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight || document.body.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const scrollToSection = (sectionName) => {
    closeMenu()

    setTimeout(() => {
      if (sectionName === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // 섹션 클래스명 매핑
      const sectionMap = {
        'drivers': '.section-02',
        'teams': '.teams-03',
        'rules': '.section-04',
        'history': '.history-05',
        'with': '.with-06',
        'circuits': '.home-07'
      }

      const selector = sectionMap[sectionName]
      const element = document.querySelector(selector)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }

  const subscribeNewsletter = (e) => {
    e.preventDefault()
    if (!email) return

    // 실제로는 API 호출
    console.log('Newsletter subscription:', email)
    alert('뉴스레터 구독이 완료되었습니다!')
    setEmail('')
    closeMenu()
  }

  const loadTrack = (index) => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const track = tracks[index]
    if (track) {
      audioRef.current.src = track.src
      audioRef.current.load()
    }
  }

  const toggleMusic = () => {
    if (!audioRef.current) {
      loadTrack(currentTrackIndex)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error)
      })
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    if (tracks.length <= 1) return

    const newIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(newIndex)
    loadTrack(newIndex)

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error)
      })
    }
  }

  const previousTrack = () => {
    if (tracks.length <= 1) return

    const newIndex = currentTrackIndex > 0
      ? currentTrackIndex - 1
      : tracks.length - 1
    setCurrentTrackIndex(newIndex)
    loadTrack(newIndex)

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error)
      })
    }
  }

  // Scroll handler
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
  }

  // ESC key handler
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  return (
    <>
      <header className={`emola-header ${isScrolled ? 'header-scrolled' : ''}`}>
        {/* Header Background Blur */}
        <div className="header-bg"></div>

        {/* Main Header Content */}
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo">
            <Link href="/" className="logo-link">
              <span className="logo-text">EMOLA</span>
              <div className="logo-accent"></div>
            </Link>
          </div>

          {/* Actions */}
          <div className="header-actions">
            {/* Music Section with Mini Controller */}
            <div className={`music-section ${isPlaying ? 'expanded' : ''}`}>
              {/* Main Music Button */}
              <button
                className={`music-btn ${isPlaying ? 'active' : ''}`}
                onClick={toggleMusic}
              >
                {/* Music Icon */}
                <div className="music-icon">
                  {!isPlaying && (
                    <div className="music-lines">
                      <span className="line"></span>
                      <span className="line"></span>
                      <span className="line"></span>
                    </div>
                  )}
                  {/* Sound Wave Animation */}
                  {isPlaying && (
                    <div className="sound-wave">
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                    </div>
                  )}
                </div>
                <div className="btn-bg"></div>
              </button>

              {/* Mini Controller (shows when playing) */}
              {isPlaying && (
                <div className="mini-controller controller-enter">
                  <button className="control-btn prev-btn" onClick={previousTrack}>
                    <span className="control-icon">⏮</span>
                  </button>

                  <button className="control-btn play-pause-btn" onClick={toggleMusic}>
                    <span className="control-icon">{isPlaying ? '⏸' : '▶'}</span>
                  </button>

                  <button className="control-btn next-btn" onClick={nextTrack}>
                    <span className="control-icon">⏭</span>
                  </button>
                </div>
              )}
            </div>

            <button
              className="contact-btn"
              onClick={scrollToContact}
            >
              <span>LET'S TALK</span>
              <div className="btn-bg"></div>
            </button>

            <button
              className={`menu-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="menu-text">MENU</span>
              <div className="menu-icon">
                <span className="menu-line"></span>
                <span className="menu-line"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Full Screen Menu Overlay */}
        {isMenuOpen && (
          <div className="menu-overlay menu-enter" onClick={closeMenu}>
            <nav className="main-nav" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <div className="nav-header">
                <button className="close-btn" onClick={closeMenu}>
                  <span className="close-text">CLOSE</span>
                  <div className="close-icon">×</div>
                </button>
              </div>

              {/* Navigation Menu */}
              <ul className="nav-menu">
                {navigation.map((item, index) => (
                  <li
                    className="nav-item"
                    key={item.name}
                    style={{ '--delay': `${index * 0.1}s` }}
                  >
                    <div
                      className="nav-link"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(item.section)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="nav-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="nav-text">{item.name}</span>
                      <span className="nav-dot">•</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Newsletter Section */}
              <div className="menu-newsletter">
                <h3>Subscribe to our newsletter</h3>
                <form onSubmit={subscribeNewsletter} className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    <span>→</span>
                  </button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </header>

      <style jsx global>{`
        /* 모든 링크 기본 스타일 제거 */
        * {
          color: inherit !important;
        }

        a, a:link, a:visited, a:hover, a:active, a:focus {
          color: inherit !important;
          text-decoration: none !important;
          border-bottom: none !important;
          outline: none !important;
        }

        /* 헤더 전체 링크 스타일 강제 적용 */
        .emola-header a,
        .emola-header a:link,
        .emola-header a:visited,
        .emola-header a:hover,
        .emola-header a:active {
          color: inherit !important;
          text-decoration: none !important;
        }

        .emola-header .nav-text {
          color: rgba(150, 150, 150, 0.9) !important;
        }

        .emola-header .logo-link {
          color: #ffffff !important;
        }
      `}</style>

      <style jsx>{`
        /* Emola Header - Lusion Style */
        .emola-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .header-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .emola-header.header-scrolled .header-bg {
          opacity: 1;
        }

        .emola-header.header-scrolled {
          padding: 1rem 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
          position: relative;
          z-index: 10;
        }

        /* Logo */
        .header-logo {
          z-index: 10;
        }

        .logo-link {
          position: relative;
          text-decoration: none !important;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .logo-text {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #ffffff !important;
          position: relative;
          z-index: 2;
          display: inline-block;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-accent {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #ff0000 0%, #ffffff 50%, #ff0000 100%);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s ease;
          border-radius: 1px;
        }

        .logo-link:hover .logo-text {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
          transform: translateY(-1px);
        }

        .logo-link:hover .logo-accent {
          transform: scaleX(1);
        }

        /* Music Section */
        .music-section {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Music Button */
        .music-btn {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .music-btn .btn-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: -1;
          border-radius: 50%;
        }

        .music-btn:hover .btn-bg {
          transform: translateY(0);
        }

        .music-btn:hover {
          border-color: #ffffff;
        }

        .music-btn:hover .music-lines .line,
        .music-btn:hover .sound-wave .wave {
          background: #000000;
        }

        .music-btn.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .music-icon {
          width: 20px;
          height: 20px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Music Lines (Pause State) */
        .music-lines {
          display: flex;
          gap: 2px;
          align-items: center;
          height: 100%;
        }

        .music-lines .line {
          width: 2px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        .music-lines .line:nth-child(1) {
          height: 8px;
        }

        .music-lines .line:nth-child(2) {
          height: 14px;
        }

        .music-lines .line:nth-child(3) {
          height: 10px;
        }

        /* Sound Wave Animation (Playing State) */
        .sound-wave {
          display: flex;
          gap: 2px;
          align-items: center;
          height: 100%;
        }

        .sound-wave .wave {
          width: 2px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 1px;
          animation: soundWave 1.5s ease-in-out infinite;
        }

        .sound-wave .wave:nth-child(1) {
          height: 6px;
          animation-delay: 0s;
        }

        .sound-wave .wave:nth-child(2) {
          height: 12px;
          animation-delay: 0.2s;
        }

        .sound-wave .wave:nth-child(3) {
          height: 8px;
          animation-delay: 0.4s;
        }

        .sound-wave .wave:nth-child(4) {
          height: 10px;
          animation-delay: 0.6s;
        }

        @keyframes soundWave {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.7;
          }
          50% {
            transform: scaleY(1.8);
            opacity: 1;
          }
        }

        /* Mini Controller */
        .mini-controller {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 25px;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: controllerEnter 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes controllerEnter {
          from {
            opacity: 0;
            transform: translateX(-20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .control-btn {
          width: 35px;
          height: 35px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        .play-pause-btn {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 1);
        }

        .play-pause-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .control-icon {
          font-size: 0.75rem;
          line-height: 1;
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          z-index: 10;
        }

        /* Contact Button */
        .contact-btn {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          position: relative;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 1px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .contact-btn .btn-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: -1;
        }

        .contact-btn:hover .btn-bg {
          transform: translateY(0);
        }

        .contact-btn:hover {
          color: #000000;
          border-color: #ffffff;
        }

        .contact-btn:hover span {
          color: #000000 !important;
        }

        /* Menu Button */
        .menu-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem 0;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .menu-text {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }

        .menu-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .menu-line {
          width: 24px;
          height: 1px;
          background: #ffffff;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: right center;
        }

        .menu-line:last-child {
          width: 16px;
          margin-left: auto;
          transform-origin: right center;
        }

        .menu-btn:hover .menu-line:first-child {
          transform: translateX(-20px);
        }

        .menu-btn:hover .menu-line:last-child {
          transform: translateX(-28px);
        }

        .menu-btn.active .menu-line:first-child {
          transform: rotate(45deg) translate(3px, 3px);
          width: 20px;
        }

        .menu-btn.active .menu-line:last-child {
          transform: rotate(-45deg) translate(3px, -3px);
          width: 20px;
          margin-left: 0;
        }

        .menu-btn:hover .menu-text {
          color: rgba(255, 255, 255, 1);
        }

        /* Full Screen Menu Overlay */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.98);
          backdrop-filter: blur(30px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: menuEnter 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes menuEnter {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(30px);
          }
        }

        .main-nav {
          position: relative;
          width: 100%;
          max-width: 800px;
          padding: 2rem;
          text-align: center;
          animation: navEnter 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.1s both;
        }

        @keyframes navEnter {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Close Button */
        .nav-header {
          position: absolute;
          top: 2.5rem;
          right: 3rem;
          z-index: 10;
        }

        .close-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-text {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }

        .close-icon {
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }

        .close-btn:hover .close-text,
        .close-btn:hover .close-icon {
          color: rgba(255, 255, 255, 1);
        }

        /* Navigation Menu */
        .nav-menu {
          list-style: none;
          padding: 0;
          margin: 4rem 0;
        }

        .nav-item {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          animation-delay: var(--delay);
        }

        .nav-link {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          margin: 0.5rem 0;
          color: rgba(255, 255, 255, 0.8) !important;
          text-decoration: none !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .nav-link:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(10px);
        }

        .nav-number {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
          min-width: 40px;
          text-align: left;
        }

        .nav-text {
          font-size: 1.5rem;
          font-weight: 600;
          flex: 1;
          text-align: center;
          letter-spacing: 2px;
          color: rgba(150, 150, 150, 0.9) !important;
        }

        .nav-dot {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.3);
          min-width: 40px;
          text-align: right;
        }

        /* Newsletter Section */
        .menu-newsletter {
          margin-top: 4rem;
          padding: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0;
          animation: fadeIn 0.6s ease forwards;
          animation-delay: 1.2s;
        }

        .menu-newsletter h3 {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .newsletter-form {
          display: flex;
          gap: 0;
          max-width: 400px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .newsletter-input {
          flex: 1;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.875rem;
          outline: none;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-btn {
          padding: 1rem 1.5rem;
          background: #ffffff;
          border: none;
          color: #000000;
          cursor: pointer;
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
          background: rgba(255, 255, 255, 0.9);
        }

        /* Animations */
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* Laptop/small desktop screens */
        @media (max-width: 1024px) {
          .nav-header {
            top: 2rem;
            right: 2rem;
          }

          .close-btn {
            background: rgba(0, 0, 0, 0.6);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .close-text {
            color: rgba(255, 255, 255, 1);
            font-weight: 600;
            font-size: 1rem;
          }

          .close-icon {
            color: rgba(255, 255, 255, 1);
            font-size: 2.2rem;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }

          .close-btn:hover {
            background: rgba(0, 0, 0, 0.8);
            border-color: rgba(255, 255, 255, 0.5);
          }
        }

        /* Mobile screens */
        @media (max-width: 768px) {
          .header-content {
            padding: 0 1.5rem;
          }

          .music-section {
            gap: 0.5rem;
          }

          .music-btn {
            width: 45px;
            height: 45px;
          }

          .music-icon {
            width: 18px;
            height: 18px;
          }

          .mini-controller {
            padding: 0.4rem 0.6rem;
            gap: 0.4rem;
          }

          .control-btn {
            width: 30px;
            height: 30px;
            font-size: 0.75rem;
          }

          .control-icon {
            font-size: 0.625rem;
          }

          .contact-btn {
            display: none;
          }

          .nav-header {
            top: 1.5rem;
            right: 1.5rem;
          }

          /* Make close button more visible on small screens */
          .close-btn {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .close-text {
            color: rgba(255, 255, 255, 1);
            font-weight: 600;
          }

          .close-icon {
            color: rgba(255, 255, 255, 1);
            font-size: 2.5rem;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }

          .main-nav {
            padding: 1rem;
          }

          .nav-link {
            padding: 1rem 1.5rem;
          }

          .nav-text {
            font-size: 1.25rem;
          }

          .menu-newsletter {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .nav-link {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }

          .nav-number,
          .nav-dot {
            display: none;
          }

          .nav-text {
            font-size: 1.125rem;
            text-align: center;
          }

          .newsletter-form {
            flex-direction: column;
            border-radius: 12px;
          }

          .newsletter-btn {
            border-radius: 0 0 12px 12px;
          }
        }
      `}</style>
    </>
  )
}