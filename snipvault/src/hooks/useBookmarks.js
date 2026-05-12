import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookmarks, toggleBookmark } from '../lib/api'

export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => getBookmarks().then(r => r.data),
  })
}

export function useToggleBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => toggleBookmark(id).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] })
      qc.invalidateQueries({ queryKey: ['snippets'] })
    },
  })
}
