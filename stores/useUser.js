import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuth: false,
    loading: false,
    error: null
  }),

  actions: {
    async setUser(credentials) {
      try {
        this.loading = true;
        const isSignup = !!credentials.username;
        const endpoint = isSignup ? '/user/signup/' : '/user/login/';

        const response = await this.fetchApi(endpoint, 'POST', credentials);

        const userData = {
          id: response.result?._id || response._id,
          email: response.result?.email || response.email,
          username: response.result?.username || response.username
        };

        this.user = userData;
        this.isAuth = true;
        this.saveToStorage(userData);
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearUser() {
      this.user = null;
      this.isAuth = false;
      this.removeFromStorage();
    },

    restoreUser() {
      if (typeof window === 'undefined') return;

      const storedData = localStorage.getItem('user');
      if (!storedData) return;

      try {
        const parsedData = JSON.parse(storedData);
        if (this.isValidUser(parsedData)) {
          this.user = parsedData;
          this.isAuth = true;
        }
      } catch {
        this.removeFromStorage();
      }
    },

    saveToStorage(data) {
      localStorage.setItem('user', JSON.stringify(data));
    },

    removeFromStorage() {
      localStorage.removeItem('user');
    },

    isValidUser(data) {
      return !!data?.id && !!data?.email && !!data?.username;
    },

    getErrorMessage(error) {
      const message = error.message || 'Ошибка авторизации';
      if (message.includes('403')) return 'Пользователь уже существует';
      if (message.includes('401')) return 'Неверные учетные данные';
      return message;
    },

    async fetchApi(url, method, body) {
      const response = await fetch(`https://webdev-music-003b5b991590.herokuapp.com${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(this.isAuth && { 'Authorization': `Bearer ${this.user?.id}` })
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    }
  }
});
