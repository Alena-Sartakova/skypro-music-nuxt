<template>
 <div class="centerblock__content playlist-content">
  <!-- Заголовок таблицы -->
  <div class="content__title playlist-title">
    <div class="playlist-title__col col01">Трек</div>
    <div class="playlist-title__col col02">Исполнитель</div>
    <div class="playlist-title__col col03">Альбом</div>
  </div>
  
  <!-- Контент -->
  <div class="content__playlist playlist">
   <TrackComponent 
    v-for="track in tracks" 
    :key="track.id" 
    :track="track"
    :playlist="{ id: 'current', tracks: tracks }"
   />
  </div>
  
  <!-- Состояние загрузки -->
  <div v-if="pending" class="loading">
   Загрузка треков...
  </div>
  
  <!-- Ошибка -->
  <div v-if="error" class="error">
   Ошибка: {{ error.message }}
  </div>
 </div>
</template>

<script setup>
const props = defineProps({
  tracks: {
    type: Array,
    default: () => []
  },
  pending: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
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

.col01 { width: 447px; }
.col02 { width: 321px; }
.col03 { width: 245px; }
.col04 { width: 60px; text-align: end; }
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