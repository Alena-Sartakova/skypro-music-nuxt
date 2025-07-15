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
const { data: rawResponse } = await useFetch(
  'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/'
);
console.log('Raw server response:', rawResponse.value);

const { 
 data: response, 
 pending, 
 error,
} = useFetch(
 'https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/',
 {
 transform: (responseData) => {
 return responseData.data.map(track => ({
 id: track._id,
 title: track.name?.trim() || 'Без названия',
 author: track.author || 'Неизвестный исполнитель',
 album: track.album?.trim() || 'Без альбома',
 duration: formatDuration(track.duration_in_seconds)
 }))
 }
 }
);

const formatDuration = (seconds) => {
 if (!seconds || isNaN(seconds)) return '0:00';
 const minutes = Math.floor(seconds / 60);
 const remainingSeconds = seconds % 60;
 return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

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