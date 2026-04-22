export type Phase = 'start' | 'countdown' | 'preview' | 'playing' | 'won' | 'lost'

export type CardState = 'idle' | 'correct' | 'wrong'

export interface Card {
  id: number          // 1–12, the card's actual value
  isRevealed: boolean // face-up when true
  state: CardState    // feedback state
}
