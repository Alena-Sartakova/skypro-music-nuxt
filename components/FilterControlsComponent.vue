<template>
  <div class="filter-container">
    <span class="filter-label">Искать по:</span>

    <!-- Фильтр по исполнителю -->
    <div class="filter-group">
      <div class="filter-header">
        <button
          class="filter-button"
          :class="{ active: activeDropdown === 'authors' }"
          @click="toggleDropdown('authors')"
        >
          Исполнителю
          <span v-if="selectedAuthors.length" class="filter-indicator">
            {{ selectedAuthors.length }}
          </span>
        </button>
        <button
          v-if="selectedAuthors.length"
          class="clear-filter"
          @click="clearFilter('authors')"
        >
          ×
        </button>
      </div>
      <transition name="dropdown">
        <div v-if="activeDropdown === 'authors'" class="dropdown-menu">
          <ul class="filter-list">
            <li
              v-for="author in availableAuthors"
              :key="author"
              class="filter-item"
              :class="{ selected: selectedAuthors.includes(author) }"
              @click="handleAuthorSelect(author)"
            >
              <span
                class="selection-dot"
                :class="{ visible: selectedAuthors.includes(author) }"
              ></span>
              {{ author }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Фильтр по году -->
    <div class="filter-group">
      <div class="filter-header">
        <button
          class="filter-button"
          :class="{ active: activeDropdown === 'years' }"
          @click="toggleDropdown('years')"
        >
          Году
          <span v-if="selectedYears.length" class="filter-indicator">
            {{ selectedYears.length }}
          </span>
        </button>
        <button
          v-if="selectedYears.length"
          class="clear-filter"
          @click="clearFilter('years')"
        >
          ×
        </button>
      </div>
      <transition name="dropdown">
        <div v-if="activeDropdown === 'years'" class="dropdown-menu">
          <ul class="filter-list">
            <li
              v-for="year in availableYears"
              :key="year"
              class="filter-item"
              :class="{ selected: selectedYears.includes(year) }"
              @click="handleYearSelect(year)"
            >
              <span
                class="selection-dot"
                :class="{ visible: selectedYears.includes(year) }"
              ></span>
              {{ year }}
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Фильтр по жанру -->
    <div class="filter-group">
      <div class="filter-header">
        <button
          class="filter-button"
          :class="{ active: activeDropdown === 'genres' }"
          @click="toggleDropdown('genres')"
        >
          Жанру
          <span v-if="selectedGenres.length" class="filter-indicator">
            {{ selectedGenres.length }}
          </span>
        </button>
        <button
          v-if="selectedGenres.length"
          class="clear-filter"
          @click="clearFilter('genres')"
        >
          ×
        </button>
      </div>
      <transition name="dropdown">
        <div v-if="activeDropdown === 'genres'" class="dropdown-menu">
          <ul class="filter-list">
            <li
              v-for="genre in availableGenres"
              :key="genre"
              class="filter-item"
              :class="{ selected: selectedGenres.includes(genre) }"
              @click="handleGenreSelect(genre)"
            >
              <span
                class="selection-dot"
                :class="{ visible: selectedGenres.includes(genre) }"
              ></span>
              {{ genre }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTracksStore } from '~/stores/useTracks';

const tracksStore = useTracksStore();
const activeDropdown = ref(null);

// Доступные фильтры
const availableAuthors = computed(() => tracksStore.availableFilters.authors);
const availableYears = computed(() => tracksStore.availableFilters.years);
const availableGenres = computed(() => tracksStore.availableFilters.genres);

// Выбранные значения
const selectedAuthors = computed(() => tracksStore.filters.authors);
const selectedYears = computed(() => tracksStore.filters.years);
const selectedGenres = computed(() => tracksStore.filters.genres);

const toggleDropdown = (type) => {
  activeDropdown.value = activeDropdown.value === type ? null : type;
};

const toggleFilter = (type, value) => {
  const currentValues = [...tracksStore.filters[type]];
  const newValues = currentValues.includes(value)
    ? currentValues.filter((v) => v !== value)
    : [...currentValues, value];

  tracksStore.updateFilter({ [type]: newValues });
};

const clearFilter = (type) => {
  tracksStore.updateFilter({ [type]: [] });
  if (activeDropdown.value === type) {
    activeDropdown.value = null;
  }
};

const handleAuthorSelect = (author) => toggleFilter('authors', author);
const handleYearSelect = (year) => toggleFilter('years', year);
const handleGenreSelect = (genre) => toggleFilter('genres', genre);
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

.filter-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
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
  min-width: 18px;
  height: 18px;
  background: #ad61ff;
  border-radius: 9px;
  box-shadow: 0 0 4px rgba(173, 97, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  padding: 0 5px;
}

.clear-filter {
  background: none;
  border: none;
  color: #ad61ff;
  font-size: 18px;
  cursor: pointer;
  padding: 2px;
  margin-left: -4px;
  transition: opacity 0.2s;
}

.clear-filter:hover {
  opacity: 0.8;
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
  opacity: 0;
  transition: opacity 0.2s;
}

.selection-dot.visible {
  opacity: 1;
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
