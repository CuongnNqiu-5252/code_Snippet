import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKeywordSearch, useSemanticSearch } from '../../hooks/useSearch'
import SnippetCard from '../../components/snippet/SnippetCard'
import SnippetDrawer from '../../components/snippet/SnippetDrawer'
import './Search.css'

export default function Search() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('keyword')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [drawer, setDrawer] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 400)
    return () => clearTimeout(t)
  }, [query])

  const keyword = useKeywordSearch(mode === 'keyword' ? debouncedQ : '', undefined)
  const semantic = useSemanticSearch(mode === 'semantic' ? debouncedQ : '')
  const active = mode === 'keyword' ? keyword : semantic
  const results = Array.isArray(active.data) ? active.data : []

  return (
    <div className="search-page">
      <div className="search-page__bar">
        <svg className="search-page__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          className="search-page__input"
          placeholder={mode === 'keyword' ? 'Search by keyword...' : 'Describe what you\'re looking for...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-page__modes">
        <button className={`search-page__mode ${mode === 'keyword' ? 'search-page__mode--active' : ''}`} onClick={() => setMode('keyword')}>
          ⌨ Keyword
        </button>
        <button className={`search-page__mode ${mode === 'semantic' ? 'search-page__mode--active' : ''}`} onClick={() => setMode('semantic')}>
          ✦ Semantic <span className="search-page__beta">Beta</span>
        </button>
      </div>

      <div className="search-page__results">
        {active.isLoading ? (
          <div className="all-snippets__grid">
            {[0,1,2].map(i => <div key={i} className="snippet-skeleton" />)}
          </div>
        ) : !debouncedQ ? (
          <div className="search-page__hint">
            <p>Start typing to search your snippets</p>
          </div>
        ) : results.length === 0 ? (
          <div className="all-snippets__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>No snippets found. Try different keywords.</p>
          </div>
        ) : (
          <motion.div className="all-snippets__grid">
            <AnimatePresence>
              {results.map((s, i) => (
                <motion.div key={s._id || s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <SnippetCard snippet={s} onView={setDrawer} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {drawer && <SnippetDrawer snippet={drawer} onClose={() => setDrawer(null)} />}
      </AnimatePresence>
    </div>
  )
}
