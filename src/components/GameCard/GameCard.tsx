import { motion, useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import type { Card } from '../../types/game'
import './GameCard.css'

interface Props {
  card: Card
  onClick?: () => void
}

export function GameCard({ card, onClick }: Props) {
  const shakeControls = useAnimationControls()

  useEffect(() => {
    if (card.state === 'wrong') {
      shakeControls.start({
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      })
    } else {
      shakeControls.set({ x: 0 })
    }
  }, [card.state, shakeControls])

  return (
    <motion.div className="card" onClick={onClick} animate={shakeControls}>
      <motion.div
        className="card-inner"
        data-state={card.state}
        animate={{ rotateY: card.isRevealed ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Back face — visible at rotateY(0) */}
        <div className="card-face card-back">
          <div className="card-back-pattern" />
        </div>

        {/* Front face — pre-rotated so it reads correctly at rotateY(180) */}
        <div className="card-face card-front">
          <span className="card-number">{card.id}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
