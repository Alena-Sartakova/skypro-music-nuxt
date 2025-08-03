import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: computed(() => {
      return !!this.user && !!this.accessToken
    })
  },

  actions: {
    async signup(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://webdev-music-003b5b991590.herokuapp.com/user/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        
        const data = await response.json()
        
        if (response.ok) {
          this.user = data.result
          return data
        } else {
          throw new Error(data.message || 'Ошибка регистрации')
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://webdev-music-003b5b991590.herokuapp.com/user/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        
        const data = await response.json()
        
        if (response.ok) {
          this.accessToken = data.access
          this.refreshToken = data.refresh
          this.isAuthenticated = true
          return data
        } else {
          throw new Error(data.message || 'Ошибка входа')
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async refreshTokenAction() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('https://webdev-music-003b5b991590.herokuapp.com/user/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refresh: this.refreshToken
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          this.accessToken = data.access
          return data
        } else {
          throw new Error(data.detail || 'Ошибка обновления токена')
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
    }
  }
})