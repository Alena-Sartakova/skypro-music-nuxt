// composables/useAudioPlayer.js
import { usePlayerStore } from "~/stores/player";

export const useAudioPlayer = () => {
  const playerStore = usePlayerStore();

  const initPlayer = (element) => {
    if (!element) return;
    playerStore.audioRef = element;
    setupEventListeners();
  };

  const setupEventListeners = () => {
    if (!playerStore.audioRef) return;
    
    playerStore.audioRef.addEventListener('timeupdate', handleTimeUpdate);
    playerStore.audioRef.addEventListener('ended', handleTrackEnd);
  };

  const handleTimeUpdate = () => {
    if (!playerStore.audioRef || !playerStore.currentTrack) return;
    
    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;
    
    if (duration) {
      playerStore.setProgress((currentTime / duration) * 100);
      playerStore.setCurrentTime(currentTime);
    }
  };

  const handleTrackEnd = () => {
    playerStore.setPlaying(false);
    playerStore.setCurrentTime(0);
    playerStore.setProgress(0);
  };

  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.currentTrack) return;
    
    const newTime = (percentage / 100) * playerStore.audioRef.duration;
    playerStore.audioRef.currentTime = newTime;
  };

  const updateVolume = () => {
    if (!playerStore.audioRef) return;
    playerStore.audioRef.volume = playerStore.volume / 100;
  };

  return {
    initPlayer,
    handleTimeUpdate,
    handleTrackEnd,
    seekTo,
    updateVolume
  };
};
