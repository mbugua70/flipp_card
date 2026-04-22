import type { Card } from '../../types/game'
import './GameCard.css'

interface Props {
  card: Card
}

export function GameCard({ card }: Props) {
  return (
    <div className="card">
      {/* Back face — shown when card is face-down */}
      <div className="card-face card-back">
        <div className="card-back-pattern" />
      </div>

      {/* Front face — shown when card is face-up */}
      <div className="card-face card-front">
        <span className="card-number">{card.id}</span>
      </div>
    </div>
  )
}
