import { AnimatePresence, motion } from 'framer-motion'
import './CountdownOverlay.css'

interface Props {
  count: number | 'Go'
}

export function CountdownOverlay({ count }: Props) {
  const isGo = count === 'Go'

  return (
    <div className="countdown-overlay">
      <div className="countdown-backdrop" />
      <div className="countdown-content">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            className="countdown-number"
            data-go={isGo}
            initial={{ scale: 1.5, opacity: 0, y: -20 }}
            animate={{ scale: 1,   opacity: 1, y: 0   }}
            exit={{    scale: 0.5, opacity: 0, y: 20  }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
