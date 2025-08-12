<template>
  <div class="like-container">
    <button
      class="like-button"
      :class="{ 'is-liked': isLiked }"
      
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
import { computed, ref } from 'vue'

const props = defineProps({
  track: {
    type: Object,
    required: true,
    validator: t => !!t.id && Array.isArray(t.staredUsers)
  }
})

const tracksStore = useTracksStore()

const error = ref(null)


const isLiked = computed(() => props.track.isFavorite);



const handleLikeClick = async () => {
  try {
    await tracksStore.toggleFavorite(props.track.id);
    // Принудительное обновление списка
    tracksStore.rawTracks = [...tracksStore.rawTracks];
  } catch (err) {
    error.value = err.message
    setTimeout(() => error.value = null, 2000)
  } 
}
</script>

<style scoped>
.like-container {
  --icon-size: 18px;
  --icon-color: #696969;
  --active-color: #ad61ff;

  &.small { --icon-size: 14px; }
  &.medium { --icon-size: 18px; }
  &.large { --icon-size: 22px; }
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
