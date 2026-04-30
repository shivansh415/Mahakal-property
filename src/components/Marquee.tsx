'use client'
import { config } from '@/lib/config'

export default function Marquee() {
  // Repeat content 4× for seamless infinite loop
  const content = config.marqueeText.repeat(4)

  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border-dim)',
        borderBottom: '1px solid var(--border-dim)',
        padding: '18px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'fit-content',
        }}
      >
        <span
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            letterSpacing: '0.1em',
            color: 'var(--gold)',
            paddingRight: '2em',
          }}
        >
          {content}
        </span>
        <span
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            letterSpacing: '0.1em',
            color: 'var(--gold)',
            paddingRight: '2em',
          }}
        >
          {content}
        </span>
      </div>
    </section>
  )
}
