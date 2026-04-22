import './GameHUD.css'

interface Props {
  score:          number
  elapsedSeconds: number
  expectedNext:   number
  mistakes:       number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function GameHUD({ score, elapsedSeconds, expectedNext, mistakes }: Props) {
  const progress = expectedNext - 1  // cards correctly found so far

  return (
    <div className="hud">

      <div className="hud-stat">
        <span className="hud-label">Score</span>
        <span className="hud-value">{score.toLocaleString()}</span>
      </div>

      <div className="hud-center">
        <span className="hud-progress-text">
          <span className="hud-progress-current">{progress}</span>
          <span className="hud-progress-sep"> / </span>
          <span className="hud-progress-total">12</span>
        </span>
        <div className="hud-progress-bar">
          <div
            className="hud-progress-fill"
            style={{ width: `${(progress / 12) * 100}%` }}
          />
        </div>
      </div>

      <div className="hud-right">
        <div className="hud-stat">
          <span className="hud-label">Mistakes</span>
          <span className="hud-value hud-value--mistakes">{mistakes}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">Time</span>
          <span className="hud-value hud-value--time">{formatTime(elapsedSeconds)}</span>
        </div>
      </div>
    </div>
  )
}
