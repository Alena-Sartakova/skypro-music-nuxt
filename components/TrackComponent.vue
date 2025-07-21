<template>
  <div class="playlist__item" @click="handleTrackClick">
    <div class="playlist__track track">
      <div class="track__title">
        <div class="track__title-image">
          <svg class="track__title-svg">
            <use xlink:href="#icon-note"></use>
          </svg>
        </div>
        <div class="track__title-text">
          <a class="track__title-link" href="#">
            {{ track.title }}
            <span 
              v-if="track.title && track.title.includes('(Remix)')" 
              class="track__title-span"
            >
              (Remix)
            </span>
          </a>
        </div>
      </div>
      <div class="track__author">
        <a 
          class="track__author-link" 
          href="#"
        >
          {{ track.author || 'Неизвестный исполнитель' }}
        </a>
      </div>
      <div class="track__album">
        <a class="track__album-link" href="#">
          {{ track.album || 'Без альбома' }}
        </a>
      </div>
      <div class="track__time">
        <svg class="track__time-svg">
          <use xlink:href="#icon-like"></use>
        </svg>
        <span class="track__time-text">{{ track.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Объявляем props
const props = defineProps({
 track: {
 type: Object,
 required: true,
 default: () => ({
 id: 0,
 title: '',
 author: '', 
 album: '',
 duration: '',
 genre: '',
 year: 0,
 track_file: ''
 })
 }
});

const playerStore = usePlayerStore();

const handleTrackClick = async () => {
 try {

 if (!props.track.track_file) {
 return;
 }

 if (!playerStore.audioRef) {
 playerStore.setAudioRef(new Audio());
 }

 playerStore.setCurrentTrack(props.track);
 playerStore.audioRef.src = props.track.track_file;
 await playerStore.audioRef.play();
 playerStore.setPlaying(true);

 } catch (error) {
 console.error('Ошибка воспроизведения:', error); 
 playerStore.setPlaying(false);
 }
};
</script>


<style lang="scss" scoped>

.playlist__track {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.track__title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 447px;
}

.track__title-image {
  width: 51px;
  height: 51px;
  padding: 16px;
  background: #313131;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-right: 17px;
}

.track__title-svg {
  width: 18px;
  height: 17px;
  fill: transparent;
  stroke: #4e4e4e;
}

.track__title-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
}

.track__title-span {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e4e4e;
}

.track__author {
  width: 321px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.track__author-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: left;
}

.track__album {
  width: 245px;
}

.track__album-link {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #696969;
}

.track__time-svg {
  width: 14px;
  height: 12px;
  margin-right: 17px;
  fill: transparent;
  stroke: #696969;
}

.track__time-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: #696969;
}
</style>