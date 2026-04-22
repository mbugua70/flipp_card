import { useEffect, useRef, useState } from 'react'
import { StartScreen } from './components/StartScreen/StartScreen'
import { CountdownOverlay } from './components/CountdownOverlay/CountdownOverlay'
import { GameCard } from './components/GameCard/GameCard'
import type { CardState } from './types/game'
import './App.css'

export type Phase = 'start' | 'countdown' | 'preview' | 'playing' | 'won' | 'lost'

const STATES: CardState[] = ['idle', 'correct', 'wrong']

function FlipTest() {
  const [flipped, setFlipped] = useState(false)
  const [stateIdx, setStateIdx] = useState(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 40, alignItems: 'flex-start' }}>
      <GameCard
        card={{ id: 7, isRevealed: flipped, state: STATES[stateIdx] }}
        onClick={() => setFlipped(f => !f)}
      />
      <button
        onClick={() => setStateIdx(i => (i + 1) % STATES.length)}
        style={{ color: 'white', padding: '8px 16px', background: '#333', borderRadius: 8, cursor: 'pointer' }}
      >
        State: {STATES[stateIdx]}
      </button>
    </div>
  )
}

const SEQUENCE: (number | 'Go')[] = [3, 2, 1, 'Go']

export default function App() {
  const [phase, setPhase] = useState<Phase>('start')
  const [countIndex, setCountIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (phase !== 'countdown') return

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

  return (
    <div className="app">
      {phase === 'start' && (
        <StartScreen onStart={() => setPhase('countdown')} />
      )}

      {phase === 'countdown' && (
        <CountdownOverlay count={SEQUENCE[countIndex]} />
      )}

      {/* TODO: review only — click the card to flip it */}
      {phase === 'preview' && <FlipTest />}
    </div>
  )
}
