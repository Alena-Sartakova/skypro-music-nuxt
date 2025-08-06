<template>
  
    <div class="content-wrapper">
      <h2 class="centerblock__h2">Треки</h2>
      
      <FilterControlsComponent />
      
      <div class="tracks-scroll-container">
        <PlaylistComponent
          :tracks="tracksStore.filteredTracks"
          :pending="tracksStore.pending"
          :error="tracksStore.error"
        />
      </div>
    </div>
  
</template>

<script setup>
import { useTracksStore } from '~/stores/useTracks';
import { usePlayerStore } from "~/stores/player";
import { useUserStore } from "~/stores/useUser"; // Добавляем импорт хранилища

const tracksStore = useTracksStore();
const playerStore = usePlayerStore();
const userStore = useUserStore(); // Инициализируем хранилище пользователя

onMounted(async () => {
  // Проверяем авторизацию пользователя
  if (userStore.isAuthenticated) {
    console.log('Данные авторизованного пользователя:', {
      email: userStore.user?.email,
      username: userStore.user?.username,
      id: userStore.user?.id
    });
  }

  if (tracksStore.rawTracks.length === 0) {
    await tracksStore.fetchTracks();
  }
  
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
