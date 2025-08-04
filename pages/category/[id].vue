<template>
  <div class="content-wrapper">
    <h2 class="centerblock__h2">{{ playlistTitle }}</h2>

    <div v-if="error" class="error">Ошибка: {{ error }}</div>

    <PlaylistComponent
      :tracks="tracksStore.filteredTracks"
      :pending="tracksStore.pending"
      :error="tracksStore.error"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

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
