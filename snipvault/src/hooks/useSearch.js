import { useQuery } from '@tanstack/react-query'
import { keywordSearch, semanticSearch } from '../lib/api'

export function useKeywordSearch(q, language) {
  return useQuery({
    queryKey: ['search', 'keyword', q, language],
    queryFn: () => keywordSearch(q, language).then(r => r.data),
    enabled: !!q && q.length >= 2,
  })
}

export function useSemanticSearch(q) {
  return useQuery({
    queryKey: ['search', 'semantic', q],
    queryFn: () => semanticSearch(q).then(r => r.data),
    enabled: !!q && q.length >= 2,
  })
}
