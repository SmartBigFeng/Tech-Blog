<template>
  <div class="app">
    <!-- Toast 提示 - 全局 -->
    <Toaster position="top-center" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useVisitor } from '@/composables/useVisitor'
import { useVisitorStore } from '@/stores/visitor'
import { Toaster } from '@/components/ui/sonner'

const { visitorId, isReady } = useVisitor()
const visitorStore = useVisitorStore()

// 当访客 ID 准备好后，同步到 store
watch(visitorId, (id) => {
  if (id) {
    visitorStore.setVisitorId(id)
  }
}, { immediate: true })

onMounted(() => {
  console.log('Visitor ID:', visitorStore.visitorId)
})
</script>

<style>
/* Element Plus 暗色主题覆盖 */
:root {
  --el-bg-color: var(--bg-secondary);
  --el-bg-color-overlay: var(--bg-tertiary);
  --el-text-color-primary: var(--text-primary);
  --el-text-color-regular: var(--text-secondary);
  --el-text-color-secondary: var(--text-muted);
  --el-border-color: var(--border-color);
  --el-fill-color: var(--bg-tertiary);
  --el-fill-color-light: rgba(255, 255, 255, 0.05);
  --el-fill-color-blank: transparent;
}

.el-skeleton {
  --el-skeleton-color: rgba(255, 255, 255, 0.1);
  --el-skeleton-to-color: rgba(255, 255, 255, 0.2);
}
</style>
