import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    // Текущий трек
    currentTrack: null,
    // Список треков
    playlist: [],
    // Играет ли сейчас
    isPlaying: false,
    // Прогресс воспроизведения (0-100)
    progress: 0,
    // Громкость (0-100)
    volume: 50,
    // Ссылка на аудиотег
    audioRef: null,
    currentTime: 0,
  }),

  actions: {
    // Установить текущий трек
    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    // Установить плейлист
    setPlaylist(tracks) {
      this.playlist = tracks;
    },

    // Установить прогресс
    setProgress(value) {
      this.progress = value;
    },

    // Установить громкость
    setVolume(volume) {
      this.volume = volume;
    },

    // Установить состояние воспроизведения
    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

        setCurrentTime(time) {
      this.currentTime = time;
    },

    // Установить ссылку на аудиоэлемент
    setAudioRef(element) {
      this.audioRef = element;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
      }
    },
  },
});