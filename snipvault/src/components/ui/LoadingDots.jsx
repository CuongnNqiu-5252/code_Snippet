import './LoadingDots.css'

export default function LoadingDots({ color = 'var(--accent-cyan)', size = 8 }) {
  return (
    <span className="loading-dots">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="loading-dots__dot"
          style={{
            width: size,
            height: size,
            background: color,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  )
}
