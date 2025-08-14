// composables/useAudioPlayer.js
import { usePlayerStore } from "~/stores/player";

export const useAudioPlayer = () => {
  const playerStore = usePlayerStore();

  // Инициализация аудио элемента
  const initPlayer = (element) => {
    if (!element || !playerStore.isPlayerInitialized) return;
    
    // Инициализация только при первом подключении
    if (!playerStore.audioRef) {
      playerStore.audioRef = element;
      setupEventListeners();
      restorePlayerState();
    }
  };

  // Восстановление предыдущего состояния
  const restorePlayerState = () => {
    if (!playerStore.audioRef) return;
    
    // Восстановление громкости
    playerStore.audioRef.volume = playerStore.volume / 100;
    
    // Восстановление воспроизведения
    if (playerStore.currentTrack) {
      playerStore.audioRef.src = playerStore.currentTrack.track_file;
      if (playerStore.isPlaying) {
        playerStore.audioRef.play().catch(error => {
          console.error("Autoplay failed:", error);
        });
      }
    }
  };

  // Настройка обработчиков событий
  const setupEventListeners = () => {
    const audio = playerStore.audioRef;
    if (!audio) return;

    // Очистка старых обработчиков
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleTrackEnd);

    // Добавление новых обработчиков
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleTrackEnd);
  };

  // Обновление прогресса воспроизведения
  const handleTimeUpdate = () => {
    const audio = playerStore.audioRef;
    if (!audio || !playerStore.currentTrack) return;

    const duration = audio.duration;
    if (duration && duration > 0) {
      const progress = (audio.currentTime / duration) * 100;
      playerStore.setProgress(progress);
      playerStore.setCurrentTime(audio.currentTime);
    }
  };

  // Обработка окончания трека
  const handleTrackEnd = async () => {
    if (!playerStore.audioRef) return;

    if (playerStore.isLoop) {
      playerStore.audioRef.currentTime = 0;
      try {
        await playerStore.audioRef.play();
      } catch (error) {
        console.error("Loop play failed:", error);
      }
    } else {
      await playerStore.nextTrack();
      if (playerStore.currentTrack && playerStore.audioRef) {
        try {
          await playerStore.audioRef.play();
        } catch (error) {
          console.error("Next track play failed:", error);
        }
      }
    }
  };

  // Перемотка трека
  const seekTo = (percentage) => {
    const audio = playerStore.audioRef;
    if (!audio || !playerStore.currentTrack) return;

    const newTime = (percentage / 100) * audio.duration;
    if (!isNaN(newTime)) {
      audio.currentTime = newTime;
    }
  };

  // Обновление громкости
  const updateVolume = () => {
    const audio = playerStore.audioRef;
    if (!audio) return;

    const normalizedVolume = Math.min(Math.max(playerStore.volume / 100, 0), 1);
    audio.volume = normalizedVolume;
  };

  return {
    initPlayer,
    handleTimeUpdate,
    handleTrackEnd,
    seekTo,
    updateVolume
  };
};
