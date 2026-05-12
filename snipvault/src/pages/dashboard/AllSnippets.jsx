import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnippets, useDeleteSnippet } from '../../hooks/useSnippets'
import SnippetCard from '../../components/snippet/SnippetCard'
import SnippetDrawer from '../../components/snippet/SnippetDrawer'
import SnippetForm from '../../components/snippet/SnippetForm'
import './AllSnippets.css'

export default function AllSnippets() {
  const { langFilter } = useOutletContext()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [langLocal, setLangLocal] = useState('')
  const [drawer, setDrawer] = useState(null)
  const [editSnippet, setEditSnippet] = useState(null)
  const deleteMut = useDeleteSnippet()

  const activeLang = langFilter || langLocal || undefined
  const { data, isLoading } = useSnippets({ language: activeLang })
  const snippets = Array.isArray(data) ? data : []

  const filtered = useMemo(() => {
    let list = snippets
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => s.title?.toLowerCase().includes(q) || s.tags?.some(t => t.includes(q)))
    }
    list = [...list].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
      if (sort === 'language') return (a.language || '').localeCompare(b.language || '')
      return new Date(b.created_at) - new Date(a.created_at)
    })
    return list
  }, [snippets, search, sort])

  const handleDelete = async (id) => {
    await deleteMut.mutateAsync(id)
    setDrawer(null)
  }

  return (
    <div className="all-snippets">
      <div className="all-snippets__toolbar">
        <div className="all-snippets__search-wrap">
          <svg className="all-snippets__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="all-snippets__search" placeholder="Filter snippets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {!langFilter && (
          <select className="select-glass all-snippets__lang" value={langLocal} onChange={e => setLangLocal(e.target.value)}>
            <option value="">All languages</option>
            {['python','javascript','typescript','rust','go','sql','bash'].map(l => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>
            ))}
          </select>
        )}
        <select className="select-glass all-snippets__sort" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="language">Language</option>
        </select>
      </div>

      {isLoading ? (
        <div className="all-snippets__grid">
          {[0,1,2,3,4,5].map(i => <div key={i} className="snippet-skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="all-snippets__empty">
          <div className="all-snippets__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M8 8h8M8 12h5"/></svg>
          </div>
          <p>No snippets found. Create your first snippet!</p>
        </div>
      ) : (
        <motion.div className="all-snippets__grid" layout>
          <AnimatePresence>
            {filtered.map(s => (
              <motion.div key={s._id || s.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <SnippetCard snippet={s} onView={setDrawer} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {drawer && (
          <SnippetDrawer
            snippet={drawer}
            onClose={() => setDrawer(null)}
            onEdit={(s) => { setDrawer(null); setEditSnippet(s) }}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      {editSnippet && <SnippetForm snippet={editSnippet} onClose={() => setEditSnippet(null)} />}
    </div>
  )
}
