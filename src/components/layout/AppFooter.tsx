'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AppFooter() {
  const [email, setEmail] = useState('')

  const subscribeNewsletter = (e) => {
    e.preventDefault()
    if (!email) return

    console.log('Newsletter subscription:', email)
    alert('뉴스레터 구독이 완료되었습니다!')
    setEmail('')
  }

  return (
    <>
      <footer className="emola-footer">
        {/* 메인 푸터 */}
        <div className="footer-main">
          <div className="footer-container">
            {/* 로고 & 소셜 */}
            <div className="footer-brand">
              <div className="brand-logo">
                <Link href="/" className="logo" style={{ color: '#ffffff' }}>EMOLA</Link>
              </div>
              <p className="brand-desc" style={{ color: '#888' }}>Formula 1 Experience Platform</p>
              <div className="social-links">
                {/* Instagram */}
                <a href="#" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a href="#" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                </a>

                {/* YouTube */}
                <a href="#" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </a>

                {/* Facebook */}
                <a href="#" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                <a href="#" className="social-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* 링크 그룹들 */}
            <div className="footer-links">
              <div className="link-group">
                <h3 className="link-title">Experience</h3>
                <ul className="link-list">
                  <li><Link href="/#drivers">Drivers</Link></li>
                  <li><Link href="/#teams">Teams</Link></li>
                  <li><Link href="/#rules">Rules</Link></li>
                  <li><Link href="/#records">Records</Link></li>
                  <li><Link href="/#circuits">Circuits</Link></li>
                </ul>
              </div>

              <div className="link-group">
                <h3 className="link-title">Partnership</h3>
                <ul className="link-list">
                  <li><Link href="/#with">Sponsors</Link></li>
                  <li><a href="#">Official Store</a></li>
                  <li><a href="#">Merchandise</a></li>
                  <li><a href="#">Tickets</a></li>
                  <li><a href="#">Hospitality</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h3 className="link-title">Company</h3>
                <ul className="link-list">
                  <li><a href="#">About EMOLA</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Press</a></li>
                  <li><a href="#">Contact</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h3 className="link-title">Support</h3>
                <ul className="link-list">
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Customer Service</a></li>
                  <li><a href="#">Size Guide</a></li>
                  <li><a href="#">Delivery Info</a></li>
                  <li><a href="#">Returns</a></li>
                </ul>
              </div>
            </div>

            {/* 뉴스레터 */}
            <div className="newsletter-section">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-desc">최신 F1 소식과 독점 콘텐츠를 받아보세요</p>
              <form className="newsletter-form" onSubmit={subscribeNewsletter}>
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">구독하기</button>
              </form>
            </div>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="footer-bottom">
          <div className="footer-container">
            <div className="bottom-left">
              <p className="copyright">© 2025 EMOLA. All rights reserved.</p>
              <div className="legal-links">
                <a href="#">개인정보처리방침</a>
                <a href="#">이용약관</a>
                <a href="#">쿠키정책</a>
              </div>
            </div>
            <div className="bottom-right">
              <div className="company-info">
                <span>사업자등록번호: 123-45-67890</span>
                <span>통신판매업신고: 2025-서울강남-1234</span>
              </div>
              <div className="payment-methods">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🏦</span>
                <span className="payment-icon">📱</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* 푸터 링크들만 회색으로 강제 설정 */
        .emola-footer a,
        .emola-footer a:link,
        .emola-footer a:visited,
        .emola-footer a:hover,
        .emola-footer a:active {
          color: #888 !important;
          text-decoration: none !important;
        }

        .emola-footer a:hover {
          color: #fff !important;
        }

        /* EMOLA 로고 흰색으로 강제 적용 */
        .emola-footer .footer-brand .brand-logo .logo,
        .emola-footer .footer-brand .brand-logo .logo:link,
        .emola-footer .footer-brand .brand-logo .logo:visited,
        .emola-footer .footer-brand .brand-logo .logo:hover {
          color: #ffffff !important;
        }

        /* Formula 1 Experience Platform 회색으로 강제 적용 */
        .emola-footer .footer-brand .brand-desc,
        .emola-footer .brand-desc {
          color: #888 !important;
        }

        /* 하단 텍스트들 회색으로 */
        .emola-footer .copyright,
        .emola-footer .company-info,
        .emola-footer .newsletter-desc {
          color: #888 !important;
        }
      `}</style>

      <style jsx>{`
        .emola-footer {
          background: #1a1a1a;
          border-top: 1px solid #2a2a2a;
          position: relative;
          z-index: 100;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* 메인 푸터 */
        .footer-main {
          padding: 3rem 0;
        }

        .footer-main .footer-container {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* 브랜드 섹션 */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .brand-logo .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          letter-spacing: 2px;
        }

        .brand-desc {
          color: #888;
          font-size: 0.875rem;
          margin: 0;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #2a2a2a;
          border-radius: 50%;
          color: #888;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #333;
          color: #fff;
          transform: translateY(-2px);
        }

        .social-link svg {
          width: 16px;
          height: 16px;
        }

        /* 링크 그룹 */
        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .link-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .link-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.5px;
        }

        .link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .link-list a {
          color: #888;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
          line-height: 1.4;
        }

        .link-list a:hover {
          color: #fff;
        }

        /* 뉴스레터 */
        .newsletter-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .newsletter-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .newsletter-desc {
          color: #888;
          font-size: 0.8rem;
          margin: 0;
          line-height: 1.4;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .newsletter-input {
          padding: 0.75rem;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          font-size: 0.875rem;
          transition: border-color 0.3s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #555;
        }

        .newsletter-input::placeholder {
          color: #666;
        }

        .newsletter-btn {
          padding: 0.75rem 1.5rem;
          background: #444;
          color: #fff;
          border: 1px solid #666;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
          background: #555;
          border-color: #777;
          transform: translateY(-1px);
        }

        /* 하단 푸터 */
        .footer-bottom {
          padding: 1.5rem 0;
          border-top: 1px solid #2a2a2a;
          background: #111;
        }

        .footer-bottom .footer-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          grid-template-columns: none;
          gap: 2rem;
        }

        .bottom-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .copyright {
          color: #666;
          font-size: 0.8rem;
          margin: 0;
        }

        .legal-links {
          display: flex;
          gap: 1.5rem;
        }

        .legal-links a {
          color: #666;
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.3s ease;
        }

        .legal-links a:hover {
          color: #999;
        }

        .bottom-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .company-info {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #666;
        }

        .payment-methods {
          display: flex;
          gap: 0.5rem;
          font-size: 1.25rem;
          opacity: 0.7;
        }

        /* 반응형 */
        @media (max-width: 1024px) {
          .footer-main .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-bottom .footer-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .bottom-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .bottom-right {
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .footer-main {
            padding: 2rem 0;
          }

          .footer-container {
            padding: 0 1rem;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .company-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </>
  )
}