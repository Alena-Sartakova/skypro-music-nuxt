
<template>
  <div>
    <NuxtLayout name="default">
    <IconSprite />
    <NuxtPage />
  </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import IconSprite from './components/IconSprite.vue';
import { useUserStore } from '~/stores/useUser'

const userStore = useUserStore()
onMounted(() => {
  userStore.restoreUser();
});



</script>