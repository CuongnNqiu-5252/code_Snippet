import { useQuery } from '@tanstack/react-query'
import { getRelated } from '../../lib/api'
import Badge from '../ui/Badge'
import './RelatedSnippets.css'

export default function RelatedSnippets({ snippetId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['related', snippetId],
    queryFn: () => getRelated(snippetId).then(r => r.data),
    enabled: !!snippetId,
  })

  const snippets = Array.isArray(data) ? data : []
  if (!snippets.length && !isLoading) return null

  return (
    <div className="related">
      <h4 className="related__heading">Related snippets</h4>
      <div className="related__scroll">
        {isLoading ? (
          [0,1,2].map(i => <div key={i} className="related__skeleton" />)
        ) : (
          snippets.slice(0, 5).map(s => (
            <div key={s._id || s.id} className="related__card">
              <div className="related__card-header">
                <Badge language={s.language} type="language" />
                <span className="related__card-title">{s.title}</span>
              </div>
              {s.summary && <p className="related__card-summary">{s.summary}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
