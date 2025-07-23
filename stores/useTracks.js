import { defineStore } from 'pinia'
import { ref  } from 'vue'

export const useTracksStore = defineStore('tracks', {
  state: () => ({
    rawTracks: ref([]),
    pending: ref(false),
    error: ref(null),
    filters: ref({
      searchQuery: '',
      authorFilter: '',
      genreFilter: '',
      yearFilter: ''
    })
  }),

  actions: {
    async fetchTracks() {
      this.pending = true
      this.error = null
      
      try {
        const { data } = await $fetch(
          "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/"
        )
        
        this.rawTracks = data.map(track => this.transformTrack(track))
      } catch (err) {
        this.error = err.message
      } finally {
        this.pending = false
      }
    },

    transformTrack(track) {
      return {
        id: track._id,
        title: track.name || "Без названия",
        author: track.author || "Неизвестный исполнитель",
        album: track.album || "Без альбома",
        duration: this.formatDuration(track.duration_in_seconds),
        release_date: track.release_date || "Неизвестно",
        genre: Array.isArray(track.genre) ? track.genre : [track.genre || "Неизвестно"],
        track_file: track.track_file || ""
      }
    },

    formatDuration(seconds) {
      if (!seconds) return "0:00"
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    },

    updateFilter(newFilter) {
      this.filters = {...this.filters, ...newFilter}
    }
  },

  getters: {
    validTracks: (state) => {
      return state.rawTracks.filter(track => 
        track.title !== "Без названия" &&
        (
          Array.isArray(track.genre) 
          ? track.genre.some(g => 
              g.toLowerCase().includes(state.filters.genreFilter.toLowerCase())
            )
          : track.genre.toLowerCase().includes(state.filters.genreFilter.toLowerCase())
        ) &&
        track.release_date.includes(state.filters.yearFilter) &&
        (
          track.title.toLowerCase().includes(state.filters.searchQuery.toLowerCase()) ||
          track.author.toLowerCase().includes(state.filters.searchQuery.toLowerCase())
        )
      )
    }
  }
})
