<template>
  <NuxtLayout name="default">

        
          


            <h2 class="centerblock__h2">Треки</h2>
            <FilterControlsComponent :tracks="validTracks" />

            <PlaylistComponent
              :tracks="validTracks"
              :pending="pending"
              :error="error"
            />
  

          

        


  </NuxtLayout>
</template>
<script setup>

import PlaylistComponent from "~/components/PlaylistComponent.vue";
import FilterControlsComponent from "~/components/FilterControlsComponent.vue";
import { computed } from "vue";

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
const {
  data: response,
  pending,
  error,
} = await useFetch(
  "https://webdev-music-003b5b991590.herokuapp.com/catalog/track/all/",
  {
    transform: (responseData) => {
      /* console.log('Исходные данные трека:', responseData.data[0]); // Выведем трек для анализа */
      return responseData.data
        .map((track) => ({
          id: track._id,
          title: track.name || "Без названия",
          author: track.author || "Неизвестный исполнитель",
          album: track.album || "Без альбома",
          duration: formatDuration(track.duration_in_seconds),
          release_date: track.release_date || "Неизвестно",
          genre: track.genre || "Неизвестно",
          track_file: track.track_file || "",
        }))
        .filter((track) => track.title !== "Без названия");
    },
  }
);

const validTracks = computed(() => response.value || []);
</script>
<style></style>
