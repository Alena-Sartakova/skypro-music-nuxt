<template>
  <NuxtLayout name="default">
    <h2 class="centerblock__h2">{{ playlistTitle }}</h2>

    <div v-if="error" class="error">
      Ошибка: {{ error }}
    </div>

    <PlaylistComponent
      v-else
      :tracks="filteredTracks"
      :pending="pending"
    />
  </NuxtLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useHead } from '@unhead/vue'

const route = useRoute()
const tracksStore = useTracksStore()

const { pending, error, filteredTracks } = storeToRefs(tracksStore)

const playlistMap = {
  day: 'Плейлист дня',
  dance: '100 танцевальных хитов',
  indie: 'Инди-заряд'
}

const playlistTitle = computed(() => 
  playlistMap[route.params.id] || 'Все треки'
)

// Обновление заголовка страницы
watch(
  playlistTitle,
  (newTitle) => {
    useHead({
      title: `${newTitle || "Skypro.Music"} | Skypro.Music`
    })
  },
  { immediate: true }
)

// Загрузка данных при монтировании
onMounted(() => tracksStore.fetchTracks(route.params.id))

// Обновление данных при изменении параметра
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await tracksStore.fetchTracks(newId)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.error {
  color: #ff4444;
  padding: 20px;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  margin: 20px;
}
</style>
