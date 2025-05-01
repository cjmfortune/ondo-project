<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface WorkItem {
  imageURL: string
  title: string
}

const items = ref<WorkItem[]>([])
const page = ref(1)
const loading = ref(false)

const mockFetch = (page: number): Promise<WorkItem[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newItems = Array.from({ length: 9 }, (_, i) => {
        const width = Math.floor(Math.random() * 150) +100 // 250~350
        const height = Math.floor(Math.random() * 150) + 100  // 180~280
        return {
          title: `Item ${(page - 1) * 9 + i + 1}`,
          imageURL: `https://picsum.photos/${width}/${height}?random=${Math.random()}`
        }
      })
      resolve(newItems)
    }, 1000)
  })
}


const loadMore = async () => {
  if (loading.value) return
  loading.value = true
  const newItems = await mockFetch(page.value)
  items.value.push(...newItems)
  page.value++
  loading.value = false
}

const onScroll = () => {
  const scrollContainer = document.documentElement
  if (
      scrollContainer.scrollTop + window.innerHeight >=
      scrollContainer.scrollHeight - 100
  ) {
    loadMore()
  }
}

onMounted(() => {
  loadMore()
  window.addEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="grid-container">
    <div v-for="(item, index) in items" :key="index" class="card">
      <div class="image-wrapper">
        <img :src="item.imageURL" :alt="item.title" />
        <div class="overlay">
          <span class="overlay-text">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="loading" class="loading">Loading...</div>
</template>

<style scoped>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem;
}


.card {
  width: calc(33.333% - 1rem);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  padding: 1rem;
  box-sizing: border-box;
}

.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.overlay-text {
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

.card:hover .overlay {
  opacity: 1;
}
</style>

