import './ConfirmLeave.css'

interface Props {
  isOpen:   boolean
  onLeave:  () => void
  onCancel: () => void
}

export function ConfirmLeave({ isOpen, onLeave, onCancel }: Props) {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-panel" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h2 className="confirm-title">Leave game?</h2>
        <p className="confirm-msg">Your current progress will be lost.</p>
        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>Keep playing</button>
          <button className="confirm-btn-leave" onClick={onLeave}>Leave</button>
        </div>
      </div>
    </div>
  )
}
