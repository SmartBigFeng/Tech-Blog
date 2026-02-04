import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarCollapsed = ref(false)
  const searchModalVisible = ref(false)
  const activeSection = ref('home')
  const isScrolling = ref(false)
  let scrollTimeout: number | null = null

  // Getters
  const isMobile = computed(() => window.innerWidth < 768)

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const openSearchModal = () => {
    searchModalVisible.value = true
  }

  const closeSearchModal = () => {
    searchModalVisible.value = false
  }

  const setActiveSection = (section: string) => {
    // 如果正在手动滚动中，不通过 Observer 更新 activeSection
    if (isScrolling.value) return
    activeSection.value = section
  }

  // 手动设置 activeSection（用于点击导航时）
  const setActiveSectionForce = (section: string) => {
    activeSection.value = section
  }

  // 滚动到指定 section
  const scrollToSection = (sectionId: string, callback?: () => void) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    // 标记正在滚动，暂停 Observer 更新
    isScrolling.value = true
    activeSection.value = sectionId

    // 动态获取导航栏高度（移动端和桌面端可能不同）
    const navbar = document.querySelector('.navbar')
    const navHeight = navbar ? navbar.getBoundingClientRect().height : 80

    // 获取 section 的上内边距，确保滚动到内容区域而非 padding 边缘
    const computedStyle = window.getComputedStyle(element)
    const paddingTop = parseInt(computedStyle.paddingTop) || 0

    const rect = element.getBoundingClientRect()
    // 移动端使用更小的偏移量，因为 section 高度是自适应的
    const isMobile = window.innerWidth <= 768
    const offset = isMobile ? navHeight + 20 : navHeight + (paddingTop > 0 ? paddingTop / 2 : 0)
    const scrollTop = window.pageYOffset + rect.top - offset

    window.scrollTo({ top: scrollTop, behavior: 'smooth' })

    // 清除之前的 timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // 滚动动画大约 500ms 后恢复 Observer
    scrollTimeout = window.setTimeout(() => {
      isScrolling.value = false
      callback?.()
    }, 600)
  }

  return {
    sidebarCollapsed,
    searchModalVisible,
    activeSection,
    isScrolling,
    isMobile,
    toggleSidebar,
    openSearchModal,
    closeSearchModal,
    setActiveSection,
    setActiveSectionForce,
    scrollToSection
  }
})
