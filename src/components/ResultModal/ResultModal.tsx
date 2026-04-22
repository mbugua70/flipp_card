import { motion, AnimatePresence } from 'framer-motion'
import './ResultModal.css'

interface Props {
  isOpen:         boolean
  outcome:        'won' | 'lost'
  score:          number
  elapsedSeconds: number
  mistakes:       number
  support:        number
  onPlayAgain:    () => void
  onHome:         () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const CONFIG = {
  won: {
    icon:     '🏆',
    title:    'Victory!',
    subtitle: 'You remembered all 12 cards in order.',
    glowBg:   'rgba(16, 185, 129, 0.12)',
    color:    'var(--green)',
  },
  lost: {
    icon:     '💀',
    title:    'Game Over',
    subtitle: 'Your support ran out. Better luck next time!',
    glowBg:   'rgba(239, 68, 68, 0.12)',
    color:    'var(--red)',
  },
}

export function ResultModal({ isOpen, outcome, score, elapsedSeconds, mistakes, support, onPlayAgain, onHome }: Props) {
  const cfg       = CONFIG[outcome]
  const bestScore = localStorage.getItem('msq_best_score')
  const bestTime  = localStorage.getItem('msq_best_time')
  const isNewBest = score > 0 && (!bestScore || score > Number(bestScore))

  const stats = [
    { label: 'Score',    value: score.toLocaleString(), accent: true },
    { label: 'Time',     value: formatTime(elapsedSeconds) },
    { label: 'Mistakes', value: String(mistakes) },
    { label: 'Support',  value: `${support}%` },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="result-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="result-panel"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92,  y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outcome glow at top of panel */}
            <div className="result-glow" style={{ background: cfg.glowBg }} />

            {/* Icon + title */}
            <div className="result-header">
              <span className="result-icon">{cfg.icon}</span>
              <h2 className="result-title" style={{ color: cfg.color }}>{cfg.title}</h2>
              <p className="result-subtitle">{cfg.subtitle}</p>
            </div>

            {/* New best badge */}
            {isNewBest && (
              <div className="result-new-best">⭐ New Best Score!</div>
            )}

            {/* Stats 2×2 grid */}
            <div className="result-stats">
              {stats.map(s => (
                <div key={s.label} className="result-stat">
                  <span className="result-stat-label">{s.label}</span>
                  <span className={`result-stat-value${s.accent ? ' result-stat-value--accent' : ''}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Previous best scores */}
            {bestScore && (
              <div className="result-bests">
                <div className="result-best-item">
                  <span className="result-best-label">Best Score</span>
                  <span className="result-best-value">{Number(bestScore).toLocaleString()}</span>
                </div>
                {bestTime && (
                  <>
                    <div className="result-best-sep" />
                    <div className="result-best-item">
                      <span className="result-best-label">Best Time</span>
                      <span className="result-best-value">{bestTime}s</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="result-actions">
              <motion.button
                className="result-btn-home"
                onClick={onHome}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Home"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </motion.button>

              <motion.button
                className="result-btn"
                onClick={onPlayAgain}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Play Again
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
