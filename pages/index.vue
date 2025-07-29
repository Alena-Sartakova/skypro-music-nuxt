<template>
  <NuxtLayout name="default">
    <h2 class="centerblock__h2">Треки</h2>
    
    <FilterControlsComponent />
    
    <PlaylistComponent
      :tracks="tracksStore.filteredTracks"
      :pending="tracksStore.pending"
      :error="tracksStore.error"
    />
  </NuxtLayout>
</template>

<script setup>
import { useTracksStore } from '~/stores/useTracks';
import { usePlayerStore } from "~/stores/player";

const tracksStore = useTracksStore()
const playerStore = usePlayerStore();

onMounted(async () => {
  if (tracksStore.rawTracks.length === 0) {
    await tracksStore.fetchTracks();
  }
  
  // Основная фикс: синхронизация плейлиста при загрузке
  if (playerStore.playlist.length === 0) {
    playerStore.setPlaylist(tracksStore.filteredTracks);
  }
});

useHead({
  title: "Главная | Skypro.Music",
  meta: [
    { name: "description", content: "Все треки на любой вкус" },
    { property: "og:title", content: "Skypro Music - Главная" }
  ]
})
</script>
<style></style>
