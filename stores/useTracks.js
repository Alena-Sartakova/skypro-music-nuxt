import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTracksStore = defineStore('tracks', {
  state: () => ({
    tracks: ref([]),
    pending: ref(false),
    error: ref(null),
    currentGenre: ref(null)
  }),

  actions: {
    async fetchTracks(genre = null) {
      this.pending = true
      this.error = null
      this.currentGenre = genre

      try {
        const response = await fetch("https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/")
        
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)
        
        const data = await response.json()
        const rawTracks = data.data || data

        this.tracks = rawTracks.map(track => ({
          id: track._id,
          title: track.name || 'Без названия',
          author: track.author || 'Неизвестный исполнитель',
          album: track.album || 'Без альбома',
          duration: this.formatDuration(track.duration_in_seconds),
          release_date: track.release_date?.split('-')[0] || 'Неизвестно',
          genre: Array.isArray(track.genre) ? track.genre : [track.genre],
          track_file: track.track_file || ''
        }))

      } catch (err) {
        this.error = err.message
      } finally {
        this.pending = false
      }
    },

    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  },

  getters: {
    filteredTracks: (state) => {
      if (!state.currentGenre) return state.tracks
      return state.tracks.filter(track => 
        track.genre.some(g => g.toLowerCase() === state.currentGenre?.toLowerCase())
      )
    }
  }
})
