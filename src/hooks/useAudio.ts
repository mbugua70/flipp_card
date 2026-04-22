import { useState, useEffect, useCallback } from 'react'
import { Howl, Howler } from 'howler'

const KEY_VOLUME = 'msq_volume'
const KEY_MUTED  = 'msq_muted'

// Sound files must be placed in public/sounds/
// One Howl instance per sound, created once at module level
const sfx = {
  flip:    new Howl({ src: ['/sounds/flip.wav'],    volume: 0.6, preload: true }),
  correct: new Howl({ src: ['/sounds/correct.wav'], volume: 0.7, preload: true }),
  wrong:   new Howl({ src: ['/sounds/wrong.wav'],   volume: 0.7, preload: true }),
  win:     new Howl({ src: ['/sounds/win.wav'],     volume: 0.9, preload: true }),
  lose:    new Howl({ src: ['/sounds/lose.wav'],    volume: 0.9, preload: true }),
  tick:    new Howl({ src: ['/sounds/tick.wav'],    volume: 0.65, preload: true }),
}

const music = new Howl({
  src:     ['/sounds/music.wav'],
  loop:    true,
  volume:  0.18,
  preload: true,
})

export function useAudio() {
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem(KEY_VOLUME)
    return saved !== null ? Number(saved) : 0.7
  })

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem(KEY_MUTED) === 'true'
  })

  // Sync Howler globals whenever volume or mute changes
  useEffect(() => {
    Howler.volume(volume)
    Howler.mute(isMuted)
  }, [volume, isMuted])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v))
    setVolumeState(clamped)
    localStorage.setItem(KEY_VOLUME, String(clamped))
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev
      localStorage.setItem(KEY_MUTED, String(next))
      return next
    })
  }, [])

  const playFlip    = useCallback(() => sfx.flip.play(),    [])
  const playCorrect = useCallback(() => sfx.correct.play(), [])
  const playWrong   = useCallback(() => sfx.wrong.play(),   [])
  const playWin     = useCallback(() => sfx.win.play(),     [])
  const playLose    = useCallback(() => sfx.lose.play(),    [])
  const playTick    = useCallback(() => sfx.tick.play(),    [])

  const startMusic = useCallback(() => {
    if (!music.playing()) music.play()
  }, [])

  const stopMusic = useCallback(() => music.stop(), [])

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    playFlip,
    playCorrect,
    playWrong,
    playWin,
    playLose,
    playTick,
    startMusic,
    stopMusic,
  }
}
