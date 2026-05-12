import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getRelated } from '../../lib/api'
import Badge from '../ui/Badge'
import CodeBlock from '../ui/CodeBlock'
import Button from '../ui/Button'
import RelatedSnippets from './RelatedSnippets'
import { useToggleBookmark } from '../../hooks/useBookmarks'
import { useState } from 'react'
import './SnippetDrawer.css'

export default function SnippetDrawer({ snippet, onClose, onEdit, onDelete, bookmarked }) {
  const toggleBookmark = useToggleBookmark()
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)

  if (!snippet) return null

  const id = snippet._id || snippet.id

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toggleBookmark.mutate(id)
  }

  const timeFormat = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="drawer__header">
          <div className="drawer__header-left">
            <Badge language={snippet.language} type="language" />
            <h2 className="drawer__title">{snippet.title}</h2>
          </div>
          <div className="drawer__header-right">
            <button
              className={`drawer__bookmark ${isBookmarked ? 'drawer__bookmark--active' : ''}`}
              onClick={handleBookmark}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button className="drawer__close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="drawer__body">
          <CodeBlock code={snippet.code} language={snippet.language} />

          {snippet.summary && (
            <div className="drawer__summary">
              <div className="drawer__summary-label">✦ AI Summary</div>
              <p className="drawer__summary-text">{snippet.summary}</p>
            </div>
          )}

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="drawer__tags">
              {snippet.tags.map(tag => (
                <Badge key={tag} type="tag">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="drawer__meta">
            <div className="drawer__meta-item">
              <span className="drawer__meta-label">Language</span>
              <span className="drawer__meta-value">{snippet.language}</span>
            </div>
            <div className="drawer__meta-item">
              <span className="drawer__meta-label">Visibility</span>
              <span className="drawer__meta-value">{snippet.is_public ? 'Public' : 'Private'}</span>
            </div>
            <div className="drawer__meta-item">
              <span className="drawer__meta-label">Created</span>
              <span className="drawer__meta-value">{timeFormat(snippet.created_at)}</span>
            </div>
            {snippet.status && (
              <div className="drawer__meta-item">
                <span className="drawer__meta-label">AI Status</span>
                <Badge type="status">{snippet.status === 'done' ? 'AI Analyzed' : 'Processing...'}</Badge>
              </div>
            )}
          </div>

          <RelatedSnippets snippetId={id} />
        </div>

        <div className="drawer__footer">
          <Button variant="ghost" size="md" onClick={() => onEdit?.(snippet)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Button>
          <Button variant="danger" size="md" onClick={() => onDelete?.(id)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
