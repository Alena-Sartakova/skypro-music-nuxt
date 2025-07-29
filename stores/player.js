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
    currentTrackIndex: -1
  }),

  getters: {
    hasPrevTrack: (state) => state.currentTrackIndex > 0,
    hasNextTrack: (state) => state.currentTrackIndex < state.playlist.length - 1
  },

  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track;
      this.currentTrackIndex = this.playlist.findIndex(t => t.id === track.id);
    },

  setPlaylist(tracks) {
      this.playlist = Array.isArray(tracks) ? tracks : [tracks];
      this.currentTrackIndex = this.currentTrack 
        ? this.playlist.findIndex(t => t.id === this.currentTrack.id)
        : 0; 
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
    },

 async playTrack(track) {
    try {
      if (!track?.track_file || !this.audioRef) return;

      if (!this.playlist.some(t => t.id === track.id)) {
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

    pauseTrack() {
      if (this.audioRef) {
        this.audioRef.pause();
        this.isPlaying = false;
      }
    },

    async nextTrack() {
      if (!this.hasNextTrack) return;

      this.currentTrackIndex++;
      const nextTrack = this.playlist[this.currentTrackIndex];

      if (nextTrack) {
        this.setCurrentTrack(nextTrack);
        if (this.audioRef) {
          this.audioRef.src = nextTrack.track_file;
          await this.audioRef.load();
        }
      }
    },

    async prevTrack() {
      if (!this.hasPrevTrack) return;

      this.currentTrackIndex--;
      const prevTrack = this.playlist[this.currentTrackIndex];

      if (prevTrack) {
        this.setCurrentTrack(prevTrack);
        if (this.audioRef) {
          this.audioRef.src = prevTrack.track_file;
          await this.audioRef.load();
        }
      }
    }
  }
});
