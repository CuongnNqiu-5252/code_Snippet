import './Badge.css'

const LANG = {
  python:     { bg: 'rgba(96,165,250,0.12)',  text: '#60A5FA', border: 'rgba(96,165,250,0.2)' },
  javascript: { bg: 'rgba(251,191,36,0.12)',  text: '#FBD24C', border: 'rgba(251,191,36,0.2)' },
  typescript: { bg: 'rgba(129,140,248,0.12)', text: '#818CF8', border: 'rgba(129,140,248,0.2)' },
  rust:       { bg: 'rgba(251,146,60,0.12)',  text: '#FB923C', border: 'rgba(251,146,60,0.2)' },
  go:         { bg: 'rgba(52,211,153,0.12)',  text: '#34D399', border: 'rgba(52,211,153,0.2)' },
  sql:        { bg: 'rgba(192,132,252,0.12)', text: '#C084FC', border: 'rgba(192,132,252,0.2)' },
  bash:       { bg: 'rgba(134,239,172,0.12)', text: '#86EFAC', border: 'rgba(134,239,172,0.2)' },
  default:    { bg: 'rgba(156,163,175,0.12)', text: '#9CA3AF', border: 'rgba(156,163,175,0.2)' },
}

export default function Badge({ children, language, type = 'tag' }) {
  if (type === 'language' || language) {
    const lang = language?.toLowerCase() || ''
    const colors = LANG[lang] || LANG.default
    return (
      <span
        className="badge badge--language"
        style={{
          background: colors.bg,
          color: colors.text,
          borderColor: colors.border,
        }}
      >
        {language || children}
      </span>
    )
  }

  if (type === 'status') {
    return (
      <span className="badge badge--status">
        <span className="badge__dot" />
        {children}
      </span>
    )
  }

  return <span className="badge badge--tag">{children}</span>
}
