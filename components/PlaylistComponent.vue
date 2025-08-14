<template>
  <div class="centerblock__content playlist-content">
    <div class="content__title playlist-title">
      <div class="playlist-title__col col01">Трек</div>
      <div class="playlist-title__col col02">Исполнитель</div>
      <div class="playlist-title__col col03">Альбом</div>
    </div>

    <div class="playlist-scroll">
      <!-- Индикатор поиска -->
      <div v-if="searchStatus" class="search-status">
        Найдено треков: {{ filteredTracks.length }}
      </div>

      <div class="content__playlist playlist">
        <TrackComponent
          v-for="track in filteredTracks"
          :key="track.id"
          :track="track"
          :playlist="{ id: 'current', tracks: filteredTracks }"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>

      <div v-if="tracksStore.pending" class="loading">Загрузка треков...</div>
      <div v-if="tracksStore.error" class="error">
        Ошибка: {{ tracksStore.error }}
      </div>

      <div
        v-if="!filteredTracks.length && !tracksStore.pending"
        class="empty-state"
      >
        Ничего не найдено
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
  pending: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Object,
    default: null,
  },
  isFavoritePage: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["toggle-favorite"]);

const tracksStore = useTracksStore();
const playerStore = usePlayerStore();

const filteredTracks = computed(() => tracksStore.filteredTracks);
const searchStatus = computed(
  () => tracksStore.searchQuery && !tracksStore.pending
);

const handleToggleFavorite = (trackId) => {
  emit("toggle-favorite", trackId, props.isFavoritePage);
};

watch(filteredTracks, (newTracks) => {
  if (newTracks.length && playerStore.playlistId !== "search-results") {
    playerStore.setPlaylist({
      id: "search-results",
      tracks: newTracks,
    });
  }
});

onMounted(() => {
  if (!tracksStore.rawTracks.length) {
    tracksStore.fetchTracks();
  }
});
</script>

<style lang="scss" scoped>
// Основные переменные (не влияют на внешний вид)
$text-secondary: #696969;
$scrollbar-thumb: #4a4a4a;
$scrollbar-border: #181818;

.playlist-content {
  height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 -20px;

  .playlist-scroll {
    flex: 1;
    overflow-y: overlay;
    overflow-x: hidden; // Добавлено для предотвращения горизонтального скролла
    padding: 0 20px;
    margin: 0 -20px;

    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: $scrollbar-thumb;
      border-radius: 4px;
      border: 2px solid $scrollbar-border;
    }

    &:hover::-webkit-scrollbar-thumb {
      background: lighten($scrollbar-thumb, 10%);
    }
  }
}

.content__playlist {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.playlist-title {
  &__col {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 2px;
    color: $text-secondary;
    text-transform: uppercase;
  }

  &__svg {
    width: 12px;
    height: 12px;
    fill: transparent;
    stroke: $text-secondary;
  }
}

// Фиксированные ширины колонок (сохранены оригинальные значения)
.col01 { width: 447px; }
.col02 { width: 321px; }
.col03 { width: 245px; }
.col04 { 
  width: 60px;
  text-align: end;
}

// Состояния
.loading {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 1.2em;
}

.error {
  padding: 20px;
  color: #ff4444;
  background: #ffecec;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: $text-secondary;
}

.search-status {
  padding: 10px 0;
  color: $text-secondary;
  font-size: 0.9em;
  border-bottom: 1px solid rgba($text-secondary, 0.2);
  margin-bottom: 15px;
}
</style>
