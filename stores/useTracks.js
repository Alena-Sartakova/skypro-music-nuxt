import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTracksStore = defineStore('tracks', {
  state: () => ({
    rawTracks: ref([]),
    pending: ref(false),
    error: ref(null),
    filters: ref({
      author: '',
      genre: '',
      year: '',
      search: ''
    })
  }),

  actions: {
    async fetchTracks() {
      this.pending = true
      try {
        const { data } = await $fetch('https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/' , { lazy: true })
        this.rawTracks = data.map(track => ({
          id: track._id,
          title: track.name || "Без названия",
          author: track.author || "Неизвестный исполнитель",
          album: track.album || "Без альбома",
          duration: this.formatDuration(track.duration_in_seconds),
          release_date: track.release_date?.slice(0,4) || "Неизвестно",
          genre: Array.isArray(track.genre) ? track.genre : [track.genre || "Неизвестно"],
          track_file: track.track_file || ""
        }))
      } catch (err) {
        this.error = err.message
      } finally {
        this.pending = false
      }
    },

    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    },

    updateFilter(payload) {
      this.filters = { ...this.filters, ...payload }
    },

    resetFilters() {
      this.filters = {
        author: '',
        genre: '',
        year: '',
        search: ''
      }
    }
  },

  getters: {
    filteredTracks: (state) => {
      return state.rawTracks.filter(track => {
        const matchesSearch = track.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                              track.author.toLowerCase().includes(state.filters.search.toLowerCase())
        
        const matchesAuthor = !state.filters.author || 
          track.author === state.filters.author
        
        const matchesYear = !state.filters.year || 
          track.release_date === state.filters.year
        
        const matchesGenre = !state.filters.genre || 
          track.genre.includes(state.filters.genre)

        return matchesSearch && matchesAuthor && matchesYear && matchesGenre
      })
    },

    availableFilters: (state) => {
      const authors = new Set()
      const years = new Set()
      const genres = new Set()

      state.rawTracks.forEach(track => {
        authors.add(track.author)
        years.add(track.release_date)
        track.genre.forEach(g => genres.add(g))
      })

      return {
        authors: Array.from(authors).sort(),
        years: Array.from(years).sort().reverse(),
        genres: Array.from(genres).sort()
      }
    }
  }
})