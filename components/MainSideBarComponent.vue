<template>
  <div class="main__sidebar sidebar">
    <div class="sidebar__personal">
      <p class="sidebar__personal-name">Sergey.Ivanov</p>
      <div class="sidebar__icon">
        <svg>
          <use xlink:href="#logout" />
        </svg>
      </div>
    </div>
    <div class="sidebar__block">
      <div class="sidebar__list">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="sidebar__item"
          :class="{ active: $route.params.id === playlist.id }"
        >
          <NuxtLink class="sidebar__link" :to="`/category/${playlist.id}`">
            <img
              class="sidebar__img"
              :src="getImagePath(playlist.image)"
              :alt="playlist.title"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const playlists = [
  {
    id: "day",
    title: "Плейлист дня",
    image: "playlist01.png"
  },
  {
    id: "dance",
    title: "100 танцевальных хитов",
    image: "playlist02.png"
  },
  {
    id: "indie",
    title: "Инди-заряд",
    image: "playlist03.png"
  },
];

// Функция для формирования пути к изображению
const getImagePath = (imageName) => {
  return `/_nuxt/assets/img/${imageName}`;
};
</script>

<style lang="css">
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