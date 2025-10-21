<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

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

interface Props {
  isOpen: boolean
  images: WorkItem[]
  currentIndex: number
}

interface Emits {
  (e: 'close'): void
  (e: 'update:currentIndex', index: number): void
  (e: 'tagClick', tagName: string): void
  (e: 'projectClick', projectName: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const imageRef = ref<HTMLImageElement>()
const isImageLoading = ref(false)

const currentImage = computed(() => {
  return props.images[props.currentIndex] || null
})

const canGoPrev = computed(() => props.currentIndex > 0)
const canGoNext = computed(() => props.currentIndex < props.images.length - 1)

const goToPrev = () => {
  if (canGoPrev.value) {
    emit('update:currentIndex', props.currentIndex - 1)
  }
}

const goToNext = () => {
  if (canGoNext.value) {
    emit('update:currentIndex', props.currentIndex + 1)
  }
}

const closeModal = () => {
  emit('close')
}

const handleTagClick = (tagName: string) => {
  emit('tagClick', tagName)
}

const handleProjectClick = (projectName: string) => {
  emit('projectClick', projectName)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return
  
  switch (event.key) {
    case 'Escape':
      closeModal()
      break
    case 'ArrowLeft':
      goToPrev()
      break
    case 'ArrowRight':
      goToNext()
      break
  }
}

const handleImageLoad = () => {
  isImageLoading.value = false
}

const handleImageError = () => {
  isImageLoading.value = false
}

// 이미지 변경 시 로딩 상태 설정
watch(() => props.currentIndex, () => {
  if (props.isOpen) {
    isImageLoading.value = true
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 모달이 열릴 때 body 스크롤 방지
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    isImageLoading.value = true
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <!-- 닫기 버튼 -->
        <button class="close-button" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- 이전 버튼 -->
        <button 
          v-if="canGoPrev" 
          class="nav-button prev-button" 
          @click="goToPrev"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <!-- 다음 버튼 -->
        <button 
          v-if="canGoNext" 
          class="nav-button next-button" 
          @click="goToNext"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>

        <!-- 이미지 컨테이너 -->
        <div class="image-container">
          <div v-if="isImageLoading" class="loading-spinner"></div>
          <img 
            v-if="currentImage"
            ref="imageRef"
            :src="currentImage.imageURL" 
            :alt="currentImage.projectName || 'Project Image'"
            class="modal-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>

        <!-- 이미지 정보 -->
        <div v-if="currentImage" class="image-info">
          <div class="image-header">
            <h2 class="image-title" @click="handleProjectClick(currentImage.projectName || 'Untitled Project')">
              {{ currentImage.projectName || 'Untitled Project' }}
            </h2>
            <div class="image-counter">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          </div>
          
          <p v-if="currentImage.description" class="image-description">
            {{ currentImage.description }}
          </p>

          <div v-if="currentImage.tags && currentImage.tags.length > 0" class="tags-container">
            <span 
              v-for="tag in currentImage.tags" 
              :key="tag.id" 
              class="tag"
              @click="handleTagClick(tag.tagName)"
            >
              {{ tag.tagName }}
            </span>
          </div>

          <div v-if="currentImage.basic" class="featured-badge">
            Featured
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.nav-button {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.prev-button {
  left: 2rem;
}

.next-button {
  right: 2rem;
}

.image-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #f8f9fa;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.image-info {
  padding: 2rem;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.image-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.image-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  flex: 1;
  cursor: pointer;
  transition: color 0.3s ease;
}

.image-title:hover {
  color: #667eea;
}

.image-counter {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 1rem;
}

.image-description {
  color: #718096;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.featured-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-container {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .close-button {
    top: 0.5rem;
    right: 0.5rem;
    width: 35px;
    height: 35px;
  }
  
  .nav-button {
    width: 50px;
    height: 50px;
  }
  
  .prev-button {
    left: 1rem;
  }
  
  .next-button {
    right: 1rem;
  }
  
  .modal-image {
    max-height: 60vh;
  }
  
  .image-info {
    padding: 1.5rem;
  }
  
  .image-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .image-counter {
    margin-left: 0;
    align-self: flex-start;
  }
  
  .image-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .nav-button {
    width: 45px;
    height: 45px;
  }
  
  .prev-button {
    left: 0.5rem;
  }
  
  .next-button {
    right: 0.5rem;
  }
  
  .image-info {
    padding: 1rem;
  }
  
  .image-title {
    font-size: 1.1rem;
  }
  
  .image-description {
    font-size: 0.9rem;
  }
}
</style>
