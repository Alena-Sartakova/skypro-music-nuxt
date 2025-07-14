<template>
  <nav class="main__nav nav">
    <div class="nav__logo logo">
      <img class="logo__image" src="/assets/img/logo.png">
    </div>
    <div 
      class="nav__burger burger"
      @click="toggleMenu"
    >
      <span class="burger__line"></span>
      <span class="burger__line"></span>
      <span class="burger__line"></span>
    </div>
    <div 
      class="nav__menu menu"
      :class="{ 'menu--visible': isMenuVisible }"
    >
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
import { ref } from 'vue'

//Меню
const isMenuVisible = ref(false)

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}
</script>

<style lang="scss" scoped>
.main__nav {
  width: 244px;
  flex: 0 0 auto;
  background-color: #181818;
  padding: 20px;
}

.nav__logo {
  width: 113.33px;
  height: 43px;
  padding: 13px 0 13px 0;
  background-color: transparent;
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

.nav__menu {
  display: none;
  background-color: #181818;
  padding: 20px;
  
  &.menu--visible {
    display: block;
  }
}

.logo__image {
  width: 113.33px;
  height: 17px;
  color: #181818;
}

.burger__line {
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: #d3d3d3;
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
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
