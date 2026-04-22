import { useEffect, useRef, useState } from 'react'
import { StartScreen } from './components/StartScreen/StartScreen'
import { CountdownOverlay } from './components/CountdownOverlay/CountdownOverlay'
import { GameBoard } from './components/GameBoard/GameBoard'
import { GameHUD } from './components/GameHUD/GameHUD'
import { SupportMeter } from './components/SupportMeter/SupportMeter'
import { ResultModal } from './components/ResultModal/ResultModal'
import { SoundControls } from './components/SoundControls/SoundControls'
import { useGameEngine } from './hooks/useGameEngine'
import { useBestScore } from './hooks/useBestScore'
import { useAudio } from './hooks/useAudio'
import type { Phase } from './types/game'
import './App.css'

const SEQUENCE: (number | 'Go')[] = [3, 2, 1, 'Go']

export default function App() {
  const [phase, setPhase] = useState<Phase>('start')
  const [countIndex, setCountIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { save } = useBestScore()
  const { volume, isMuted, setVolume, toggleMute, playFlip, playCorrect, playWrong, playWin, playLose, playTick, startMusic, stopMusic } = useAudio()
  const { cards, score, support, elapsedSeconds, expectedNext, mistakes, handleCardClick } = useGameEngine(phase, setPhase, {
    playFlip, playCorrect, playWrong, playWin, playLose,
  })

  useEffect(() => {
    if (phase === 'won' || phase === 'lost') {
      save(score, elapsedSeconds, phase === 'won')
    }
  }, [phase])

  // Music: start on preview, stop when game ends or returns home
  useEffect(() => {
    if (phase === 'preview') startMusic()
    if (phase === 'start' || phase === 'won' || phase === 'lost') stopMusic()
  }, [phase])

  // Countdown: 3 → 2 → 1 → Go → preview, with a tick sound on each step
  useEffect(() => {
    if (phase !== 'countdown') return

    setCountIndex(0)
    playTick()   // tick for '3'
    let i = 0

    const advance = () => {
      i++
      if (i < SEQUENCE.length) {
        setCountIndex(i)
        playTick() // tick for 2, 1, Go
        timerRef.current = setTimeout(advance, 1000)
      } else {
        timerRef.current = setTimeout(() => setPhase('preview'), 600)
      }
    }

    timerRef.current = setTimeout(advance, 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, playTick])

  return (
    <div className="app">
      {/* Floating sound controls — visible on every screen except start */}
      {phase !== 'start' && (
        <div className="sound-overlay">
          <SoundControls volume={volume} isMuted={isMuted} setVolume={setVolume} toggleMute={toggleMute} />
        </div>
      )}

      {phase === 'start' && (
        <StartScreen onStart={() => setPhase('countdown')} />
      )}

      {phase === 'countdown' && (
        <CountdownOverlay count={SEQUENCE[countIndex]} />
      )}

      <ResultModal
        isOpen={phase === 'won' || phase === 'lost'}
        outcome={phase === 'won' ? 'won' : 'lost'}
        score={score}
        elapsedSeconds={elapsedSeconds}
        mistakes={mistakes}
        support={support}
        onPlayAgain={() => setPhase('countdown')}
        onHome={() => setPhase('start')}
      />

      {(phase === 'preview' || phase === 'playing') && (
        <div className="game-screen">
          <div className="game-stack">
            <GameHUD
              score={score}
              elapsedSeconds={elapsedSeconds}
              expectedNext={expectedNext}
              mistakes={mistakes}
            />
            <div className="game-support">
              <SupportMeter support={support} />
            </div>
            <GameBoard cards={cards} onCardClick={handleCardClick} />
          </div>
        </div>
      )}
    </div>
  )
}
