<template>
  <div class="filter-container">
    <span class="filter-label">Искать по:</span>

    <!-- Фильтр по исполнителю -->
    <div class="filter-group">
      <button
        class="filter-button"
        :class="{ active: activeDropdown === 'author' }"
        @click="toggleDropdown('author')"
      >
        Исполнителю
        <span v-if="selectedAuthor" class="filter-indicator"></span>
      </button>
      <transition name="dropdown">
        <div v-if="activeDropdown === 'author'" class="dropdown-menu">
          <ul class="filter-list">
            <li
              v-for="author in authors"
              :key="author"
              class="filter-item"
              :class="{ selected: author === selectedAuthor }"
              @click="handleAuthorSelect(author)"
            >
              <span
                v-if="author === selectedAuthor"
                class="selection-dot"
              ></span>
              {{ author }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Фильтр по году -->
    <div class="filter-group">
      <button
        class="filter-button"
        :class="{ active: activeDropdown === 'year' }"
        @click="toggleDropdown('year')"
      >
        Году
        <span v-if="selectedYear" class="filter-indicator"></span>
      </button>
      <transition name="dropdown">
        <div v-if="activeDropdown === 'year'" class="dropdown-menu">
          <ul class="filter-list">
            <li
              v-for="year in years"
              :key="year"
              class="filter-item"
              :class="{ selected: year === selectedYear }"
              @click="handleYearSelect(year)"
            >
              <span v-if="year === selectedYear" class="selection-dot"></span>
              {{ year }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Фильтр по жанру -->
    <div class="filter-group">
      <button
        class="filter-button"
        :class="{ active: activeDropdown === 'genre' }"
        @click="toggleDropdown('genre')"
      >
        Жанру
        <span v-if="selectedGenre" class="filter-indicator"></span>
      </button>
      <transition name="dropdown">
        <div v-if="activeDropdown === 'genre'" class="dropdown-menu">
          <ul class="filter-list">
            <li
              v-for="genre in genres"
              :key="genre"
              class="filter-item"
              :class="{ selected: genre === selectedGenre }"
              @click="handleGenreSelect(genre)"
            >
              <span v-if="genre === selectedGenre" class="selection-dot"></span>
              {{ genre }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTracksStore } from "~/stores/useTracks";

const tracksStore = useTracksStore();
const activeDropdown = ref(null);

// Доступные фильтры
const authors = computed(() =>
  [...new Set(tracksStore.rawTracks.map((t) => t.author))].sort()
);
const years = computed(() =>
  [...new Set(tracksStore.rawTracks.map((t) => t.release_date))].sort(
    (a, b) => b - a
  )
);
const genres = computed(() =>
  [...new Set(tracksStore.rawTracks.flatMap((t) => t.genre))].sort()
);

// Выбранные значения
const selectedAuthor = computed(() => tracksStore.filters.author);
const selectedYear = computed(() => tracksStore.filters.year);
const selectedGenre = computed(() => tracksStore.filters.genre);

const toggleDropdown = (type) => {
  activeDropdown.value = activeDropdown.value === type ? null : type;
};

const handleFilterSelect = (type, value) => {
  tracksStore.updateFilter({
    [type]: tracksStore.filters[type] === value ? null : value,
  });
  activeDropdown.value = null;
};

const handleAuthorSelect = (author) => handleFilterSelect("author", author);
const handleYearSelect = (year) => handleFilterSelect("year", year);
const handleGenreSelect = (genre) => handleFilterSelect("genre", genre);
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  position: relative;
}

.filter-label {
  font-size: 13px;
  color: #a0a0a0;
  margin-right: 8px;
}

.filter-group {
  position: relative;
}

.filter-button {
  background: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 13px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-button:hover {
  background: #333333;
  border-color: #535353;
}

.filter-button.active {
  background: #3a1a4f;
  border-color: #ad61ff;
  color: #d8a4ff;
}

.filter-indicator {
  width: 8px;
  height: 8px;
  background: #ad61ff;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(173, 97, 255, 0.3);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #333333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 180px;
  max-height: 240px;
  overflow-y: auto;
}

.filter-list {
  list-style: none;
  padding: 6px 0;
  margin: 0;
}

.filter-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #d0d0d0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.filter-item:hover {
  background: #404040;
}

.filter-item.selected {
  color: #ad61ff;
  padding-left: 28px;
}

.selection-dot {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
