<template>
  <div class="centerblock__search search">
    <svg class="search__svg">
      <use xlink:href="#icon-search" />
    </svg>
    <input
      v-model="searchInput"
      class="search__text"
      placeholder="Поиск..."
      @input="handleSearch"
    />
    <button 
      v-if="searchInput" 
      class="search__clear"
      @click="clearSearch"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const tracksStore = useTracksStore();
let timeout = null;

const searchInput = computed({
  get: () => tracksStore.filters.search,
  set: (value) => tracksStore.setSearchQuery(value)
});

const handleSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    tracksStore.setSearchQuery(searchInput.value);
  }, 300);
};

const clearSearch = () => {
  clearTimeout(timeout); // Отменяем отложенный запрос
  tracksStore.resetFilters(); // Полный сброс всех фильтров
  searchInput.value = ''; // Принудительно обновляем значение
};
</script>


<style lang="scss" scoped>
.centerblock__search {
  position: relative;
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #ad61ff;

    .search__svg {
      fill: #ad61ff;
    }
  }

  .search__svg {
    width: 17px;
    height: 17px;
    margin-right: 5px;
    flex-shrink: 0;
    fill: #4e4e4e;
    transition: fill 0.3s ease;
  }

  .search__text {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0;
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    caret-color: #ad61ff;

    &::placeholder {
      color: #4e4e4e;
      transition: opacity 0.3s ease;
    }

    &:focus {
      outline: none;

      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  .search__clear {
    background: none;
    border: none;
    color: #4e4e4e;
    font-size: 24px;
    line-height: 1;
    padding: 0 5px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: #fff;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }
  }
}
</style>
