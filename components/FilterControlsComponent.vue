<template>
  <div class="centerblock__filter filter">
    <div class="filter__title">Искать по:</div>

    <!-- Фильтр по исполнителю -->
    <div class="filter-wrapper">
      <div
        class="filter__button"
        :class="{ active: activeFilter === 'author' }"
        @click="toggleFilter('author')"
      >
        исполнителю
      </div>
      <div v-show="activeFilter === 'author'" class="filter__dropdown">
        <ul class="filter__list">
          <li v-for="item in authorItems" :key="item" class="filter__item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Фильтр по году -->
    <div class="filter-wrapper">
      <div
        class="filter__button"
        :class="{ active: activeFilter === 'year' }"
        @click="toggleFilter('year')"
      >
        году выпуска
      </div>
      <div v-show="activeFilter === 'year'" class="filter__dropdown">
        <ul class="filter__list">
          <li v-for="item in yearItems" :key="item" class="filter__item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Фильтр по жанру -->
    <div class="filter-wrapper">
      <div
        class="filter__button"
        :class="{ active: activeFilter === 'genre' }"
        @click="toggleFilter('genre')"
      >
        жанру
      </div>
      <div v-show="activeFilter === 'genre'" class="filter__dropdown">
        <ul class="filter__list">
          <li v-for="item in genreItems" :key="item" class="filter__item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
});

const activeFilter = ref(null);

const toggleFilter = (filter) => {
  activeFilter.value = activeFilter.value === filter ? null : filter;
};

// Обработка авторов
const authorItems = computed(() => {
  if (!props.tracks?.length) return [];
  const items = new Set();
  props.tracks.forEach((track) => track.author && items.add(track.author));
  return sortItems(Array.from(items), "Неизвестно");
});

// Обработка годов
const yearItems = computed(() => {
  if (!props.tracks?.length) return [];
  const items = new Set();
  props.tracks.forEach((track) => {
    const year = track.release_date?.split("-")[0] || "Неизвестно";
    items.add(year);
  });
  return sortItems(Array.from(items), "Неизвестно", true);
});

// Обработка жанров
const genreItems = computed(() => {
  if (!props.tracks?.length) return [];
  const items = new Set();
  props.tracks.forEach((track) => {
    const genres = Array.isArray(track.genre) ? track.genre : [track.genre];
    genres.filter(Boolean).forEach((g) => items.add(g.trim()));
  });
  return sortItems(Array.from(items), "неизвестно");
});

// Универсальная сортировка
const sortItems = (arr, unknownWord, isNumeric = false) => {
  return arr.sort((a, b) => {
    if (a === unknownWord) return 1;
    if (b === unknownWord) return -1;
    return isNumeric ? Number(b) - Number(a) : a.localeCompare(b);
  });
};

// Отладка
onMounted(() => {
  console.log("Tracks data:", props.tracks);
});
</script>

<style lang="scss" scoped>
.centerblock__filter {
  display: flex;
  align-items: center;
  margin-bottom: 51px;
  position: relative;
}

.filter__title {
  font: 400 16px/24px sans-serif;
  margin-right: 15px;
}

.filter-wrapper {
  position: relative;
  margin-right: 10px;
}

.filter__button {
  font: 400 16px/24px sans-serif;
  border: 1px solid #fff;
  border-radius: 60px;
  padding: 6px 20px;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    background: rgba(255, 255, 255, 0.15);
    border-color: #ad61ff;
  }
}

.filter__dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  z-index: 1000;
  background: #313131;

  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  min-width: 150px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

  .filter__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .filter__item {
    color: #fff;
    font-size: 14px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
