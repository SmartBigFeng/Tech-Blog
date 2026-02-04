<template>
  <div class="archive-page">
    <!-- 背景特效 -->
    <grid-background />
    <particle-background />
    <!-- 导航栏 -->
    <navbar />

    <!-- 搜索弹窗 -->
    <search-modal />

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回首页</span>
        </button>

        <!-- 搜索条件区域 -->
        <div class="search-filters">
          <div class="filter-item">
            <div class="filter-label">
              <el-icon><Search /></el-icon>
              <span>搜索文章</span>
            </div>
            <el-input
              v-model="searchTitle"
              placeholder="输入标题关键词..."
              clearable
              @input="handleSearch"
              class="filter-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <div class="filter-item">
            <div class="filter-label">
              <el-icon><Calendar /></el-icon>
              <span>发布时间</span>
            </div>
            <el-date-picker
              v-model="searchDate"
              type="month"
              placeholder="选择月份"
              format="YYYY年MM月"
              value-format="YYYY-MM"
              clearable
              @change="handleSearch"
              class="filter-picker"
              popper-class="dark-picker"
            />
          </div>

          <div class="filter-item">
            <div class="filter-label">
              <el-icon><CollectionTag /></el-icon>
              <span>文章标签</span>
            </div>
            <el-select
              v-model="searchTag"
              placeholder="全部标签"
              clearable
              @change="handleSearch"
              class="filter-select"
              popper-class="dark-select"
            >
              <el-option
                v-for="tag in tags"
                :key="tag.name"
                :label="`${tag.name} (${tag.count})`"
                :value="tag.name"
              />
            </el-select>
          </div>

          <button class="reset-btn" @click="resetFilters">
            <el-icon><RefreshLeft /></el-icon>
            <span>重置筛选</span>
          </button>
        </div>

        <div class="archive-layout">
          <div class="archive-main">
            <header class="archive-header">
              <h1 class="page-title">
                <span class="title-number">#</span>
                文章归档
              </h1>
              <p class="page-subtitle">共 {{ filteredArticles.length }} 篇文章</p>
            </header>

            <div v-if="filteredArticles.length === 0" class="empty-state">
              <el-icon class="empty-icon"><DocumentDelete /></el-icon>
              <p>暂无符合条件的文章</p>
            </div>

            <div v-else class="archive-timeline">
              <div
                v-for="group in groupedArticles"
                :key="group.date"
                class="timeline-group"
              >
                <div class="timeline-date">
                  <span class="date-year">{{ group.year }}</span>
                  <span class="date-month">{{ group.month }}月</span>
                  <span class="date-count">{{ group.articles.length }} 篇</span>
                </div>

                <div class="timeline-articles">
                  <context-menu v-for="article in group.articles" :key="article.id">
                    <context-menu-trigger as-child>
                      <glass-card
                        class="timeline-article"
                        glow-color="cyan"
                        @click="goToArticle(article.id)"
                      >
                        <div class="article-day">{{ article.day }}</div>
                        <div class="article-content">
                          <h3 class="article-title">{{ article.title }}</h3>
                          <div class="article-meta">
                            <span class="article-tag" v-for="tag in article.tags.slice(0, 2)" :key="tag">
                              {{ tag }}
                            </span>
                            <span class="article-views">
                              <el-icon><View /></el-icon>
                              {{ formatNumber(article.views) }}
                            </span>
                            <span
                              class="article-likes like-btn"
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
              </div>
            </div>
          </div>

          <sidebar class="archive-sidebar" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GridBackground from '@/components/common/GridBackground.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import GlassCard from '@/components/common/GlassCard.vue'
import SearchModal from '@/components/sections/SearchModal.vue'
import { useArticleStore } from '@/stores/article'
import { useVisitorStore } from '@/stores/visitor'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const articleStore = useArticleStore()
const visitorStore = useVisitorStore()

const searchTitle = ref('')
const searchDate = ref('')
const searchTag = ref('')

