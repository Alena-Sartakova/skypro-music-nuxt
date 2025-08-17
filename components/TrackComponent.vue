<template>
  <div class="playlist__item">
    <div class="playlist__track track">
      <div class="track__title">
        <div class="track__title-image">
          <div v-if="isActive" class="playing-dot"></div>
          <svg
            class="track__title-svg"
            :class="{ 'active-track': isActive }"
            @click="handleTrackClick"
          >
            <use xlink:href="#icon-note"></use>
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#">
            {{ track.title }}
            <span
              v-if="track.title && track.title.includes('(Remix)')"
              class="track__title-span"
            >
              (Remix)
            </span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a class="track__author-link" href="#">
          {{ track.author || "Неизвестный исполнитель" }}
        </a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">
          {{ track.album || "Без альбома" }}
        </a>
      </div>
      <div class="track__time">
        <!-- компонент лайка  -->
        <LikeDisButton
          :show-count="true"
          :track="track"
          :is-favorite-page="isFavoritePage"
          class="track__like-button"
          @toggle-favorite="handleToggleFavorite"
        />
        <span class="track__time-text">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import LikeDisButton from "./LikeDisButton.vue";

// Объявляем props
const props = defineProps({
  track: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: "",
      author: "",
      album: "",
      duration: "",
      genre: "",
      year: 0,
      track_file: "",
    })
  },
  isFavoritePage: { // Теперь это отдельный пропс
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["toggle-favorite"]);

const handleToggleFavorite = (trackId, isFavorite) => {
  emit('toggle-favorite', trackId, isFavorite);
};

const playerStore = usePlayerStore();
const tracksStore = useTracksStore();

const handleTrackClick = async () => {
  try {
    if (import.meta.env.DEV) {
      console.groupCollapsed(`Track click: ${props.track.title}`);
      console.log("Track ID:", props.track.id);
      console.log("Track object:", props.track);
      console.log("Is liked:", tracksStore.likedTracks.has(props.track.id));
      console.log("Track file:", props.track.track_file);
      console.groupEnd();
    }
    if (!props.track.track_file) return;

    // Если текущий трек уже играет - ставим на паузу
    if (isActive.value) {
      playerStore.pauseTrack();
      return;
    }

    // Если выбран новый трек
    if (playerStore.currentTrack?.id !== props.track.id) {
      await playerStore.playTrack(props.track);
    } else {
      // Если это тот же трек - продолжаем воспроизведение
      await playerStore.resumeTrack();
    }
  } catch (error) {
    console.error("Ошибка воспроизведения:", error);
    playerStore.setPlaying(false);
  }
};

const isActive = computed(
  () => playerStore.currentTrack?.id === props.track.id && playerStore.isPlaying
);


</script>

<style lang="scss" scoped>
.playlist__track {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.track__title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 447px;
}

.track__title-image {
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-right: 17px;
  position: relative;
}

.playing-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: #b672ff;
  border-radius: 8px;
  animation: bubble_out 0.6s ease-in-out infinite both;
  z-index: 1;
}

@keyframes bubble_out {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track__title-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.track__title-span {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e4e4e;
}

.track__author {
  width: 321px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.track__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: left;
}

.track__album {
  width: 245px;
}

.track__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
}

.track__time-svg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
}

.track__time-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #696969;
}
.track__time {
  display: flex;
  align-items: center;
  gap: 10px; /* Добавили отступы между компонентами */
}

.track__like-button {
  margin-right: 10px; /* Отступ перед временем трека */
}
</style>
