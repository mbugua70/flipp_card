import { useState } from 'react'
import { StartScreen } from './components/StartScreen/StartScreen'
import { CountdownOverlay } from './components/CountdownOverlay/CountdownOverlay'
import './App.css'

export type Phase = 'start' | 'countdown' | 'preview' | 'playing' | 'won' | 'lost'

export default function App() {
  const [phase, setPhase] = useState<Phase>('start')

  return (
    <div className="app">
      {phase === 'start' && (
        <StartScreen onStart={() => setPhase('countdown')} />
      )}

      {/* TODO: remove preview — for review only */}
      {phase === 'countdown' && (
        <CountdownOverlay count={3} />
      )}
    </div>
  )
}
