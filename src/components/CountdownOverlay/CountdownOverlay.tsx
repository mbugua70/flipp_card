import './CountdownOverlay.css'

interface Props {
  count: number | 'Go'
}

export function CountdownOverlay({ count }: Props) {
  return (
    <div className="countdown-overlay">
      <div className="countdown-backdrop" />
      <div className="countdown-content">
        <span className="countdown-number">{count}</span>
      </div>
    </div>
  )
}
