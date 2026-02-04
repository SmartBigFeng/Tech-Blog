<template>
  <aside class="sidebar">
    <!-- 搜索框 -->
    <glass-card class="sidebar-section" glow-color="cyan">
      <h3 class="section-title">
        <el-icon><Search /></el-icon>
        搜索文章
      </h3>
      <div class="search-input-wrapper" @click="openSearch">
        <el-input
          placeholder="搜索文章..."
          readonly
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #suffix>
            <span class="keyboard-shortcut">Alt S</span>
          </template>
        </el-input>
      </div>
    </glass-card>

    <!-- 热门文章 -->
    <glass-card class="sidebar-section" glow-color="purple">
      <h3 class="section-title">
        <el-icon><Fire /></el-icon>
        热门文章
      </h3>
      <div class="hot-articles">
        <div
          v-for="(article, index) in hotArticles"
          :key="article.id"
          class="hot-article-item"
          @click="goToArticle(article.id)"
        >
          <span class="rank" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
          <div class="article-info">
            <h4 class="article-title">{{ article.title }}</h4>
            <span class="article-views">{{ formatNumber(article.views) }} 阅读</span>
          </div>
        </div>
      </div>
    </glass-card>

    <!-- 标签云 -->
    <glass-card class="sidebar-section" glow-color="pink">
      <h3 class="section-title">
        <el-icon><CollectionTag /></el-icon>
        标签云
      </h3>
      <div class="tag-cloud">
        <span
          v-for="tag in sortedTags"
          :key="tag.name"
          class="tag-item"
          :style="getTagStyle(tag.count)"
          @click="filterByTag(tag.name)"
        >
          {{ tag.name }}
        </span>
      </div>
    </glass-card>

    <!-- 归档 -->
    <glass-card class="sidebar-section" glow-color="mint">
      <h3 class="section-title">
        <el-icon><Calendar /></el-icon>
        归档
      </h3>
      <div class="archive-list">
        <div
          v-for="archive in formattedArchives"
          :key="archive.value"
          class="archive-item"
        >
          <span class="archive-date">{{ archive.label }}</span>
          <span class="archive-count">{{ archive.count }} 篇</span>
        </div>
      </div>
    </glass-card>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useArticleStore } from '@/stores/article'
import GlassCard from '@/components/common/GlassCard.vue'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const articleStore = useArticleStore()

const hotArticles = computed(() => articleStore.hotArticles.slice(0, 5))
const sortedTags = computed(() => articleStore.sortedTags)
const formattedArchives = computed(() => articleStore.formattedArchives.slice(0, 6))

const openSearch = () => {
  appStore.openSearchModal()
}

const goToArticle = (id: number) => {
  // 如果当前在文章详情页，使用replace替换当前文章
  if (route.name === 'ArticleDetail') {
    router.replace(`/article/${id}`)
  } else {
    router.push(`/article/${id}`)
  }
}

const filterByTag = (tag: string) => {
  router.push({
    path: '/',
    query: { tag }
  })
}

const getTagStyle = (count: number) => {
  const maxCount = Math.max(...sortedTags.value.map(t => t.count))
  const minCount = Math.min(...sortedTags.value.map(t => t.count))
  const ratio = (count - minCount) / (maxCount - minCount || 1)

  const fontSize = 12 + ratio * 8
  const opacity = 0.5 + ratio * 0.5

  return {
    fontSize: `${fontSize}px`,
    opacity
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  padding: 16px 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;

  .el-icon {
    color: var(--neon-cyan);
  }
}

.search-input-wrapper {
  cursor: pointer;

  :deep(.search-input) {
    .el-input__wrapper {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      box-shadow: none;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--neon-cyan);
      }

      input {
        cursor: pointer;
        color: var(--text-primary);

        &::placeholder {
          color: var(--text-muted);
        }
      }

      .el-input__prefix {
        color: var(--text-muted);
      }
    }
  }
}

.keyboard-shortcut {
  padding: 2px 6px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.hot-articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-article-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-tertiary);

    .article-title {
      color: var(--neon-cyan);
    }
  }
}

.rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-mono);
  flex-shrink: 0;

  &.rank-1 {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
  }

  &.rank-2 {
    background: linear-gradient(135deg, #C0C0C0, #808080);
    color: #000;
  }

  &.rank-3 {
    background: linear-gradient(135deg, #CD7F32, #8B4513);
    color: #fff;
  }

  &:not(.rank-1):not(.rank-2):not(.rank-3) {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
  }
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
  margin-bottom: 4px;
}

.article-views {
  font-size: 12px;
  color: var(--text-muted);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(185, 103, 255, 0.2);
    border-color: rgba(185, 103, 255, 0.5);
    color: #B967FF;
    transform: translateY(-2px);
  }
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.archive-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(5, 255, 161, 0.1);

    .archive-date {
      color: #05FFA1;
    }
  }
}

.archive-date {
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.archive-count {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}
</style>
