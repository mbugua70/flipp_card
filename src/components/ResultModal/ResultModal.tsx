import { motion, AnimatePresence } from 'framer-motion'
import './ResultModal.css'

interface Props {
  isOpen: boolean
}

export function ResultModal({ isOpen }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="result-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="result-panel"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92,  y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Content goes in Step 2 */}
            <p style={{ color: 'white' }}>Result Modal</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
