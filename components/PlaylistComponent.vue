<template>
 <div class="centerblock__content playlist-content">
  <!-- Заголовок таблицы -->
  <div class="content__title playlist-title">
   <!-- колонки -->
  </div>
  
  <!-- Контент -->
  <div class="content__playlist playlist">
   <TrackComponent 
    v-for="track in validTracks" 
    :key="track.id" 
    :track="track"
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
const { 
 data: response, 
 pending, 
 error,
} = await useFetch(
 'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/',
 {
 transform: (responseData) => {
 const processedTracks = responseData.data.map((track) => ({
 id: track._id,
 title: track.name || 'Без названия',
 author: track.artist || 'Неизвестный исполнитель',
 album: track.album || 'Без альбома',
 duration: track.duration || 0,
 track_file: track.track_file || ''
 })).filter(Boolean);
 return processedTracks;
 }
 }
);

const validTracks = computed(() => response.value || []);
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