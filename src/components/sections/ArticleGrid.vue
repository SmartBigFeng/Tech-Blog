<template>
  <section id="articles" class="articles-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-number">03.</span>
          文章列表
        </h2>
        <p class="section-subtitle">探索技术的无限可能</p>
      </div>

      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else class="articles-grid">
        <context-menu v-for="(article, index) in articles" :key="article.id">
          <context-menu-trigger as-child>
            <glass-card
              class="article-card"
              :class="`card-animate delay-${index}`"
              glow-color="cyan"
              @click="goToArticle(article.id)"
            >
              <div class="article-cover">
                <img :src="article.cover" :alt="article.title" />
                <div class="cover-overlay">
                  <span class="read-time">{{ article.readTime }} 分钟阅读</span>
                </div>
              </div>

              <div class="article-content">
                <div class="article-tags">
                  <span
                    v-for="tag in article.tags.slice(0, 3)"
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>

                <h3 class="article-title">{{ article.title }}</h3>

                <p class="article-summary">{{ article.summary }}</p>

                <div class="article-meta">
                  <div class="meta-left">
                    <span class="meta-item">
                      <el-icon><Calendar /></el-icon>
                      {{ formatDate(article.createdAt) }}
                    </span>
                  </div>

                  <div class="meta-right">
                    <span class="meta-item">
                      <el-icon><View /></el-icon>
                      {{ formatNumber(article.views) }}
                    </span>
                    <span
                      class="meta-item like-btn"
                      :class="{ 'is-liked': visitorStore.isLiked(article.id) }"
                      @click.stop="handleLike(article)"
                    >
                      <el-icon>
                        <Star-Filled v-if="visitorStore.isLiked(article.id)" />
                        <Star v-else />
                      </el-icon>
                      {{ getLikeCount(article) }}
                    </span>
                  </div>
                </div>
              </div>
            </glass-card>
          </context-menu-trigger>
          <context-menu-content class="min-w-[160px]">
            <context-menu-item @click="likeArticle(article)">
              <el-icon class="mr-2" :class="{ 'text-pink-400': visitorStore.isLiked(article.id) }">
                <Star-Filled v-if="visitorStore.isLiked(article.id)" />
                <Star v-else />
              </el-icon>
              {{ visitorStore.isLiked(article.id) ? '取消点赞' : '点赞' }}
            </context-menu-item>
            <context-menu-item @click="shareArticle(article)">
              <el-icon class="mr-2"><Share /></el-icon>
              分享
            </context-menu-item>
            <context-menu-item @click="downloadArticle(article)">
              <el-icon class="mr-2"><Download /></el-icon>
              下载md文档
            </context-menu-item>
          </context-menu-content>
        </context-menu>
      </div>

      <!-- 查看更多按钮 -->
      <div class="view-more-container">
        <button class="view-more-btn" @click="router.push('/archive')">
          <span>查看更多文章</span>
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { useVisitorStore } from '@/stores/visitor'
import GlassCard from '@/components/common/GlassCard.vue'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const visitorStore = useVisitorStore()

const articles = computed(() => articleStore.articles.slice(0, 6))
const loading = computed(() => articleStore.loading)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const goToArticle = (id: number) => {
  // 如果当前在文章详情页，使用replace替换当前文章
  if (route.name === 'ArticleDetail') {
    router.replace(`/article/${id}`)
  } else {
    router.push(`/article/${id}`)
  }
}

// 获取点赞数（文章原有点赞 + 当前用户是否点赞）
const getLikeCount = (article: any) => {
  const baseLikes = article.likes || 0
  // 如果用户点赞了，显示 +1，否则显示原数量
  return visitorStore.isLiked(article.id) ? baseLikes + 1 : baseLikes
}

// 处理点赞点击
const handleLike = (article: any) => {
  const isLiked = visitorStore.toggleLike(article.id)
  if (isLiked) {
    toast.success('点赞成功', { description: `《${article.title}》已点赞`, duration: 2000 })
  } else {
    toast.info('取消点赞', { description: `《${article.title}》已取消点赞`, duration: 2000 })
  }
}

