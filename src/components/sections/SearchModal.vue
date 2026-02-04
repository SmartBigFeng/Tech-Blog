<template>
    <AnimatedModal v-model:open="visible" @update:open="handleOpenChange" @open="onOpen">
        <AnimatedModalBody class="search-modal-body" content-class="search-modal-content" :show-close="false"
            :z-index="1000">
            <!-- 搜索头部 -->
            <div class="flex items-center gap-4 p-5 border-b border-white/10">
                <div class="flex-1 relative">
                    <el-input v-model="searchQuery" placeholder="搜索文章标题、标签或内容..." class="search-input" size="large"
                        clearable autofocus @input="handleSearch">
                        <template #prefix>
                            <el-icon :size="20">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
                <button class="close-btn" @click="close">
                    <span>Alt S 关闭</span>
                </button>
            </div>

            <!-- 搜索结果 -->
            <div class="flex-1 overflow-hidden">
                <!-- 加载状态 -->
                <Transition name="fade" mode="out-in">
                    <div v-if="loading" key="loading" class="search-state-container">
                        <el-skeleton :rows="3" animated />
                    </div>

                    <!-- 有结果 -->
                    <div v-else-if="searchResults.length > 0" key="results"
                        class="search-state-container overflow-y-auto">
                        <TransitionGroup name="list" tag="div">
                            <div v-for="(article, index) in searchResults" :key="article.id" class="result-item"
                                :style="{ transitionDelay: `${index * 50}ms` }" @click="goToArticle(article.id)">
                                <div class="result-content">
                                    <h4 class="result-title" v-html="highlightMatch(article.title)"></h4>
                                    <p class="result-summary">{{ article.summary }}</p>
                                    <div class="result-meta">
                                        <span v-for="tag in article.tags" :key="tag" class="result-tag">
                                            {{ tag }}
                                        </span>
                                        <span class="result-date">{{ formatDate(article.createdAt) }}</span>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>

                    <!-- 无结果 -->
                    <div v-else-if="searchQuery" key="empty"
                        class="search-state-container flex flex-col items-center justify-center text-[var(--text-secondary)]">
                        <el-icon :size="48" class="mb-4 text-[var(--text-muted)]">
                            <Search />
                        </el-icon>
                        <p class="text-sm">未找到相关文章</p>
                    </div>

                    <!-- 默认提示 -->
                    <div v-else key="tips" class="search-state-container overflow-y-auto">
                        <div class="p-8">
                            <h4 class="text-sm text-[var(--text-secondary)] mb-6">搜索提示</h4>
                            <ul class="space-y-4">
                                <li class="text-[13px] text-[var(--text-muted)] pl-5 relative leading-relaxed">
                                    <span class="absolute left-0 text-[var(--neon-cyan)]">›</span>
                                    输入关键词搜索文章标题
                                </li>
                                <li class="text-[13px] text-[var(--text-muted)] pl-5 relative leading-relaxed">
                                    <span class="absolute left-0 text-[var(--neon-cyan)]">›</span>
                                    可以搜索标签名称快速定位内容
                                </li>
                                <li class="text-[13px] text-[var(--text-muted)] pl-5 relative leading-relaxed">
                                    <span class="absolute left-0 text-[var(--neon-cyan)]">›</span>
                                    按 Alt + S 快捷键随时打开搜索
                                </li>
                                <li class="text-[13px] text-[var(--text-muted)] pl-5 relative leading-relaxed">
                                    <span class="absolute left-0 text-[var(--neon-cyan)]">›</span>
                                    支持模糊匹配，无需输入完整标题
                                </li>
                                <li class="text-[13px] text-[var(--text-muted)] pl-5 relative leading-relaxed">
                                    <span class="absolute left-0 text-[var(--neon-cyan)]">›</span>
                                    点击搜索结果可直接跳转文章详情
                                </li>
                                <li class="text-[13px] text-[var(--text-muted)] pl-5 relative leading-relaxed">
                                    <span class="absolute left-0 text-[var(--neon-cyan)]">›</span>
                                    按 ESC 键可快速关闭搜索窗口
                                </li>
                            </ul>
                        </div>
                    </div>
                </Transition>
            </div>
        </AnimatedModalBody>
    </AnimatedModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useArticleStore } from '@/stores/article'
import { useShortcut } from '@/composables/useShortcut'
import { debounce } from 'lodash-es'
import {
    AnimatedModal,
    AnimatedModalBody,
} from '@/components/ui/animated-modal'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const articleStore = useArticleStore()

