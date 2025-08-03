<template>
  <div class="wrapper">
    <template v-if="showMainLayout">
      <div class="container">
        <div class="main">
          <NavbarComponent />
          <div class="main__centerblock">
            <SearchComponent />
            <div class="content-container">
              <slot></slot>
            </div>
          </div>
          <MainSideBarComponent />
        </div>
        <PlayerBarComponent />
      </div>
      <footer class="footer"></footer>
    </template>
    <div v-else class="auth-layout">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import MainSideBarComponent from "~/components/MainSideBarComponent.vue";
import NavbarComponent from "~/components/NavbarComponent.vue";
import PlayerBarComponent from "~/components/PlayerBarComponent.vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const excludedRoutes = ['/signin']
const showMainLayout = computed(() => !excludedRoutes.includes(route.path))
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
