<template>
    <div class="wrapper">
      <div class="container">
        <main class="main">
          <NavbarComponent />
          
          <div class="main__centerblock centerblock">
            <div class="centerblock__search search">
              <svg class="search__svg">
                <use xlink:href="#icon-search"></use>
              </svg>
              <input
                class="search__text"
                type="search"
                placeholder="Поиск"
                name="search"
              />
            </div>
            <h2 class="centerblock__h2">Треки</h2>
            <FilterControlsComponent />
              
            <PlaylistComponent />
          </div>

          <div class="main__sidebar sidebar" >
            <div class="sidebar__personal">
              <p class="sidebar__personal-name">Sergey.Ivanov123</p>
              <div class="sidebar__icon">
                <svg>
                  <use xlink:href="#logout"></use>
                </svg>
              </div>
            </div>
            <div class="sidebar__block">
              <div class="sidebar__list">
                <div class="sidebar__item">
                  <a class="sidebar__link" href="#">
                    <img
                      class="sidebar__img"
                      src="/assets/img/playlist01.png"
                      alt="day's playlist"
                    />
                  </a>
                </div>
                <div class="sidebar__item">
                  <a class="sidebar__link" href="#">
                    <img
                      class="sidebar__img"
                      src="/assets/img/playlist02.png"
                      alt="day's playlist"
                    />
                  </a>
                </div>
                <div class="sidebar__item">
                  <a class="sidebar__link" href="#">
                    <img
                      class="sidebar__img"
                      src="/assets/img/playlist03.png"
                      alt="day's playlist"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </main>

<PlayerBarComponent />

        <footer class="footer"></footer>
      </div>
    </div>
</template>
<script setup>
import { provide, ref } from 'vue';
import { getTracks } from './public/tracks';
import NavbarComponent from '~/components/NavbarComponent.vue';
import PlaylistComponent from '~/components/PlaylistComponent.vue';
import FilterControlsComponent from '~/components/FilterControlsComponent.vue';


const tracks = ref([])
const loadTracks = async () => {
  try {
    const data = await getTracks()
    tracks.value = data
  } catch (error) {
    console.error('Ошибка загрузки треков:', error)
  }
}

// Предоставляем данные потомкам
provide('tracks', tracks)

// Загружаем треки при создании компонента
loadTracks()
</script>
<style>
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #383838;
}

.container {
max-width: 1920px;
  width: 100%;
  padding: 0;
  margin: 0 auto;

  background-color: #181818;
}
.main__centerblock {
  flex: 1;
  min-width: 0;
  padding: 20px 20px calc(111px - 20px);
  margin-left: 0;
}
.centerblock__search {
  width: 100%;
  border-bottom: 1px solid #4e4e4e;
  margin-bottom: 51px;
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
}

.centerblock__h2 {
  font-style: normal;
  font-weight: 400;
  font-size: 64px;
  line-height: 72px;
  letter-spacing: -0.8px;
  margin-bottom: 45px;
}

.main__sidebar {
  width: 418px;
  flex: 0 0 auto;
  padding: 20px 90px 20px 78px;
}
.sidebar__personal {
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
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 12px 0 15px 0;
}

.sidebar__personal-name {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding: 240px 0 0 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.sidebar__list {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link {
  width: 100%;
  height: 100%;
}

.sidebar__img {
  width: 100%;
  height: auto;
}

</style>
