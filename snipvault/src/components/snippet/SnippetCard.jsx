import { motion } from 'framer-motion'
import { useState } from 'react'
import Badge from '../ui/Badge'
import { useToggleBookmark } from '../../hooks/useBookmarks'
import { usePendingSnippet } from '../../hooks/useSnippets'
import './SnippetCard.css'

export default function SnippetCard({ snippet, onView, bookmarked = false }) {
  const toggleBookmark = useToggleBookmark()
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)

  /* Poll pending snippets */
  const { data: freshData } = usePendingSnippet(
    snippet._id || snippet.id,
    snippet.status
  )
  const s = freshData || snippet
  const isPending = s.status === 'pending'

  const handleBookmark = (e) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    toggleBookmark.mutate(s._id || s.id)
  }

  const codePreview = (s.code || '').split('\n').slice(0, 3).join('\n')

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  return (
    <motion.div
      className="snippet-card"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      <div className="snippet-card__header">
        <Badge language={s.language} type="language" />
        <h3 className="snippet-card__title">{s.title}</h3>
        <div className="snippet-card__actions">
          <button
            className={`snippet-card__bookmark ${isBookmarked ? 'snippet-card__bookmark--active' : ''}`}
            onClick={handleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>

      <div className="snippet-card__code">
        <pre><code>{codePreview}</code></pre>
      </div>

      {isPending ? (
        <div className="snippet-card__pending">
          <span className="snippet-card__pending-icon">⟳</span>
          AI analyzing...
        </div>
      ) : (
        s.summary && (
          <p className="snippet-card__summary">
            <span className="snippet-card__summary-icon">✦</span>
            {s.summary}
          </p>
        )
      )}

      {s.tags && s.tags.length > 0 && (
        <div className="snippet-card__tags">
          {s.tags.map(tag => (
            <Badge key={tag} type="tag">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="snippet-card__footer">
        <span className="snippet-card__meta">
          {s.is_public ? 'Public' : 'Private'} · {timeAgo(s.created_at)}
        </span>
        <button className="snippet-card__view" onClick={() => onView?.(s)}>
          View
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
