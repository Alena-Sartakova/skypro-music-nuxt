<template>
  <NuxtLayout name="default">
    <h2 class="centerblock__h2">Треки</h2>
    <FilterControlsComponent
      :filters="tracksStore.filters"
      @update-filter="tracksStore.updateFilter"
    />

    <PlaylistComponent
      :tracks="tracksStore.validTracks"
      :pending="tracksStore.pending"
      :error="tracksStore.error"
    />
  </NuxtLayout>
</template>

<script setup>
import PlaylistComponent from "~/components/PlaylistComponent.vue";
import FilterControlsComponent from "~/components/FilterControlsComponent.vue";
import { useTracksStore } from "~/stores/useTracks";

const tracksStore = useTracksStore();

useHead({
  title: "Избранное | Skypro.Music",
  meta: [
    { name: "description", content: "Ваши любимые треки в одном месте" },
    { property: "og:title", content: "Избранное | Skypro Music" },
    { property: "og:site_name", content: "Skypro Music" },
    { name: "twitter:title", content: "Skypro Music — Избранное" },
  ],
});

// Загружаем треки при монтировании компонента
onMounted(() => {
  if (tracksStore.rawTracks.length === 0) {
    tracksStore.fetchTracks();
  }
});
</script>
<style></style>
