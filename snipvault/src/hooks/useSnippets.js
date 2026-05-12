import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSnippets, getSnippet, createSnippet, updateSnippet, deleteSnippet } from '../lib/api'

export function useSnippets(params) {
  return useQuery({
    queryKey: ['snippets', params],
    queryFn: () => getSnippets(params).then(r => r.data),
  })
}

export function useSnippet(id, options = {}) {
  return useQuery({
    queryKey: ['snippets', id],
    queryFn: () => getSnippet(id).then(r => r.data),
    enabled: !!id,
    ...options,
  })
}

export function usePendingSnippet(id, status) {
  return useSnippet(id, {
    refetchInterval: status === 'pending' ? 3000 : false,
  })
}

export function useCreateSnippet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createSnippet(data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snippets'] }),
  })
}

export function useUpdateSnippet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateSnippet(id, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snippets'] }),
  })
}

export function useDeleteSnippet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteSnippet(id).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['snippets'] }),
  })
}