// 右键菜单功能
const likeArticle = (article: any) => {
  const isLiked = visitorStore.toggleLike(article.id)
  if (isLiked) {
    toast.success('点赞成功', { description: `《${article.title}》已点赞`, duration: 2000 })
  } else {
    toast.info('取消点赞', { description: `《${article.title}》已取消点赞`, duration: 2000 })
  }
}

const shareArticle = (article: any) => {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.summary,
      url: window.location.origin + '/article/' + article.id
    })
  } else {
    // 复制链接到剪贴板
    const url = window.location.origin + '/article/' + article.id
    navigator.clipboard.writeText(url).then(() => {
      toast.info('分享链接已复制', { description: url, duration: 3000 })
    })
  }
}

const downloadArticle = (article: any) => {
  // 模拟下载 Markdown 文件
  const content = `# ${article.title}\n\n${article.summary}\n\n标签: ${article.tags.join(', ')}`
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${article.title}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  toast.success('下载成功', { description: `${article.title}.md`, duration: 2000 })
}

const fetchArticles = () => {
  const tag = route.query.tag as string
  articleStore.fetchArticles({ tag })
}

watch(() => route.query.tag, fetchArticles)

onMounted(async () => {
  // 确保数据已加载
  if (articles.value.length === 0 && !loading.value) {
    await fetchArticles()
  }
})
</script>

<style scoped lang="scss">
.articles-section {
  padding: 0;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    height: auto;
    min-height: calc(100vh - 70px);
  }

  @media (max-width: 768px) {
    padding: 100px 0 40px;
    height: auto;
    min-height: auto;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;

  .title-number {
    color: var(--neon-cyan);
    font-family: var(--font-mono);
    margin-right: 8px;
  }
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

.loading-state {
  padding: 40px;
  text-align: center;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// 卡片进入动画
@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-animate {
  opacity: 0;
  animation: cardSlideUp 0.5s ease forwards;

  &.delay-0 { animation-delay: 0s; }
  &.delay-1 { animation-delay: 0.08s; }
  &.delay-2 { animation-delay: 0.16s; }
  &.delay-3 { animation-delay: 0.24s; }
  &.delay-4 { animation-delay: 0.32s; }
  &.delay-5 { animation-delay: 0.40s; }
}

.article-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.article-cover {
  position: relative;
  height: 18vh; // 减小高度
  overflow: hidden;
  border-radius: 12px 12px 0 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 10px;

    .read-time {
      font-size: 11px;
      color: var(--text-primary);
      font-family: var(--font-mono);
      padding: 3px 6px;
      background: var(--neon-cyan-glow);
      border-radius: 4px;
    }
  }
}

.article-card:hover {
  .article-cover img {
    transform: scale(1.05);
  }

  .cover-overlay {
    opacity: 1;
  }

  .article-title {
    color: var(--neon-cyan);
  }
}

.article-content {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;

  .tag {
    font-size: 10px;
    padding: 2px 6px;
    background: var(--neon-cyan-glow);
    color: var(--neon-cyan);
    border-radius: 3px;
    font-family: var(--font-mono);
  }
}

.article-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.article-summary {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
  flex: 1;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
}

.meta-left,
.meta-right {
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-muted);

  .el-icon {
    font-size: 12px;
  }

  &.like-btn {
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 2px 6px;
    border-radius: 4px;

    &:hover {
      color: var(--neon-pink);
      background: rgba(255, 113, 206, 0.1);
    }

    &.is-liked {
      color: var(--neon-pink);

      .el-icon {
        color: var(--neon-pink);
      }
    }
  }
}

.view-more-container {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.view-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--neon-cyan-glow);
  border: 1px solid var(--neon-cyan);
  border-radius: 10px;
  color: var(--neon-cyan);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  .el-icon {
    transition: transform 0.3s ease;
  }

  &:hover {
    background: var(--neon-cyan-glow);
    border-color: var(--neon-cyan);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--neon-cyan-glow);

    .el-icon {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
