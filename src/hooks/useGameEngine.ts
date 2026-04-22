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

export function useGameEngine(phase: Phase, setPhase: (p: Phase) => void) {
  const [state, setState] = useState<GameState>({ ...INITIAL, cards: createCards() })
  const intervalRef  = useRef<ReturnType<typeof setInterval>  | null>(null)
  const timeoutRef   = useRef<ReturnType<typeof setTimeout>   | null>(null)

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

  // Placeholder — click logic added in Step 2
  const handleCardClick = useCallback((_card: Card) => {}, [])

  return { ...state, handleCardClick }
}
