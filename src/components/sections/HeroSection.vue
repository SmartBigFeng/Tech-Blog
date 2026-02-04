<template>
  <section id="home" class="hero-section">
    <div class="container">
      <div class="hero-content">
        <!-- 头像区域 -->
        <div class="avatar-wrapper" ref="avatarRef">
          <div class="avatar-ring ring-1"></div>
          <div class="avatar-ring ring-2"></div>
          <div class="avatar-ring ring-3"></div>
          <div class="avatar-glow"></div>
          <img :src="user?.avatar" alt="Avatar" class="avatar" />
        </div>

        <!-- 打字机名称 -->
        <div class="hero-text">
          <h1 class="hero-name">
            <typewriter-text
              :texts="[user?.name || 'Coder Wang']"
              :speed="100"
              :pause-time="3000"
              :loop="true"
            />
          </h1>
          <p class="hero-role">
            <neon-text color="gradient">{{ user?.role }}</neon-text>
          </p>
          <p class="hero-bio">{{ user?.bio }}</p>
        </div>

        <!-- 社交链接 -->
        <dock :magnification="60" :distance="140" direction="middle">
          <!-- 微信 -->
          <dock-icon>
            <div class="social-link social-wechat" @click="showWechat">
              <el-icon size="24"><ChatDotRound /></el-icon>
            </div>
          </dock-icon>
          <dock-icon v-for="(link, platform) in user?.social" :key="platform">
            <a
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              :class="`social-${platform}`"
            >
              <github-icon v-if="platform === 'github'" class="social-icon" />
              <juejin-icon v-else-if="platform === 'juejin'" class="juejin-svg" />
              <el-icon v-else size="24">
                <component :is="getSocialIcon(platform)" />
              </el-icon>
            </a>
          </dock-icon>
        </dock>

        <!-- 统计数据 -->
        <div class="stats-grid" ref="statsRef">
          <div
            v-for="(value, key) in user?.stats"
            :key="key"
            class="stat-item"
            :class="{ 'is-visible': statsVisible }"
          >
            <div class="stat-value">
              <count-up
                :value="value"
                :duration="2000"
                :start-on-mount="statsVisible"
              />
            </div>
            <div class="stat-label">{{ getStatLabel(key) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动指示器 -->
    <div class="scroll-indicator" @click="scrollToAbout">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <p class="scroll-text">向下滚动</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useScrollReveal } from '@/composables/useScrollReveal'
import TypewriterText from '@/components/common/TypewriterText.vue'
import NeonText from '@/components/common/NeonText.vue'
import CountUp from '@/components/common/CountUp.vue'
import JuejinIcon from '@/components/icons/JuejinIcon.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import Dock from '@/components/ui/dock/Dock.vue'
import DockIcon from '@/components/ui/dock/DockIcon.vue'
import { toast } from 'vue-sonner'

const userStore = useUserStore()
const appStore = useAppStore()
const user = computed(() => userStore.user)

const statsRef = ref<HTMLElement | null>(null)
const { elementRef: avatarRef, isVisible: avatarVisible } = useScrollReveal()

const statsVisible = ref(true)

const getSocialIcon = (platform: string) => {
  const icons: Record<string, string> = {
    github: 'Github',
    email: 'Message'
  }
  return icons[platform] || 'Link'
}

const getStatLabel = (key: string) => {
  const labels: Record<string, string> = {
    articles: '文章',
    views: '浏览',
    likes: '点赞',
    comments: '评论'
  }
  return labels[key] || key
}

const scrollToAbout = () => {
  appStore.scrollToSection('about')
}

const showWechat = () => {
  toast.info('微信号：coder_wang', {
    description: '点击复制或扫码添加',
    duration: 5000,
  })
}

// 重置并重新触发动画
const resetAndTriggerAnimation = () => {
  // 重置可见性状态
  statsVisible.value = false

  nextTick(() => {
    // 检查元素是否在视口中
    if (statsRef.value) {
      const rect = statsRef.value.getBoundingClientRect()
      const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0

      if (isInViewport) {
        // 延迟触发，确保DOM更新完成
        setTimeout(() => {
          statsVisible.value = true
        }, 50)
      }
    }
  })
}

// 监听user.stats变化，当数据加载或变化时重新触发动画
watch(() => user.value?.stats, (newStats) => {
  if (newStats) {
    resetAndTriggerAnimation()
  }
}, { immediate: true })

onMounted(() => {
  userStore.fetchUser()

  // 立即检查stats元素是否已经在视口中
  if (statsRef.value) {
    const rect = statsRef.value.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0
    if (isVisible) {
      // 使用setTimeout确保在下一帧触发，使CountUp组件能正确响应
      setTimeout(() => {
        statsVisible.value = true
      }, 100)
    }

    // 监听统计数据区域
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsVisible.value) {
            statsVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(statsRef.value)
  }
})
</script>

<style scoped lang="scss">
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 32px;
}

.avatar-wrapper {
  position: relative;
  width: 180px;
  height: 180px;

  &:hover {
    .avatar-ring {
      animation-play-state: paused;
    }
  }
}

.avatar-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;

  &.ring-1 {
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-top-color: var(--neon-cyan);
    border-right-color: var(--neon-cyan-glow);
    animation: rotate 4s linear infinite;
  }

  &.ring-2 {
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border-bottom-color: var(--neon-purple);
    border-left-color: var(--neon-purple-glow);
    animation: rotateReverse 6s linear infinite;
  }

  &.ring-3 {
    top: -30px;
    left: -30px;
    right: -30px;
    bottom: -30px;
    border: 1px dashed var(--neon-pink-glow);
    animation: rotate 8s linear infinite;
  }
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle, var(--neon-cyan-glow) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border-color);
}

.hero-text {
  max-width: 600px;
}

.hero-name {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
  font-family: var(--font-mono);

  @media (max-width: 768px) {
    font-size: 36px;
  }
}

.hero-role {
  font-size: 24px;
  margin-bottom: 16px;
}

.hero-bio {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.8;
  white-space: pre-line;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  cursor: pointer;

  .juejin-svg,
  .social-icon {
    width: 24px;
    height: 24px;
  }

  &.social-wechat:hover {
    color: #07C160;
  }

  &.social-github:hover {
    color: var(--text-primary);
  }

  &.social-juejin:hover {
    color: #1E80FF;
  }

  &.social-email:hover {
    color: var(--neon-cyan);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

.stat-item {
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        transition-delay: #{$i * 0.1}s;
      }
    }
  }
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  text-shadow: var(--shadow-glow-cyan);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  animation: float 2s ease-in-out infinite;

  .mouse {
    width: 24px;
    height: 40px;
    border: 2px solid var(--text-secondary);
    border-radius: 12px;
    position: relative;

    .wheel {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 8px;
      background: var(--text-secondary);
      border-radius: 2px;
      animation: wheel 1.5s ease-in-out infinite;
    }
  }

  .scroll-text {
    font-size: 12px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotateReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes wheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}
</style>
