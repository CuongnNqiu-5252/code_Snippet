import { motion } from 'framer-motion'
import './GlassCard.css'

export default function GlassCard({ children, className = '', hover = false, onClick, style }) {
  const Component = hover ? motion.div : 'div'
  const motionProps = hover ? {
    whileHover: { y: -4, borderColor: 'rgba(0, 212, 255, 0.4)' },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {}

  return (
    <Component
      className={`glass-card ${hover ? 'glass-card--hover' : ''} ${className}`}
      onClick={onClick}
      style={style}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
