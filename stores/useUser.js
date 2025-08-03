import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  actions: {
    async signup(credentials) {
      try {
        this.loading = true
        const response = await this.fetchApi('/user/signup/', 'POST', {
          email: credentials.email,
          password: credentials.password,
          username: credentials.username
        })

        // Сохраняем данные пользователя после успешной регистрации
        this.user = {
          email: response.result.email,
          username: response.result.username,
          id: response.result._id
        }
        
        // Перенаправление на логин после регистрации
        return {
          success: true,
          message: response.message
        }

      } catch (error) {
        // Специфичная обработка ошибки занятого email
        if (error.message.includes('403')) {
          this.error = 'Пользователь с таким email уже существует'
        } else {
          this.error = error.message
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      try {
        this.loading = true
        const data = await this.fetchApi('/user/login/', 'POST', credentials)
        
        this.user = {
          email: data.email,
          username: data.username,
          id: data._id
        }
        
        this.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return data
      } catch (error) {
        // Обработка ошибки 401
        if (error.message.includes('401')) {
          this.error = 'Неверный email или пароль'
        } else {
          this.error = error.message
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.$reset()
      localStorage.removeItem('user')
    },

    initialize() {
      const userData = localStorage.getItem('user')
      if (userData) {
        this.user = JSON.parse(userData)
        this.isAuthenticated = true
      }
    },

    async fetchApi(url, method = 'GET', body = null) {
      const response = await fetch(`https://webdev-music-003b5b991590.herokuapp.com${url}`, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(this.isAuthenticated && { 'Authorization': `Bearer ${this.user?.id}` })
        },
        body: body ? JSON.stringify(body) : null
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        let errorMessage = data.message
        switch(response.status) {
          case 403:
            errorMessage = 'Пользователь с таким email уже существует'
            break
          case 401:
            errorMessage = 'Неверные учетные данные'
            break
          case 500:
            errorMessage = 'Ошибка сервера'
            break
        }
        throw new Error(errorMessage)
      }
      
      return data
    }
  }
})
