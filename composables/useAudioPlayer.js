import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  // Инициализация плеера
  const initPlayer = (element) => {
    if (!element) {
      console.error("Плеера нет!");
      return;
    }
    playerStore.setAudioRef(element);
    setupEventListeners();
  };

  // Воспроизведение трека
const playTrack = async (track) => {
  try {
    if (playerStore.currentTrack?.id !== track.id) {
      playerStore.setCurrentTrack(track);
      playerStore.audioRef.src = track.track_file;
    }
    
    // Всегда используем актуальное currentTime из хранилища
    playerStore.audioRef.currentTime = playerStore.currentTime; // <-- Важно
    await playerStore.audioRef.play();
    playerStore.setPlaying(true);
  } catch (error) {
    console.error("Ошибка воспроизведения:", error);
    playerStore.setPlaying(false);
  }
};
// Пауза трека
const pauseTrack = () => {
  if (playerStore.audioRef) {
    playerStore.audioRef.pause();
    playerStore.setPlaying(false);
    
    // Сохраняем текущее время через метод хранилища
    playerStore.setCurrentTime(playerStore.audioRef.currentTime);
  }
};

  // Обработка времени
const handleTimeUpdate = () => {
  if (!playerStore.audioRef) return;

  const currentTime = playerStore.audioRef.currentTime;
  const duration = playerStore.audioRef.duration;

  if (duration) {
    const progress = (currentTime / duration) * 100;
    playerStore.setProgress(progress);
  }
};
  // Обработка окончания трека
  const handleTrackEnd = () => {
    playerStore.setPlaying(false);
    // Здесь можно добавить логику для перехода к следующему треку
  };

  // Перемотка
const seekTo = (percentage) => {
  if (!playerStore.audioRef || !playerStore.currentTrack) return;
  
  const newTime = (percentage / 100) * playerStore.audioRef.duration;
  playerStore.audioRef.currentTime = newTime;
  
  // Обновляем текущее время в хранилище сразу при перемотке
  playerStore.setCurrentTime(newTime); // <-- Ключевое изменение
  playerStore.setProgress(percentage);
};

  // Обработка громкости
  const updateVolume = () => {
    if (!playerStore.audioRef) return;
    playerStore.audioRef.volume = playerStore.volume / 100;
  };

  // Настройка обработчиков событий
  const setupEventListeners = () => {
    if (!playerStore.audioRef) return;

    playerStore.audioRef.addEventListener('playing', () => {
      playerStore.setPlaying(true);
    });

    playerStore.audioRef.addEventListener('pause', () => {
      playerStore.setPlaying(false);
    });

    playerStore.audioRef.addEventListener('ended', handleTrackEnd);
  };

  return {
    initPlayer,
    playTrack,
    pauseTrack,
    handleTimeUpdate,
    handleTrackEnd,
    seekTo,
    updateVolume
  };
}
