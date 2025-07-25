<template>
<div class="wrapper">
    <div class="container">
      <div class="main">
        <NavbarComponent/>
          <div class="main__centerblock">
            <SearchComponent />
            <slot></slot>
          </div>
        <MainSideBarComponent />
        </div>
      <PlayerBarComponent />
    </div>
    <footer class="footer"></footer>
  </div>
</template>

<script setup>
import MainSideBarComponent from '~/components/MainSideBarComponent.vue';
import NavbarComponent from '~/components/NavbarComponent.vue';
import PlayerBarComponent from '~/components/PlayerBarComponent.vue';


</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  background-color: #383838;
  font-family: "Roboto", sans-serif;
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
</style>