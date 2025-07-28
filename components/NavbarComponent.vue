<template>
  <nav class="main__nav nav">
    <div class="nav__logo logo">
      <NuxtImg
        alt="Логотип"
        :placeholder="[5]"
        src="/assets/img/logo.png"
        loading="eager"
        format="png"
        quality="100"
      />
    </div>

    <div class="nav__burger burger" @click="toggleMenu">
      <span class="burger__line"></span>
      <span class="burger__line"></span>
      <span class="burger__line"></span>
    </div>

    <!-- Меню -->
    <div v-if="isMenuVisible" class="nav__menu menu">
      <ul class="menu__list">
        <li class="menu__item">
          <a href="/" class="menu__link">Главное</a>
        </li>
        <li class="menu__item">
          <a href="#" class="menu__link">Мой плейлист</a>
        </li>
        <li class="menu__item">
          <a href="/SignIn" class="menu__link">Войти</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { NuxtImg } from "#components";
import { ref } from "vue";

const isMenuVisible = ref(false);

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};
</script>

<style lang="scss" scoped>
.main__nav {
  width: 244px;
  background-color: #181818;
  padding: 20px;
}

.nav__logo {
  width: 113.33px;
  margin-bottom: 20px;
}

.nav__burger {
  width: 20px;
  height: 36px;
  padding: 13px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.burger__line {
  height: 1px;
  background-color: #d3d3d3;
}

.nav__menu {
  padding: 20px;
}

.logo__image {
  width: 113.33px;
  height: 17px;
}

.menu__list {
  padding: 18px 0 10px 0;
}

.menu__item {
  padding: 5px 0;
  margin-bottom: 16px;
}

.menu__link {
  color: #ffffff;
  font-size: 16px;
  line-height: 24px;
}
</style>
