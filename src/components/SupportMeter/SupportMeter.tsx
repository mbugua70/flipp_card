import './SupportMeter.css'

interface Props {
  support:   number   // 0–100
  size?:     number   // SVG diameter, default 80
  showLabel?: boolean // show "Support" text below, default true
}

function getColor(support: number): string {
  if (support > 60) return 'var(--green)'
  if (support >= 30) return 'var(--yellow)'
  return 'var(--red)'
}

export function SupportMeter({ support, size = 80, showLabel = true }: Props) {
  const stroke       = size * 0.0875            // scales with size
  const radius       = (size / 2) - (stroke / 2)
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - support / 100)
  const color  = getColor(support)
  const isLow  = support < 30

  return (
    <div className={`support-meter${isLow ? ' support-meter--low' : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="support-svg"
      >
        {/* Track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(124,58,237,0.12)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease',
          }}
        />
      </svg>

      {/* Center percentage */}
      <div className="support-center" style={{ width: size, height: size }}>
        <span className="support-pct" style={{ color }}>{support}</span>
        <span className="support-sign">%</span>
      </div>

      {showLabel && <span className="support-label">Support</span>}
    </div>
  )
}
