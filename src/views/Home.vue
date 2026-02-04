<template>
  <div class="home-page">
    <!-- 背景特效 -->
    <grid-background />
    <particle-background />
    <!-- 导航栏 -->
    <navbar />

    <!-- 搜索弹窗 -->
    <search-modal />

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- Hero 区域 -->
      <hero-section />

      <!-- 关于区域 -->
      <about-section />

      <!-- 文章区域 -->
      <article-grid />
    </main>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-left">
            <p class="copyright">
              © 2026 Coder Wang. Built with
              <el-icon class="heart-icon"><StarFilled /></el-icon>
              Vue 3
            </p>
          </div>
          <div class="footer-right">
            <a
              v-for="(link, platform) in user?.social"
              :key="platform"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
              :class="`footer-social-${platform}`"
            >
              <github-icon v-if="platform === 'github'" class="footer-github-icon" />
              <juejin-icon v-else-if="platform === 'juejin'" class="footer-juejin-icon" />
              <el-icon v-else>
                <component :is="getSocialIcon(platform)" />
              </el-icon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import GridBackground from '@/components/common/GridBackground.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import Navbar from '@/components/layout/Navbar.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ArticleGrid from '@/components/sections/ArticleGrid.vue'
import SearchModal from '@/components/sections/SearchModal.vue'
import { useUserStore } from '@/stores/user'
import { useArticleStore } from '@/stores/article'
import { useAppStore } from '@/stores/app'
import JuejinIcon from '@/components/icons/JuejinIcon.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'

const userStore = useUserStore()
const articleStore = useArticleStore()
const appStore = useAppStore()
const user = computed(() => userStore.user)

const getSocialIcon = (platform: string) => {
  const icons: Record<string, string> = {
    github: 'github',
    email: 'message'
  }
  return icons[platform] || 'link'
}

let observer: IntersectionObserver | null = null

// 使用 IntersectionObserver 检测当前可见的 section
const initObserver = () => {
  const sectionIds = ['home', 'about', 'articles']
  const sections: HTMLElement[] = []

  // 获取所有 section 元素
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el) sections.push(el)
  }

  if (sections.length === 0) return

  // 使用中心线检测策略
  // rootMargin 把检测区域设为 viewport 中间的一条线
  observer = new IntersectionObserver(
    (entries) => {
      if (appStore.isScrolling) return

      // 找出当前最应该激活的 section
      // 策略：哪个 section 占据了 viewport 的中心区域
      let activeId = ''
      let maxCenterOverlap = -Infinity

      const viewportCenter = window.innerHeight / 2
      const navHeight = 80
      const effectiveCenter = viewportCenter + navHeight / 2

      for (const entry of entries) {
        if (!entry.isIntersecting) continue

        const rect = entry.boundingClientRect
        const sectionCenter = rect.top + rect.height / 2

        // 计算 section 中心到 viewport 中心的距离（负值表示在中心上方）
        const distanceToCenter = Math.abs(sectionCenter - effectiveCenter)

        // 距离中心越近，优先级越高
        const priority = -distanceToCenter

        if (priority > maxCenterOverlap) {
          maxCenterOverlap = priority
          activeId = entry.target.id
        }
      }

      if (activeId) {
        appStore.setActiveSection(activeId)
      }
    },
    {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    }
  )

  // 观察所有 section
  sections.forEach(el => observer?.observe(el))
}

onMounted(() => {
  // 初始化 IntersectionObserver
  initObserver()

  // 加载文章数据
  articleStore.fetchArticles()
  articleStore.fetchTags()
  articleStore.fetchArchives()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  position: relative;
}

.main-content {
  position: relative;
  z-index: 10;
}

.site-footer {
  padding: 32px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 10;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
}

.copyright {
  font-size: 14px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;

  .heart-icon {
    color: #FF71CE;
    margin: 0 4px;
    animation: heartbeat 1.5s ease-in-out infinite;
  }
}

.footer-right {
  display: flex;
  gap: 16px;
}

.footer-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--text-muted);
  transition: all 0.3s ease;

  .footer-juejin-icon,
  .footer-github-icon {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: var(--neon-cyan);
    background: var(--neon-cyan-glow);
  }

  &.footer-social-juejin:hover {
    color: #1E80FF;
    background: rgba(30, 128, 255, 0.1);
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
