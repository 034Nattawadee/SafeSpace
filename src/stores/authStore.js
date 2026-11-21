import { defineStore } from 'pinia'
import supabase from '../boot/supabase'

let authSubscription = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    loading: true,
    error: null
  }),

  actions: {
    async initializeAuth() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        this.session = data?.session || null
        this.user = this.session?.user || null
        if (!authSubscription) {
          const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              this.session = session
              this.user = session?.user || null
            }
          )
          authSubscription = listener.subscription
        }
      } catch (err) {
        this.error = err.message
        this.session = null
        this.user = null
        console.error('Initialize auth error:', err)
      } finally {
        this.loading = false
      }
    },
    async logout() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        return false
      }
      this.user = null
      this.session = null

      return true
    }
  }
})
