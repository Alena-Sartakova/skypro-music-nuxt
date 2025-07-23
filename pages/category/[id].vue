<template>
  <NuxtLayout name="default">
    <h2 class="centerblock__h2">{{ playlistTitle }}</h2>

    <div v-if="error" class="error">Ошибка: {{ error }}</div>

    <PlaylistComponent
      v-else
      :tracks="tracksStore.validTracks"
      :pending="tracksStore.pending"
      :error="tracksStore.error"
    />
  </NuxtLayout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";

const route = useRoute();
const tracksStore = useTracksStore();

const { error } = storeToRefs(tracksStore);

const playlistMap = {
  day: "Плейлист дня",
  dance: "100 танцевальных хитов",
  indie: "Инди-заряд",
};

const playlistTitle = computed(
  () => playlistMap[route.params.id] || "Все треки"
);

// Обновление заголовка страницы
watch(
  playlistTitle,
  (newTitle) => {
    useHead({
      title: `${newTitle || "Skypro.Music"} | Skypro.Music`,
    });
  },
  { immediate: true }
);

// Инициализация загрузки данных
onMounted(() => {
  if (!tracksStore.allTracks) {
    tracksStore.fetchTracks();
  }
});
</script>

<style scoped></style>