const articles = computed(() => articleStore.articles)
const tags = computed(() => articleStore.sortedTags)

// 过滤文章
const filteredArticles = computed(() => {
  let result = [...articles.value]

  // 按标题过滤
  if (searchTitle.value.trim()) {
    const keyword = searchTitle.value.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(keyword))
  }

  // 按日期过滤
  if (searchDate.value) {
    result = result.filter(a => {
      const date = new Date(a.createdAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}` === searchDate.value
    })
  }

  // 按标签过滤
  if (searchTag.value) {
    result = result.filter(a => a.tags.includes(searchTag.value))
  }

  return result
})

const totalArticles = computed(() => filteredArticles.value.length)

// 从URL读取初始搜索条件
onMounted(() => {
  const titleQuery = route.query.title as string
  const dateQuery = route.query.date as string
  const tagQuery = route.query.tag as string

  if (titleQuery) searchTitle.value = titleQuery
  if (dateQuery) searchDate.value = dateQuery
  if (tagQuery) searchTag.value = tagQuery

  articleStore.fetchArticles()
  articleStore.fetchTags()
  articleStore.fetchArchives()
})

interface TimelineArticle {
  id: number
  title: string
  tags: string[]
  views: number
  likes: number
  day: string
}

interface TimelineGroup {
  year: string
  month: string
  date: string
  articles: TimelineArticle[]
}

const groupedArticles = computed(() => {
  const groups: TimelineGroup[] = []
  const sorted = [...filteredArticles.value].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  sorted.forEach(article => {
    const date = new Date(article.createdAt)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString().padStart(2, '0')
    const key = `${year}-${month}`

    let group = groups.find(g => g.date === key)
    if (!group) {
      group = {
        year,
        month,
        date: key,
        articles: []
      }
      groups.push(group)
    }

    group.articles.push({
      id: article.id,
      title: article.title,
      tags: article.tags,
      views: article.views,
      likes: article.likes || 0,
      day
    })
  })

  return groups
})

const handleSearch = () => {
  // 更新URL参数但不触发导航
  const query: Record<string, string> = {}
  if (searchTitle.value) query.title = searchTitle.value
  if (searchDate.value) query.date = searchDate.value
  if (searchTag.value) query.tag = searchTag.value
  router.replace({ query })
}

const resetFilters = () => {
  searchTitle.value = ''
  searchDate.value = ''
  searchTag.value = ''
  router.replace({ query: {} })
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
interface Article {
  id: number
  title: string
  summary?: string
  tags: string[]
  views: number
  day?: string
}

const likeArticle = (article: Article) => {
  const isLiked = visitorStore.toggleLike(article.id)
  if (isLiked) {
    toast.success('点赞成功', { description: `《${article.title}》已点赞`, duration: 2000 })
  } else {
    toast.info('取消点赞', { description: `《${article.title}》已取消点赞`, duration: 2000 })
  }
}

const shareArticle = (article: Article) => {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.summary || '',
      url: window.location.origin + '/article/' + article.id
    })
  } else {
    const url = window.location.origin + '/article/' + article.id
    navigator.clipboard.writeText(url).then(() => {
      toast.info('分享链接已复制', { description: url, duration: 3000 })
    })
  }
}

const downloadArticle = (article: Article) => {
  const content = `# ${article.title}\n\n${article.summary || ''}\n\n标签: ${article.tags.join(', ')}`
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

const goBack = () => {
  router.push('/')
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.archive-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  padding-bottom: 80px;

  @media (max-width: 768px) {
    padding-top: 80px;
    padding-bottom: 40px;
  }
}

.main-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  margin-bottom: 24px;
  background: var(--neon-cyan-glow);
  border: 1px solid var(--neon-cyan);
  border-radius: 8px;
  color: var(--neon-cyan);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: var(--neon-cyan);
    color: var(--bg-primary);
    transform: translateX(-4px);
    box-shadow: var(--shadow-glow-cyan);
  }
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
  margin-bottom: 40px;
  padding: 24px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: var(--shadow-card);

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    min-width: 180px;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--neon-cyan);
    font-weight: 500;
    letter-spacing: 0.5px;

    .el-icon {
      font-size: 16px;
    }
  }

  :deep(.el-input) {
    .el-input__wrapper {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      box-shadow: none;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--neon-cyan);
      }

      &.is-focus {
        border-color: var(--neon-cyan);
        box-shadow: 0 0 0 2px var(--neon-cyan-glow);
      }

      input {
        color: var(--text-primary);
        &::placeholder {
          color: var(--text-muted);
        }
      }

      .el-input__prefix {
        color: var(--text-muted);
      }

      .el-input__clear {
        color: var(--text-muted);
        &:hover {
          color: var(--neon-cyan);
        }
      }
    }
  }

  :deep(.el-select) {
    .el-select__wrapper {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      box-shadow: none;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--neon-cyan);
      }

      &.is-focus {
        border-color: var(--neon-cyan);
        box-shadow: 0 0 0 2px var(--neon-cyan-glow);
      }
    }

    .el-select__input {
      color: var(--text-primary);
    }

    .el-select__placeholder {
      color: var(--text-muted);
    }

    .el-select__caret {
      color: var(--text-muted);
    }
  }

  :deep(.el-date-editor) {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    box-shadow: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--neon-cyan);
    }

    .el-input__wrapper {
      background: transparent;
      box-shadow: none;
    }

    .el-input__inner {
      color: var(--text-primary);
      &::placeholder {
        color: var(--text-muted);
      }
    }

    .el-input__prefix {
      color: var(--text-muted);
    }

    .el-input__suffix {
      .el-icon {
        color: var(--text-muted);
      }
    }
  }

  .reset-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, var(--neon-cyan-glow), rgba(185, 103, 255, 0.1));
    border: 1px solid var(--neon-cyan-glow);
    border-radius: 12px;
    color: var(--neon-cyan);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    height: fit-content;
    align-self: flex-end;

    .el-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
    }

    &:hover {
      background: linear-gradient(135deg, var(--neon-cyan-glow), rgba(185, 103, 255, 0.2));
      border-color: var(--neon-cyan);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px var(--neon-cyan-glow);

      .el-icon {
        transform: rotate(-180deg);
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;

    .filter-item {
      min-width: 100%;
    }

    .reset-btn {
      width: 100%;
      justify-content: center;
    }
  }
}

