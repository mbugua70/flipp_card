import { motion } from 'framer-motion'
import './StartScreen.css'

interface Props {
  onStart: () => void
}

const BG_CARDS = [
  { pos: { top: '7%',    left:  '4%'  }, rot: -18, delay: 0,    dur: 6.0 },
  { pos: { top: '5%',    right: '5%'  }, rot:  15, delay: -2.5, dur: 7.2 },
  { pos: { top: '40%',   left:  '1%'  }, rot: -22, delay: -4.0, dur: 6.5 },
  { pos: { top: '44%',   right: '2%'  }, rot:  19, delay: -1.5, dur: 5.8 },
  { pos: { bottom: '12%',left:  '7%'  }, rot: -10, delay: -3.2, dur: 7.5 },
  { pos: { bottom: '9%', right: '8%'  }, rot:  13, delay: -0.8, dur: 6.8 },
]

const PILLS = [
  { icon: '🃏', label: '12 Cards' },
  { icon: '🔢', label: 'Click 1 → 12' },
  { icon: '🛡️', label: 'Support Meter' },
]

export function StartScreen({ onStart }: Props) {
  const bestScore = localStorage.getItem('msq_best_score')
  const bestTime  = localStorage.getItem('msq_best_time')

  return (
    <div className="start-screen">
      {/* Ambient radial glow */}
      <div className="start-glow" aria-hidden="true" />

      {/* Floating decorative cards */}
      <div className="start-bg" aria-hidden="true">
        {BG_CARDS.map((c, i) => (
          <div
            key={i}
            className="start-bg-card"
            style={{
              ...c.pos,
              '--rot':   `${c.rot}deg`,
              '--delay': `${c.delay}s`,
              '--dur':   `${c.dur}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="start-content"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Card stack logo */}
        <motion.div
          className="start-logo"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="logo-card logo-card--left" />
          <div className="logo-card logo-card--right" />
          <div className="logo-card logo-card--center">
            <span className="logo-q">?</span>
          </div>
        </motion.div>

        {/* Title + subtitle */}
        <motion.div
          className="start-title-group"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="start-title">
            Memory
            <span className="title-accent"> Sequence</span>
          </h1>
          <p className="start-subtitle">
            Uncover the cards from <strong>1</strong> to <strong>12</strong> — in order
          </p>
        </motion.div>

        {/* How-to-play pills */}
        <motion.div
          className="start-pills"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {PILLS.map(p => (
            <div key={p.label} className="pill">
              <span className="pill-icon" aria-hidden="true">{p.icon}</span>
              <span>{p.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Best scores (shown only when data exists) */}
        {(bestScore || bestTime) && (
          <motion.div
            className="start-bests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {bestScore && (
              <div className="best-stat">
                <span className="best-label">Best Score</span>
                <span className="best-val">{Number(bestScore).toLocaleString()}</span>
              </div>
            )}
            {bestScore && bestTime && <div className="best-sep" />}
            {bestTime && (
              <div className="best-stat">
                <span className="best-label">Best Time</span>
                <span className="best-val">{bestTime}s</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Start button */}
        <motion.button
          className="start-btn"
          onClick={onStart}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Game
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}
