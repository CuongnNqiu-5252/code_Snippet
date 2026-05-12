import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarks } from '../../hooks/useBookmarks'
import { useDeleteSnippet } from '../../hooks/useSnippets'
import SnippetCard from '../../components/snippet/SnippetCard'
import SnippetDrawer from '../../components/snippet/SnippetDrawer'
import SnippetForm from '../../components/snippet/SnippetForm'

export default function Bookmarks() {
  const { data, isLoading } = useBookmarks()
  const [drawer, setDrawer] = useState(null)
  const [editSnippet, setEditSnippet] = useState(null)
  const deleteMut = useDeleteSnippet()
  const snippets = Array.isArray(data) ? data : []

  return (
    <div>
      {isLoading ? (
        <div className="all-snippets__grid">
          {[0,1,2].map(i => <div key={i} className="snippet-skeleton" />)}
        </div>
      ) : snippets.length === 0 ? (
        <div className="all-snippets__empty">
          <div className="all-snippets__empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>No bookmarks yet. Star some snippets to save them here.</p>
        </div>
      ) : (
        <motion.div className="all-snippets__grid" layout>
          <AnimatePresence>
            {snippets.map(s => (
              <motion.div key={s._id || s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SnippetCard snippet={s} onView={setDrawer} bookmarked />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      <AnimatePresence>
        {drawer && (
          <SnippetDrawer
            snippet={drawer} onClose={() => setDrawer(null)}
            onEdit={(s) => { setDrawer(null); setEditSnippet(s) }}
            onDelete={async (id) => { await deleteMut.mutateAsync(id); setDrawer(null) }}
            bookmarked
          />
        )}
      </AnimatePresence>
      {editSnippet && <SnippetForm snippet={editSnippet} onClose={() => setEditSnippet(null)} />}
    </div>
  )
}
