import { useEffect, useRef, useState } from 'react'
import { StartScreen } from './components/StartScreen/StartScreen'
import { CountdownOverlay } from './components/CountdownOverlay/CountdownOverlay'
import { GameCard } from './components/GameCard/GameCard'
import './App.css'

export type Phase = 'start' | 'countdown' | 'preview' | 'playing' | 'won' | 'lost'

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

      {/* TODO: review only — two cards side by side, one back one front */}
      {phase === 'preview' && (
        <div style={{ display: 'flex', gap: 16, padding: 40, alignItems: 'center' }}>
          <GameCard card={{ id: 7, isRevealed: false, state: 'idle' }} />
          <GameCard card={{ id: 7, isRevealed: true,  state: 'idle' }} />
        </div>
      )}
    </div>
  )
}
