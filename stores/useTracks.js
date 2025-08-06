import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  formatDuration,
  filterTracks,
  getAvailableFilters,
  updateFilters,
  resetFilters
} from '@/utils/tracksUtils'

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
        const { data } = await $fetch('https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/', { lazy: true })
        this.rawTracks = data.map(track => ({
          id: track._id,
          title: track.name || "Без названия",
          author: track.author || "Неизвестный исполнитель",
          album: track.album || "Без альбома",
          duration: formatDuration(track.duration_in_seconds),
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

    updateFilter(payload) {
      this.filters = updateFilters(this.filters, payload)
    },

    resetFilters() {
      this.filters = resetFilters()
    }
  },

  getters: {
    filteredTracks: (state) => filterTracks(state.rawTracks, state.filters),
    
    availableFilters: (state) => getAvailableFilters(state.rawTracks)
  }
})