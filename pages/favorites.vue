<template>
  <div class="content-wrapper">
    <h2 class="centerblock__h2">Избранное</h2>

    <FilterControlsComponent />
    
    <div v-if="tracksStore.error" class="error-message">
      {{ tracksStore.error }}
    </div>
    
    <div v-else-if="tracksStore.rawTracks.length === 0 && !tracksStore.pending">
      <p>В избранном пока нет треков</p>
    </div>

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
import { useTracksStore } from "~/stores/useTracks";
import { usePlayerStore } from "~/stores/player";
import { useUserStore } from "~/stores/useUser";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tracksStore = useTracksStore();
const playerStore = usePlayerStore();
const userStore = useUserStore();

onMounted(async () => {
  try {
    // Проверка авторизации
    if (!userStore.isAuth) {
      console.warn("Пользователь не авторизован!");
      router.push("/signin");
      return;
    }

    console.log("Данные пользователя:", {
      email: userStore.user.email,
      id: userStore.user.id,
      token: userStore.accessToken,
    });

    // Загрузка избранных треков
    await tracksStore.fetchFavoriteTracks();

    // Обновление плейлиста плеера
    if (playerStore.playlist.length === 0) {
      playerStore.setPlaylist(tracksStore.filteredTracks);
    }
  } catch (error) {
    console.error("Ошибка загрузки избранного:", error);
    if (error?.response?.status === 401) {
      userStore.clearUser();
      router.push('/signin');
    }
  }
});

useHead({
  title: "Избранное | Skypro.Music",
  meta: [
    { name: "description", content: "Ваши избранные треки" },
    { property: "og:title", content: "Skypro Music - Избранное" },
  ],
});
</script>

<style lang="scss" scoped></style>