const searchQuery = ref('')
const loading = computed(() => articleStore.loading)
const searchResults = computed(() => articleStore.searchResults)
const visible = computed(() => appStore.searchModalVisible)

// 注册快捷键
useShortcut('alt+s', () => {
    if (visible.value) {
        close()
    } else {
        appStore.openSearchModal()
    }
})

useShortcut('esc', () => {
    if (visible.value) {
        close()
    }
})

const handleSearch = debounce(() => {
    if (searchQuery.value.trim()) {
        articleStore.searchArticles(searchQuery.value)
    } else {
        articleStore.searchResults = []
    }
}, 300)

const clearSearch = () => {
    searchQuery.value = ''
    articleStore.searchResults = []
}

const close = () => {
    clearSearch()
    appStore.closeSearchModal()
}

const onOpen = () => {
    nextTick(() => {
        const input = document.querySelector('.search-input input') as HTMLInputElement
        input?.focus()
    })
}

const handleOpenChange = (value: boolean) => {
    if (!value) {
        close()
    }
}

const goToArticle = (id: number) => {
    // 如果当前在文章详情页，使用replace替换当前文章
    if (route.name === 'ArticleDetail') {
        router.replace(`/article/${id}`)
    } else {
        router.push(`/article/${id}`)
    }
    close()
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN')
}

const highlightMatch = (text: string) => {
    if (!searchQuery.value) return text
    const regex = new RegExp(`(${searchQuery.value})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
}

watch(visible, (newVal) => {
    if (newVal) {
        clearSearch()
    }
})
</script>

<style lang="scss">
// 弹窗主体样式覆盖 - 使用非 scoped 样式来覆盖子组件根元素
.search-modal-body {
    background: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 16px !important;
    max-width: 640px !important;
    width: calc(100vw - 32px) !important;
    max-height: 600px !important;
    height: auto !important;
    overflow: hidden !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.search-modal-overlay {
    background: rgba(0, 0, 0, 0.8) !important;
    backdrop-filter: blur(10px) !important;
}

// 状态容器固定高度
.search-state-container {
    height: clamp(200px, 40vh, 360px);
    padding: 20px;
}

// 状态切换过渡动画
.fade-enter-active,
.fade-leave-active {
    transition: all 0.25s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

// 列表项进入动画
.list-enter-active {
    transition: all 0.3s ease;
}

.list-leave-active {
    transition: all 0.2s ease;
    position: absolute;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.list-move {
    transition: transform 0.3s ease;
}

.search-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
}

// 搜索头部样式
.search-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.search-input {
    flex: 1;

    :deep(.el-input__wrapper) {
        background: var(--bg-tertiary);
        border: 1px solid transparent;
        box-shadow: none;

        &.is-focus {
            border-color: var(--neon-cyan);
            box-shadow: 0 0 0 2px var(--neon-cyan-glow);
        }
    }

    input {
        font-size: 16px;
        color: var(--text-primary);

        &::placeholder {
            color: var(--text-muted);
        }
    }
}

.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 12px;
    font-family: var(--font-mono);
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
}

// 搜索结果区域
.search-results {
    flex: 1;
    overflow-y: auto;
    max-height: 400px;
}

.loading {
    padding: 40px;
}

.results-list {
    padding: 8px;
}

.result-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: var(--neon-cyan-glow);

        .result-title {
            color: var(--neon-cyan);
        }
    }
}

.result-content {
    flex: 1;
}

.result-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
    transition: color 0.2s ease;
    line-height: 1.4;

    :deep(mark) {
        background: var(--neon-cyan-glow);
        color: var(--text-primary);
        padding: 0 2px;
        border-radius: 2px;
    }
}

.result-summary {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.result-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.result-tag {
    font-size: 11px;
    padding: 2px 8px;
    background: var(--neon-purple-glow);
    color: var(--neon-purple);
    border-radius: 4px;
}

.result-date {
    font-size: 12px;
    color: var(--text-muted);
}

// 无结果提示
.no-results {
    padding: 60px 20px;
    text-align: center;
    color: var(--text-secondary);

    .el-icon {
        color: var(--text-muted);
        margin-bottom: 16px;
    }

    p {
        font-size: 14px;
    }
}

// 搜索提示
.search-tips {
    padding: 32px;

    h4 {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 16px;
    }

    ul {
        list-style: none;
        padding: 0;

        li {
            font-size: 13px;
            color: var(--text-muted);
            padding: 8px 0;
            padding-left: 20px;
            position: relative;

            &::before {
                content: '›';
                position: absolute;
                left: 0;
                color: var(--neon-cyan);
            }
        }
    }
}
</style>