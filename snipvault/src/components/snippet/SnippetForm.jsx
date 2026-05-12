import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import { useCreateSnippet, useUpdateSnippet } from '../../hooks/useSnippets'
import './SnippetForm.css'

const LANGUAGES = ['python', 'javascript', 'typescript', 'rust', 'go', 'sql', 'bash', 'other']

export default function SnippetForm({ snippet, onClose }) {
  const isEdit = !!snippet
  const createMut = useCreateSnippet()
  const updateMut = useUpdateSnippet()
  const [title, setTitle] = useState(snippet?.title || '')
  const [language, setLanguage] = useState(snippet?.language || 'python')
  const [code, setCode] = useState(snippet?.code || '')
  const [tags, setTags] = useState(snippet?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [isPublic, setIsPublic] = useState(snippet?.is_public ?? true)
  const [error, setError] = useState('')

  const handleCodeKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const s = e.target.selectionStart
      setCode(code.substring(0, s) + '  ' + code.substring(e.target.selectionEnd))
      requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2 })
    }
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase()
      if (!tags.includes(t)) setTags([...tags, t])
      setTagInput('')
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(tags.slice(0, -1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Title is required')
    if (!code.trim()) return setError('Code is required')
    const data = { title: title.trim(), language, code, tags, is_public: isPublic }
    try {
      if (isEdit) await updateMut.mutateAsync({ id: snippet._id || snippet.id, data })
      else await createMut.mutateAsync(data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save snippet')
    }
  }

  const loading = createMut.isPending || updateMut.isPending

  return (
    <AnimatePresence>
      <motion.div className="form-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="form-modal" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-modal__header">
            <h2 className="form-modal__title">{isEdit ? 'Edit Snippet' : 'New Snippet'}</h2>
            <button type="button" className="form-modal__close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="form-modal__body">
            {error && <motion.div className="form-modal__error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
            <input type="text" className="form-modal__title-input" placeholder="Snippet title..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            <div className="form-modal__row">
              <div className="form-modal__field">
                <label className="form-modal__label">Language</label>
                <select className="select-glass" value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-modal__field">
                <label className="form-modal__label">Visibility</label>
                <div className="form-modal__toggle">
                  <button type="button" className={`form-modal__toggle-option ${isPublic ? 'form-modal__toggle-option--active' : ''}`} onClick={() => setIsPublic(true)}>Public</button>
                  <button type="button" className={`form-modal__toggle-option ${!isPublic ? 'form-modal__toggle-option--active' : ''}`} onClick={() => setIsPublic(false)}>Private</button>
                </div>
              </div>
            </div>
            <div className="form-modal__field">
              <label className="form-modal__label">Tags</label>
              <div className="form-modal__tags-input">
                {tags.map(tag => <span key={tag} className="form-modal__tag">{tag}<button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>×</button></span>)}
                <input type="text" placeholder={tags.length ? '' : 'Type + Enter to add tags...'} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="form-modal__tag-field" />
              </div>
            </div>
            <div className="form-modal__field">
              <label className="form-modal__label">Code</label>
              <textarea className="form-modal__code" placeholder="# Paste your code here..." value={code} onChange={e => setCode(e.target.value)} onKeyDown={handleCodeKeyDown} spellCheck={false} />
            </div>
          </div>
          <div className="form-modal__footer">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>{isEdit ? 'Update Snippet' : 'Save Snippet'}</Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}
