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
import { useTracksStore } from '~/stores/useTracks'

const tracksStore = useTracksStore()

onMounted(() => {
  if (tracksStore.rawTracks.length === 0) {
    tracksStore.fetchTracks()
  }
})

useHead({
  title: "Главная | Skypro.Music",
  meta: [
    { name: "description", content: "Все треки на любой вкус" },
    { property: "og:title", content: "Skypro Music - Главная" }
  ]
})
</script>
<style></style>
