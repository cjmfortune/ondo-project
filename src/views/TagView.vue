<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageModal from '@/components/ImageModal.vue'

interface TagInfo {
  id: number
  tagName: string
  createDateTime: string
}

interface WorkItem {
  id: number
  imageURL: string
  fileName: string
  createDateTime: string
  projectName: string | null
  description: string | null
  index: number
  tags: TagInfo[]
  show: boolean
  basic: boolean
}

const route = useRoute()
const router = useRouter()
const items = ref<WorkItem[]>([])
const loading = ref(false)
const currentTag = ref<string>('')
const baseImagePath = 'https://backend.ondo-project.com'

// 모달 관련 상태
const isModalOpen = ref(false)
const currentImageIndex = ref(0)

const fetchImagesByTag = async (tagName: string): Promise<WorkItem[]> => {
  try {
    const res = await fetch('https://backend.ondo-project.com/images')
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    
    // 특정 태그를 가진 이미지만 필터링
    return data
      .filter((item: any) => 
        item.show === true && 
        item.tags && 
        item.tags.some((tag: any) => tag.tagName.toLowerCase() === tagName.toLowerCase())
      )
      .sort((a: any, b: any) => a.index - b.index)
      .map((item: any) => ({
        id: item.id,
        imageURL: baseImagePath + item.imageURL,
        fileName: item.fileName,
        createDateTime: item.createDateTime,
        projectName: item.projectName || 'Untitled Project',
        description: item.description,
        index: item.index,
        tags: item.tags || [],
        show: item.show,
        basic: item.basic
      }))
  } catch (error) {
    console.error('Failed to fetch images by tag:', error)
    return []
  }
}

const loadImagesByTag = async (tagName: string) => {
  if (loading.value) return
  loading.value = true
  currentTag.value = tagName
  
  try {
    const tagImages = await fetchImagesByTag(tagName)
    items.value = tagImages
  } catch (error) {
    console.error('Error loading images by tag:', error)
  } finally {
    loading.value = false
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder.jpg'
}

const goBack = () => {
  router.push('/work')
}

const goToTag = (tagName: string) => {
  if (tagName !== currentTag.value) {
    router.push(`/tag/${encodeURIComponent(tagName)}`)
  }
}

const openImageModal = (index: number) => {
  currentImageIndex.value = index
  isModalOpen.value = true
}

const closeImageModal = () => {
  isModalOpen.value = false
}

const handleModalTagClick = (tagName: string) => {
  closeImageModal()
  goToTag(tagName)
}

// 라우트 파라미터 변경 감지
watch(() => route.params.tagName, (newTagName) => {
  if (newTagName && typeof newTagName === 'string') {
    loadImagesByTag(decodeURIComponent(newTagName))
  }
}, { immediate: true })

onMounted(() => {
  const tagName = route.params.tagName
  if (tagName && typeof tagName === 'string') {
    loadImagesByTag(decodeURIComponent(tagName))
  }
})
</script>

<template>
  <div class="tag-container">
    <!-- 헤더 -->
    <div class="header">

      <h1 class="tag-title">
        <span class="tag-label">#{{ currentTag }}</span>
        <span class="count" v-if="!loading">({{ items.length }} images)</span>
      </h1>
    </div>

    <!-- 이미지 그리드 -->
    <div class="grid-container">
      <div v-for="(item, index) in items" :key="item.id" class="card">
        <div class="image-wrapper" @click="openImageModal(index)">
          <img 
            :src="item.imageURL" 
            :alt="item.projectName || 'Project Image'"
            @error="handleImageError"
            loading="lazy"
          />
          <div class="overlay">
            <div v-if="item.tags && item.tags.length > 0" class="overlay-tags">
              <span 
                v-for="tag in item.tags" 
                :key="tag.id" 
                class="overlay-tag"
                @click.stop="goToTag(tag.tagName)"
              >
                {{ tag.tagName }}
              </span>
            </div>
          </div>
          <div v-if="item.basic" class="basic-badge">Featured</div>
        </div>
        <div class="title-overlay">
          <h3 class="image-title">{{ item.projectName || 'Untitled Project' }}</h3>
          <p v-if="item.description" class="image-description">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading images...</span>
    </div>

    <!-- 빈 상태 -->
    <div v-if="!loading && items.length === 0" class="empty-state">
      <h2>No images found for tag "{{ currentTag }}"</h2>
      <p>Try exploring other tags or go back to see all works.</p>
      <button @click="goBack" class="back-button-large">
        View All Works
      </button>
    </div>

    <!-- 이미지 모달 -->
    <ImageModal
      :is-open="isModalOpen"
      :images="items"
      :current-index="currentImageIndex"
      @close="closeImageModal"
      @update:current-index="currentImageIndex = $event"
      @tag-click="handleModalTagClick"
    />
  </div>
</template>

<style scoped>
.tag-container {
  min-height: 100vh;
  padding: 2rem;
  background: #f8f9fa;
}

.header {
  max-width: 1400px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  align-self: flex-start;
}

.back-button:hover {
  background: #5a67d8;
}

.tag-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.tag-label {
  color: #000;
}

.count {
  font-size: 1.2rem;
  font-weight: 400;
  color: #718096;
}

.grid-container {
  columns: 3;
  column-gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  cursor: pointer;
  margin-bottom: 2rem;
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.card:hover .image-wrapper img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.card:hover .overlay {
  opacity: 1;
}

.overlay-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.overlay-tag {
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.overlay-tag:hover {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

.basic-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  border-radius: 0 0 8px 8px;
}

.card:hover .title-overlay {
  opacity: 1;
  transform: translateY(0);
}

.image-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.image-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #718096;
  font-size: 1.1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

.empty-state h2 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.back-button-large {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-button-large:hover {
  background: #5a67d8;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .grid-container {
    columns: 3;
  }
}

@media (max-width: 768px) {
  .tag-container {
    padding: 1rem;
  }
  
  .header {
    margin-bottom: 2rem;
  }
  
  .tag-title {
    font-size: 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .grid-container {
    columns: 2;
    column-gap: 1.5rem;
  }
  
  .card {
    margin-bottom: 1.5rem;
  }
  
  .title-overlay {
    padding: 1.5rem 1rem 1rem;
  }
  
  .image-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .tag-container {
    padding: 0.5rem;
  }
  
  .tag-title {
    font-size: 1.5rem;
  }
  
  .grid-container {
    columns: 1;
    column-gap: 0;
  }
  
  .card {
    margin-bottom: 1rem;
  }
  
  .overlay-tags {
    padding: 0.5rem;
  }
  
  .overlay-tag {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
  
  .title-overlay {
    padding: 1rem 0.75rem 0.75rem;
  }
  
  .image-title {
    font-size: 1rem;
  }
  
  .image-description {
    font-size: 0.8rem;
  }
}
</style>
