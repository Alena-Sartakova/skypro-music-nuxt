<template>
  <div class="content-wrapper">
    <h2 class="centerblock__h2">Избранное</h2>

    <FilterControlsComponent />

    <div v-if="tracksStore.error" class="error-message">
      {{ tracksStore.error }}
    </div>

    <div v-else-if="favoriteTracks.length === 0 && !tracksStore.pending">
      <p>В избранном пока нет треков</p>
    </div>

    <div class="tracks-scroll-container">
      <PlaylistComponent
        :tracks="favoriteTracks"
        :pending="tracksStore.pending"
        :error="tracksStore.error"
        :is-favorite-page="true"
        @toggle-favorite="
          (id, isFavorite) => tracksStore.toggleFavorite(id, isFavorite)
        "
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

const favoriteTracks = computed(() => tracksStore.favoriteTracks);

onMounted(async () => {
  try {
    // Проверка авторизации
    if (!userStore.isAuth) {
      console.warn("Пользователь не авторизован!");
      router.push("/signin");
      return;
    }

    /*     console.log("Данные пользователя:", {
      email: userStore.user.email,
      id: userStore.user.id,
      token: userStore.accessToken,
    }); */

    // Загрузка избранных треков
    await tracksStore.fetchFavoriteTracks();

    // Обновление плейлиста плеера
    if (playerStore.playlist.length === 0) {
      playerStore.setPlaylist(tracksStore.favoriteTracks);
    }
  } catch (error) {
    console.error("Ошибка загрузки избранного:", error);
    if (error?.response?.status === 401) {
      userStore.clearUser();
      router.push("/signin");
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

<style lang="scss" scoped>
.content-wrapper {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  .centerblock__h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  .error-message {
    color: #ff4d4d;
    padding: 15px;
    background: #2a2a2a;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #ff4d4d;
  }

  .tracks-scroll-container {
    max-height: 70vh;
    padding-right: 10px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
  }
}
</style>
