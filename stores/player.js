import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0,
    volume: 50,
    audioRef: null,
    currentTime: 0,
    currentTrackIndex: -1,
    isShuffle: false,
    isLoop: false,
    originalPlaylist: [],
    shufflePlaylist: []
  }),

  getters: {
    hasPrevTrack(state) {
      if (state.isLoop) return true;
      return state.currentTrackIndex > 0;
    },
    hasNextTrack(state) {
      if (state.isLoop) return true;
      return state.currentTrackIndex < this.activePlaylist.length - 1;
    },
    activePlaylist(state) {
      return state.isShuffle ? state.shufflePlaylist : state.playlist;
    }
  },

  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track;
      this.currentTrackIndex = this.activePlaylist.findIndex(t => t.id === track.id);
    },

    setPlaylist(tracks) {
      this.playlist = Array.isArray(tracks) ? tracks : [tracks];
      this.originalPlaylist = [...this.playlist];
      this.shufflePlaylist = this.shuffleArray([...this.playlist]);
      this.syncCurrentTrackIndex();
    },

    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
      if (this.isShuffle && this.shufflePlaylist.length === 0) {
        this.shufflePlaylist = this.shuffleArray([...this.playlist]);
      }
      this.syncCurrentTrackIndex();
    },

    toggleLoop() {
      this.isLoop = !this.isLoop;
    },

    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    syncCurrentTrackIndex() {
      this.currentTrackIndex = this.activePlaylist.findIndex(
        t => t.id === this.currentTrack?.id
      ) || 0;
    },

    async playTrack(track) {
      try {
        if (!track?.track_file || !this.audioRef) return;

        if (!this.activePlaylist.some(t => t.id === track.id)) {
          this.setPlaylist([...this.playlist, track]);
        }

        if (this.currentTrack?.id !== track.id) {
          this.audioRef.src = track.track_file;
          await this.audioRef.load();
          this.setCurrentTrack(track);
        }

        await this.audioRef.play();
        this.isPlaying = true;
      } catch (error) {
        console.error("Play error:", error);
        this.isPlaying = false;
      }
    },

    async nextTrack() {
      if (this.isLoop) {
        this.audioRef.currentTime = 0;
        await this.audioRef.play();
        return;
      }

      let newIndex = this.currentTrackIndex + 1;
      if (newIndex >= this.activePlaylist.length) newIndex = 0;
      
      this.currentTrackIndex = newIndex;
      await this.loadCurrentTrack();
    },

    async prevTrack() {
      if (this.isLoop) {
        this.audioRef.currentTime = 0;
        await this.audioRef.play();
        return;
      }

      let newIndex = this.currentTrackIndex - 1;
      if (newIndex < 0) newIndex = this.activePlaylist.length - 1;
      
      this.currentTrackIndex = newIndex;
      await this.loadCurrentTrack();
    },

    async loadCurrentTrack() {
      const track = this.activePlaylist[this.currentTrackIndex];
      if (!track) return;

      this.setCurrentTrack(track);
      if (this.audioRef) {
        this.audioRef.src = track.track_file;
        await this.audioRef.load();
        await this.audioRef.play();
        this.isPlaying = true;
      }
    },

    pauseTrack() {
      if (this.audioRef) {
        this.audioRef.pause();
        this.isPlaying = false;
      }
    },

    setProgress(value) {
      this.progress = value;
    },

    setVolume(volume) {
      this.volume = volume;
    },

    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

    setCurrentTime(time) {
      this.currentTime = time;
    }
  }
});
