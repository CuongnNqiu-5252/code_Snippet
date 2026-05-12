import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('snipvault_token'),
  user: null,
  setToken: (token) => {
    localStorage.setItem('snipvault_token', token)
    set({ token })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('snipvault_token')
    set({ token: null, user: null })
  },
}))