.archive-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  flex: 1;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (max-width: 768px) {
    gap: 24px;
  }
}

.archive-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;

  .title-number {
    color: var(--neon-cyan);
    font-family: var(--font-mono);
    margin-right: 8px;
  }
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  p {
    font-size: 16px;
  }
}

.archive-timeline {
  position: relative;
  padding-left: 32px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    background: linear-gradient(180deg,
      transparent 0%,
      var(--neon-cyan-glow) 10%,
      rgba(185, 103, 255, 0.3) 50%,
      rgba(255, 113, 206, 0.3) 90%,
      transparent 100%
    );
  }
}

.timeline-group {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-date {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -36px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: var(--neon-cyan);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--neon-cyan);
  }

  .date-year {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .date-month {
    font-size: 16px;
    color: var(--text-secondary);
  }

  .date-count {
    font-size: 14px;
    color: var(--text-muted);
    margin-left: auto;
  }
}

.timeline-articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-article {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    .article-title {
      color: var(--neon-cyan);
    }
  }
}

.article-day {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neon-cyan-glow);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.article-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: rgba(185, 103, 255, 0.1);
  color: #B967FF;
  border-radius: 4px;
}

.article-views {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);

  .el-icon {
    font-size: 14px;
  }
}

.article-likes {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  margin-left: auto;

  .el-icon {
    font-size: 14px;
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

.archive-sidebar {
  @media (max-width: 1024px) {
    display: none;
  }
}
</style>
