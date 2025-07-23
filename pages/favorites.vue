<template>
  <NuxtLayout name="default">
    <h2 class="centerblock__h2">Избранное</h2>

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
const tracksStore = useTracksStore()

// Загружаем треки при монтировании компонента
onMounted(() => {
  if (tracksStore.rawTracks.length === 0) {
    tracksStore.fetchTracks()
  }
})
</script>

<style lang="scss" scoped></style>
