export const useTracksStore = defineStore('tracks', {
  state: () => ({
    rawTracks: ref([]),
    likedTracks: new Set(),
    pending: ref(false),
    error: ref(null),
filters: ref({
  authors: [],
  genres: [],
  years: [],
  search: '',
  initialized: false
}),
  }),

  actions: {
   
    async fetchTracks() {
      this.pending = true;
      try {
        const userStore = useUserStore();
        const { data } = await $fetch(
          'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/', 
          { lazy: true }
        );

        // Проверка формата данных
        const rawData = data?.data || data || [];
        
        this.rawTracks = rawData.map(track => {
          const isLiked = userStore.isAuth && track.staredUser?.includes(userStore.userId);
          if (isLiked) this.likedTracks.add(track._id);

          return {
            id: track._id,
            title: track.name || "Без названия",
            author: track.author || "Неизвестный исполнитель",
            album: track.album || "Без альбома",
            duration: formatDuration(track.duration_in_seconds),
            release_date: track.release_date?.slice(0,4) || "Неизвестно",
            genre: Array.isArray(track.genre) ? track.genre : [track.genre || "Неизвестно"],
            track_file: track.track_file || "",
            staredUsers: track.staredUser || [],
            isFavorite: isLiked
          };
        });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.pending = false;
      }
    },

    async fetchFavoriteTracks() {
      try {
        this.pending = true;
        const userStore = useUserStore();
        
        const response = await $fetch(
          'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/favorite/all/', 
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userStore.accessToken}`
            }
          }
        );

        // Универсальная обработка ответа
        const rawData = response?.data || response?.results || response;
        if (!Array.isArray(rawData)) throw new Error('Неверный формат данных');

        this.rawTracks = rawData.map(track => ({
          id: track._id,
          title: track.name || "Без названия",
          author: track.author || "Неизвестный исполнитель",
          album: track.album || "Без альбома",
          duration: formatDuration(track.duration_in_seconds),
          release_date: track.release_date?.slice(0,4) || "Неизвестно",
          genre: Array.isArray(track.genre) ? track.genre : [track.genre || "Неизвестно"],
          track_file: track.track_file || "",
          staredUsers: track.staredUser || [],
          isFavorite: true
        }));

        this.likedTracks = new Set(rawData.map(t => t._id));
        this.error = null;

      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
        this.error = error.data?.message || error.message;
        this.rawTracks = [];
      } finally {
        this.pending = false;
      }
    },

    async toggleFavorite(trackId, isFavoritePage = false) {
  const userStore = useUserStore();
  if (!userStore.isAuth) {
    this.error = 'Требуется авторизация';
    return;
  }

  const originalLiked = new Set(this.likedTracks);
  const wasLiked = originalLiked.has(trackId);

  try {
    // Оптимистичное обновление только лайков
    if (wasLiked) {
      this.likedTracks.delete(trackId);
    } else {
      this.likedTracks.add(trackId);
    }

    // Обновляем состояние только для видимых треков
    this.rawTracks = this.rawTracks.map(track => 
      track.id === trackId ? {
        ...track,
        isFavorite: !wasLiked,
        staredUsers: !wasLiked 
          ? [...track.staredUsers, userStore.userId]
          : track.staredUsers.filter(id => id !== userStore.userId)
      } : track
    );

    // Отправка запроса
    await $fetch(`https://webdev-music-003b5b991590.herokuapp.com/catalog/track/${trackId}/favorite/`, {
      method: wasLiked ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userStore.userId })
    });

    // Удаление только на странице избранного
    if (wasLiked && isFavoritePage) {
      this.rawTracks = this.rawTracks.filter(t => t.id !== trackId);
    }

  } catch (error) {
    // Откат изменений
    this.likedTracks = originalLiked;
    this.rawTracks = this.rawTracks.map(track => 
      track.id === trackId ? {
        ...track,
        isFavorite: wasLiked,
        staredUsers: wasLiked 
          ? [...track.staredUsers, userStore.userId]
          : track.staredUsers.filter(id => id !== userStore.userId)
      } : track
    );
    
    console.error('Ошибка обновления лайка:', error);
    throw new Error(wasLiked 
      ? 'Не удалось убрать лайк' 
      : 'Не удалось добавить в избранное');
  }
},

updateFilter(payload) {
  // Полная замена значения фильтра
  this.filters = {
    ...this.filters,
    ...payload,
    initialized: true
  };
},
    resetFilters() {
      this.filters = {
        authors: [],
        genres: [],
        years: [],
        search: '',
        initialized: false
      };
    },

     async initialize(accessToken) {
      try {
        const response = await $fetch(
          'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/favorite/all/', 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        // Обработка разных форматов ответа
        const rawData = response?.data || response?.results || response;
        
        if (!Array.isArray(rawData)) {
          throw new Error('Некорректный формат ответа сервера');
        }

        // Извлекаем ID треков
        this.likedTracks = new Set(
          rawData.map(track => track.id || track._id)
        );

        console.log('Избранные треки загружены:', this.likedTracks);
        
      } catch (error) {
        console.error('Ошибка загрузки избранного:', {
          error,
          response: error.response?._data || 'Нет данных'
        });
        throw new Error('Не удалось загрузить избранные треки');
      }
    },
  },

  getters: {
filteredTracks: (state) => {
      return filterTracks(state.rawTracks, state.filters).map(track => ({
        ...track,
        isFavorite: state.likedTracks.has(track.id)
      }));
    },
  favoriteTracks: (state) => {
    return state.rawTracks.filter(track => 
      state.likedTracks.has(track.id)
    );
  },
    availableFilters: (state) => getAvailableFilters(state.rawTracks),
  },
  
});
