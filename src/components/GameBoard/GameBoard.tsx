import { motion } from 'framer-motion'
import { GameCard } from '../GameCard/GameCard'
import type { Card } from '../../types/game'
import './GameBoard.css'

interface Props {
  cards: Card[]
  onCardClick?: (card: Card) => void
}

const boardVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const cardVariants = {
  hidden:  { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
}

export function GameBoard({ cards, onCardClick }: Props) {
  return (
    <motion.div
      className="game-board"
      variants={boardVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map(card => (
        <motion.div key={card.id} variants={cardVariants}>
          <GameCard
            card={card}
            onClick={() => onCardClick?.(card)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
