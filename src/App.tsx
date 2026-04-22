import { useState } from 'react'
import { StartScreen } from './components/StartScreen/StartScreen'
import './App.css'

export type Phase = 'start' | 'countdown' | 'preview' | 'playing' | 'won' | 'lost'

export default function App() {
  const [phase, setPhase] = useState<Phase>('start')

  return (
    <div className="app">
      {phase === 'start' && (
        <StartScreen onStart={() => setPhase('countdown')} />
      )}
    </div>
  )
}
