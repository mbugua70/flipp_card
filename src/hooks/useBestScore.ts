const KEY_SCORE = 'msq_best_score'
const KEY_TIME  = 'msq_best_time'

export function useBestScore() {
  function save(score: number, elapsedSeconds: number, won: boolean) {
    const prevBest = Number(localStorage.getItem(KEY_SCORE) ?? 0)

    if (score > prevBest) {
      localStorage.setItem(KEY_SCORE, String(score))
    }

    // Best time only recorded on a win
    if (won) {
      const prevTime = Number(localStorage.getItem(KEY_TIME) ?? Infinity)
      if (elapsedSeconds < prevTime) {
        localStorage.setItem(KEY_TIME, String(elapsedSeconds))
      }
    }
  }

  return { save }
}
