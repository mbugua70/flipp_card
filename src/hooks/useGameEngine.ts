import { useState, useEffect, useRef, useCallback } from 'react'
import type { Card, Phase } from '../types/game'
import { shuffle } from '../utils/shuffle'

interface GameState {
  cards:          Card[]
  score:          number
  support:        number   // 0–100
  mistakes:       number
  elapsedSeconds: number
  expectedNext:   number   // the card id the player must click next
  isLocked:       boolean  // true during animations — blocks all clicks
}

const INITIAL: Omit<GameState, 'cards'> = {
  score:          0,
  support:        100,
  mistakes:       0,
  elapsedSeconds: 0,
  expectedNext:   1,
  isLocked:       false,
}

function createCards(): Card[] {
  return shuffle(
    Array.from({ length: 12 }, (_, i) => ({
      id:         i + 1,
      isRevealed: false,
      state:      'idle' as const,
    }))
  )
}

interface AudioCues {
  playFlip?:    () => void
  playCorrect?: () => void
  playWrong?:   () => void
  playWin?:     () => void
  playLose?:    () => void
}

export function useGameEngine(phase: Phase, setPhase: (p: Phase) => void, audio: AudioCues = {}) {
  const [state, setState] = useState<GameState>({ ...INITIAL, cards: createCards() })
  const intervalRef  = useRef<ReturnType<typeof setInterval>  | null>(null)
  const timeoutRef   = useRef<ReturnType<typeof setTimeout>   | null>(null)
  const stateRef     = useRef(state)
  stateRef.current = state  // always mirrors latest state for use inside callbacks

  // Fresh shuffle + full reset whenever a new game starts
  useEffect(() => {
    if (phase !== 'countdown') return
    setState({ ...INITIAL, cards: createCards() })
  }, [phase])

  // Preview: reveal all → wait 3 s → hide all → begin playing
  useEffect(() => {
    if (phase !== 'preview') return

    setState(prev => ({
      ...prev,
      cards: prev.cards.map(c => ({ ...c, isRevealed: true })),
    }))

    timeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        cards: prev.cards.map(c => ({ ...c, isRevealed: false })),
      }))
      timeoutRef.current = setTimeout(() => setPhase('playing'), 600)
    }, 3000)

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [phase, setPhase])

  // Timer: counts up every second while the player is playing
  useEffect(() => {
    if (phase === 'playing') {
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }))
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase])

  const handleCardClick = useCallback((card: Card) => {
    const { isLocked, expectedNext, support } = stateRef.current

    // Block clicks during animations or on already-handled cards
    if (isLocked || card.isRevealed || card.state !== 'idle') return

    const isCorrect = card.id === expectedNext

    // Step 1 — reveal the card, lock the board, play flip sound
    audio.playFlip?.()
    setState(s => ({
      ...s,
      isLocked: true,
      cards: s.cards.map(c => c.id === card.id ? { ...c, isRevealed: true } : c),
    }))

    // Step 2 — after flip animation, apply feedback
    timeoutRef.current = setTimeout(() => {
      if (isCorrect) {
        const newExpected = expectedNext + 1
        const isWon = newExpected > 12

        audio.playCorrect?.()
        setState(s => ({
          ...s,
          expectedNext: newExpected,
          score: s.score + 100,
          isLocked: isWon,
          cards: s.cards.map(c => c.id === card.id ? { ...c, state: 'correct' as const } : c),
        }))

        if (isWon) {
          audio.playWin?.()
          timeoutRef.current = setTimeout(() => setPhase('won'), 600)
        }
      } else {
        const newSupport = Math.max(0, support - 10)

        audio.playWrong?.()
        setState(s => ({
          ...s,
          support: newSupport,
          mistakes: s.mistakes + 1,
          cards: s.cards.map(c => c.id === card.id ? { ...c, state: 'wrong' as const } : c),
        }))

        // Step 3 — after shake animation, reset all cards back down
        timeoutRef.current = setTimeout(() => {
          if (newSupport <= 0) {
            audio.playLose?.()
            setPhase('lost')
            return
          }

          setState(s => ({
            ...s,
            expectedNext: 1,
            isLocked: false,
            cards: s.cards.map(c => ({ ...c, isRevealed: false, state: 'idle' as const })),
          }))
        }, 600)
      }
    }, 400)
  }, [setPhase, audio])

  return { ...state, handleCardClick }
}
