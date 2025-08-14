<template>
  <div class="like-container">
    <button
      class="like-button"
      :class="{ 'is-liked': computedIsLiked }"
      @click="handleLikeClick"
    >
      <svg class="icon-like">
        <use xlink:href="#icon-like"></use>
      </svg>
      <span v-if="track.staredUsers.length" class="likes-count">
        {{ track.staredUsers.length }}
      </span>
    </button>
    <div v-if="error" class="error-tooltip">{{ error }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  track: {
    type: Object,
    required: true,
    validator: (t) => !!t.id && Array.isArray(t.staredUsers),
  },
  isPlayer: { // новый пропс для плеера
    type: Boolean,
    default: false
  }
});

const tracksStore = useTracksStore();
const error = ref(null);

// Модифицируем вычисляемое свойство isLiked
const computedIsLiked = computed(() => {
  if (props.isPlayer && !playerStore.isPlaying) {
    return false; // Если в плеере и трек не играет, то не закрашиваем
  }
  return props.track.isFavorite;
});

const handleLikeClick = async () => {
  try {
    await tracksStore.toggleFavorite(props.track.id);
    tracksStore.rawTracks = [...tracksStore.rawTracks];
  } catch (err) {
    error.value = err.message;
    setTimeout(() => (error.value = null), 2000);
  }
};
</script>

<style scoped>
.like-container {
  --icon-size: 18px;
  --icon-color: #696969;
  --active-color: #ad61ff;

  &.small {
    --icon-size: 14px;
  }
  &.medium {
    --icon-size: 18px;
  }
  &.large {
    --icon-size: 22px;
  }
}

.like-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(.is-liked):not(:disabled) {
    opacity: 0.8;
  }

  &.is-liked .icon-like {
    stroke: var(--active-color);
    fill: var(--active-color);
  }
}

.icon-like {
  width: var(--icon-size);
  height: var(--icon-size);
  fill: transparent;
  stroke: var(--icon-color);
  transition: all 0.2s ease;
}

.error-tooltip {
  position: absolute;
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 5px;
}
</style>
