import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { getRecommendations } from '../../lib/api'
import SnippetCard from '../../components/snippet/SnippetCard'
import SnippetDrawer from '../../components/snippet/SnippetDrawer'

export default function Recommendations() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations().then(r => r.data),
  })
  const [drawer, setDrawer] = useState(null)
  const snippets = Array.isArray(data) ? data : []

  return (
    <div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.938rem' }}>
        <span style={{ color: 'var(--accent-cyan)' }}>✦</span> Based on your recent activity
      </p>

      {isLoading ? (
        <div className="all-snippets__grid">
          {[0,1,2].map(i => <div key={i} className="snippet-skeleton" />)}
        </div>
      ) : snippets.length === 0 ? (
        <div className="all-snippets__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>
            Browse some snippets first — we'll personalize your feed.
          </p>
        </div>
      ) : (
        <motion.div className="all-snippets__grid" layout>
          <AnimatePresence>
            {snippets.map((s, i) => (
              <motion.div key={s._id || s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SnippetCard snippet={s} onView={setDrawer} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {drawer && <SnippetDrawer snippet={drawer} onClose={() => setDrawer(null)} />}
      </AnimatePresence>
    </div>
  )
}
