<template>
            <div class="centerblock__content playlist-content">
              <div class="content__title playlist-title">
                <div class="playlist-title__col col01">Трек</div>
                <div class="playlist-title__col col02">Исполнитель</div>
                <div class="playlist-title__col col03">Альбом</div>
                <div class="playlist-title__col col04">
                  <svg class="playlist-title__svg">
                    <use xlink:href="#icon-watch"></use>
                  </svg>
                </div>
              </div>
              <div class="content__playlist playlist">

<TrackComponent v-for="track in tracks" :key="track.id" :track="track"/>

              </div>
            </div>
</template>

<script setup>
import { inject } from 'vue';
import TrackComponent from './TrackComponent.vue';


const tracks = inject('tracks')


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
</style>