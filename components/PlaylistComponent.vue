<template>
  <div class="centerblock__content playlist-content">
    <!-- Заголовок таблицы -->
    <div class="content__title playlist-title">
      <div class="playlist-title__col col01">Трек</div>
      <div class="playlist-title__col col02">Исполнитель</div>
      <div class="playlist-title__col col03">Альбом</div>
    </div>

    <!-- Контент -->
    <div class="playlist-scroll">
      <div class="content__playlist playlist">
        <TrackComponent
          v-for="track in tracks"
          :key="track.id"
          :track="track"
          :playlist="{ id: 'current', tracks: tracks }"
          @toggle-favorite="(id) => $emit('toggle-favorite', id, props.isFavoritePage)"
        />
      </div>

      <!-- Состояние загрузки -->
      <div v-if="pending" class="loading">Загрузка треков...</div>

      <!-- Ошибка -->
      <div v-if="error" class="error">Ошибка: {{ error.message }}</div>
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
 default: false
 }
});
const playerStore = usePlayerStore();

onMounted(() => {
  /* console.log('Передаваемые треки:', props.tracks.map(t => t.title)); */
  if (playerStore.playlist.length === 0 && props.tracks?.length) {
    playerStore.setPlaylist(props.tracks);
  }
});
</script>

<style lang="scss" scoped>
.playlist-content {
  height: calc(100vh - 240px); 
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 -20px;
}
.playlist-scroll {
  flex: 1;
  overflow-y: overlay;
  padding: 0 20px;
  margin: 0 -20px;

  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
    border: 2px solid #181818;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #5a5a5a;
  }
}
.content__playlist {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}


.playlist-title__col {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 2px;
  color: #696969;
  text-transform: uppercase;
}
.playlist-title__svg {
  width: 12px;
  height: 12px;
  fill: transparent;
  stroke: #696969;
}

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
</style>
