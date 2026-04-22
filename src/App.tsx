import { useEffect, useRef, useState } from 'react'
import { StartScreen } from './components/StartScreen/StartScreen'
import { CountdownOverlay } from './components/CountdownOverlay/CountdownOverlay'
import { GameBoard } from './components/GameBoard/GameBoard'
import type { Card } from './types/game'
import { shuffle } from './utils/shuffle'
import './App.css'

export type Phase = 'start' | 'countdown' | 'preview' | 'playing' | 'won' | 'lost'

function createCards(): Card[] {
  return shuffle(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      isRevealed: false,
      state: 'idle' as const,
    }))
  )
}

const SEQUENCE: (number | 'Go')[] = [3, 2, 1, 'Go']

export default function App() {
  const [phase, setPhase] = useState<Phase>('start')
  const [countIndex, setCountIndex] = useState(0)
  const [cards, setCards] = useState<Card[]>(createCards)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (phase !== 'countdown') return

    setCards(createCards())
    setCountIndex(0)

    let i = 0
    const tick = () => {
      i++
      if (i < SEQUENCE.length) {
        setCountIndex(i)
        timerRef.current = setTimeout(tick, 1000)
      } else {
        timerRef.current = setTimeout(() => setPhase('preview'), 600)
      }
    }

    timerRef.current = setTimeout(tick, 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase])

  useEffect(() => {
    if (phase !== 'preview') return

    // flip all cards face-up
    setCards(prev => prev.map(c => ({ ...c, isRevealed: true })))

    timerRef.current = setTimeout(() => {
      // flip all cards back down then start gameplay
      setCards(prev => prev.map(c => ({ ...c, isRevealed: false })))
      timerRef.current = setTimeout(() => setPhase('playing'), 600)
    }, 3000)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase])

  return (
    <div className="app">
      {phase === 'start' && (
        <StartScreen onStart={() => setPhase('countdown')} />
      )}

      {phase === 'countdown' && (
        <CountdownOverlay count={SEQUENCE[countIndex]} />
      )}

      {(phase === 'preview' || phase === 'playing') && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100svh' }}>
          <GameBoard cards={cards} />
        </div>
      )}
    </div>
  )
}
