<template>
  <div class="centerblock__content playlist-content">
    <div class="content__title playlist-title">
      <div class="playlist-title__col col01">Трек</div>
      <div class="playlist-title__col col02">Исполнитель</div>
      <div class="playlist-title__col col03">Альбом</div>
    </div>

    <div class="playlist-scroll">
      <!-- Активные фильтры -->
      <div v-if="activeFilters.length" class="active-filters">
        <div
          v-for="(filter, index) in activeFilters"
          :key="index"
          class="filter-tag"
        >
          {{ filter.label }}: {{ filter.value }}
          <button
            @click="removeFilter(filter.type, filter.value)"
            class="filter-tag-remove"
          >
            ×
          </button>
        </div>
        <button
          v-if="activeFilters.length > 1"
          @click="clearAllFilters"
          class="clear-all-filters"
        >
          Сбросить все
        </button>
      </div>

      <!-- Статус поиска -->
      <div v-if="searchStatus" class="search-status">
        Найдено треков: {{ filteredTracks.length }}
      </div>

      <!-- Список треков -->
      <div class="content__playlist playlist">
        <TrackComponent
          v-for="track in filteredTracks"
          :key="track.id"
          :track="track"
          :playlist="{ id: 'current', tracks: filteredTracks }"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>

      <!-- Состояния загрузки -->
      <div v-if="tracksStore.pending" class="loading">
        <div class="loading-spinner"></div>
        Загрузка треков...
      </div>

      <!-- Ошибки -->
      <div v-if="tracksStore.error" class="error">
        ⚠️ Ошибка: {{ tracksStore.error }}
      </div>

      <!-- Пустой результат -->
      <div
        v-if="!filteredTracks.length && !tracksStore.pending"
        class="empty-state"
      >
        😔 Ничего не найдено
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="retry-button"
        >
          Попробовать сбросить фильтры
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { useTracksStore } from "~/stores/useTracks";
import { usePlayerStore } from "~/stores/player";

const props = defineProps({
  isFavoritePage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-favorite"]);

const tracksStore = useTracksStore();
const playerStore = usePlayerStore();

// Вычисляемые свойства
const filteredTracks = computed(() => {
  return tracksStore.filteredTracks;
});
const searchStatus = computed(() => tracksStore.filters.search.length > 0);
const hasActiveFilters = computed(
  () =>
    tracksStore.filters.authors.length > 0 ||
    tracksStore.filters.genres.length > 0 ||
    tracksStore.filters.years.length > 0 ||
    tracksStore.filters.search.length > 0
);

const activeFilters = computed(() => {
  const filters = [];

  // Авторы
  tracksStore.filters.authors.forEach((author) => {
    filters.push({
      type: "authors",
      label: "Исполнитель",
      value: author,
    });
  });

  // Жанры
  tracksStore.filters.genres.forEach((genre) => {
    filters.push({
      type: "genres",
      label: "Жанр",
      value: genre,
    });
  });

  // Годы
  tracksStore.filters.years.forEach((year) => {
    filters.push({
      type: "years",
      label: "Год",
      value: year,
    });
  });

  // Поиск
  if (tracksStore.filters.search) {
    filters.push({
      type: "search",
      label: "Поиск",
      value: `"${tracksStore.filters.search}"`,
    });
  }

  return filters;
});

// Методы
const handleToggleFavorite = (trackId) => {
  emit("toggle-favorite", trackId, props.isFavoritePage);
};

const removeFilter = (type, value) => {
  const newValues = tracksStore.filters[type].filter((v) => v !== value);
  tracksStore.updateFilter({ [type]: newValues });
};

const clearAllFilters = () => {
  tracksStore.resetFilters();
};

// Наблюдатели
watch(filteredTracks, (newTracks) => {
  if (newTracks.length && playerStore.playlistId !== "search-results") {
    playerStore.setPlaylist({
      id: "search-results",
      tracks: newTracks,
    });
  }
});

// Хуки жизненного цикла
onMounted(() => {
  if (!tracksStore.rawTracks.length && !props.isFavoritePage) {
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
.col01 {
  width: 447px;
}
.col02 {
  width: 321px;
}
.col03 {
  width: 245px;
}
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

.active-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid #404040;
}

.filter-tag {
  background: #3a1a4f;
  border-radius: 16px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #d8a4ff;
}

.filter-tag-remove {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  font-size: 16px;
  line-height: 1;
  transition: opacity 0.2s;
}

.filter-tag-remove:hover {
  opacity: 0.8;
}

.clear-all-filters {
  background: none;
  border: 1px solid #ad61ff;
  border-radius: 16px;
  padding: 6px 12px;
  color: #ad61ff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.clear-all-filters:hover {
  background: rgba(173, 97, 255, 0.1);
}

.search-status {
  padding: 12px 0;
  color: #a0a0a0;
  font-size: 14px;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: #a0a0a0;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #a0a0a0;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  color: #ff4d4d;
  padding: 20px;
  text-align: center;
  background: rgba(255, 77, 77, 0.1);
  border-radius: 8px;
  margin: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a0;
  font-size: 16px;
}

.retry-button {
  display: block;
  margin: 12px auto 0;
  background: none;
  border: 1px solid #ad61ff;
  color: #ad61ff;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: rgba(173, 97, 255, 0.1);
}
</style>
