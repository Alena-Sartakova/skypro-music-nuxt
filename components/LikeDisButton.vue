<template>
  <div class="like-container">
    <button
      class="like-button"
      :class="{ 'is-liked': computedIsLiked, 'in-favorites': isFavoritePage }"
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
  showCount: Boolean,
  isFavoritePage: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const emit = defineEmits(["toggle-favorite"]);
const tracksStore = useTracksStore();
const error = ref(null);
const isLoading = ref(false);

const computedIsLiked = computed(() =>
  tracksStore.likedTracks.has(props.track.id)
);

const handleLikeClick = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Блокируем множественные клики
    const wasLiked = computedIsLiked.value;

    // Отправляем событие
    await emit("toggle-favorite", props.track.id, props.isFavoritePage);

    // Ждем завершения операции
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Проверяем результат
    if (wasLiked && !computedIsLiked.value && props.isFavoritePage) {
      // Если трек был удален из избранного
      tracksStore.removeFromFavorites(props.track.id);
    }
  } catch (err) {
    error.value = "Ошибка при обновлении лайка";
    console.error("Ошибка обработки лайка:", err);
  } finally {
    isLoading.value = false;
    // Скрываем ошибку через 2 секунды
    if (error.value) {
      setTimeout(() => {
        if (error.value) error.value = null;
      }, 2000);
    }
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
