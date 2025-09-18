'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>페이지를 찾을 수 없습니다</h2>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link href="/">
        홈으로 돌아가기
      </Link>

      <style jsx>{`
        .not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          color: white;
          background: #000;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #ccc;
        }

        a {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          transition: transform 0.2s;
        }

        a:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}