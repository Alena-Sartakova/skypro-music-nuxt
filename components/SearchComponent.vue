<template>
  <div class="centerblock__search search">
    <svg class="search__svg">
      <use xlink:href="#icon-search" />
    </svg>
    <input
      v-model="searchQuery"
      class="search__text"
      type="search"
      placeholder="Поиск"
      name="search"
      @input="handleSearch"
    />
    <button 
      v-if="searchQuery"
      class="search__clear"
      @click="clearSearch"
    />
  </div>
</template>

<script setup>


const tracksStore = useTracksStore();
const searchQuery = ref('');
let timeoutId;

const handleSearch = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    tracksStore.setSearchQuery(searchQuery.value.trim());
  }, 300);
};

const clearSearch = () => {
  searchQuery.value = '';
  tracksStore.setSearchQuery('');
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

  .search__svg {
    width: 17px;
    height: 17px;
    margin-right: 5px;
    flex-shrink: 0;
  }

  .search__text {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0;
    color: #fff;
    font-size: 16px;
    line-height: 24px;

    &::placeholder {
      color: #4e4e4e;
    }

    &:focus {
      outline: none;
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
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
}
</style>
