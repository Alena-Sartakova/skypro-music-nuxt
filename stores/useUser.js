import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
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

        // 1. Регистрация/авторизация
        const authResponse = await this.fetchApi(endpoint, 'POST', credentials);
        
        // 2. Получение токенов
        const { email, password } = credentials;
        const tokenResponse = await this.fetchApi('/user/token/', 'POST', {
          email,
          password
        });

        // 3. Сохранение данных
        const userData = {
          id: authResponse.result?._id || authResponse._id,
          email: authResponse.result?.email || authResponse.email,
          username: authResponse.result?.username || authResponse.username
        };

        this.user = userData;
        this.accessToken = tokenResponse.access;
        this.refreshToken = tokenResponse.refresh;
        this.isAuth = true;

        this.saveToStorage({
          ...userData,
          accessToken: tokenResponse.access,
          refreshToken: tokenResponse.refresh
        });

        // 4. Вывод в консоль
        console.log('Успешная авторизация. Данные:', {
          user: userData,
          accessToken: tokenResponse.access,
          refreshToken: tokenResponse.refresh
        });

      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

  async clearUser() {
    try {
      // Отправка запроса на сервер для логаута
      await this.fetchApi('/user/logout/', 'POST');
    } catch (error) {
      console.warn('Ошибка при выходе:', error);
    }

    // Сброс состояния
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.isAuth = false;

    // Очистка хранилища
    this.removeFromStorage();

    // Очистка кэша Nuxt
    if (import.meta.env.MODE === 'client') {
      localStorage.removeItem('nuxt:reload');
      sessionStorage.clear();
    }
  },

  removeFromStorage() {
    localStorage.removeItem('user');
    // Дополнительные хранилища
    if (import.meta.env.MODE === 'client') {
      localStorage.removeItem('vuex');
      indexedDB.deleteDatabase('localforage');
    }
  },

    restoreUser() {
      if (typeof window === 'undefined') return;

      const storedData = localStorage.getItem('user');
      if (!storedData) return;

      try {
        const parsedData = JSON.parse(storedData);
        if (this.isValidUser(parsedData)) {
          this.user = {
            id: parsedData.id,
            email: parsedData.email,
            username: parsedData.username
          };
          this.accessToken = parsedData.accessToken;
          this.refreshToken = parsedData.refreshToken;
          this.isAuth = true;
        }
      } catch {
        this.removeFromStorage();
      }
    },

    saveToStorage(data) {
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        email: data.email,
        username: data.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }));
    },

    isValidUser(data) {
      return !!data?.id && 
             !!data?.email && 
             !!data?.username && 
             !!data?.accessToken && 
             !!data?.refreshToken;
    },

    async fetchApi(url, method, body) {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Добавляем Authorization header если есть токен
      if (this.accessToken) {
        headers.Authorization = `Bearer ${this.accessToken}`;
      }

      const response = await fetch(
        `https://webdev-music-003b5b991590.herokuapp.com${url}`, 
        {
          method,
          headers,
          body: JSON.stringify(body)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Unknown error');
      }
      return response.json();
    }
  }
});