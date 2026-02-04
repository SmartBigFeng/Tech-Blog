<template>
    <div class="article-detail-page">
        <!-- 背景特效 -->
        <grid-background />
        <particle-background />
        <!-- 导航栏 -->
        <navbar />

        <!-- 搜索弹窗 -->
        <search-modal />

        <!-- 空白状态：文章不存在 -->
        <div v-if="showEmptyState" class="empty-state">
            <div class="empty-content">
                <el-icon class="empty-icon">
                    <DocumentDelete />
                </el-icon>
                <h2>暂无文章</h2>
                <p>抱歉，未找到该文章</p>
                <div class="countdown">
                    <span>{{ countdown }}</span> 秒后前往文章列表
                </div>
                <button class="go-list-btn" @click="goToList">
                    立即前往
                </button>
            </div>
        </div>

        <!-- 文章内容 -->
        <main v-else class="main-content">
            <div class="container">
                <!-- 返回按钮 -->
                <button class="back-btn" @click="goBack">
                    <el-icon>
                        <ArrowLeft />
                    </el-icon>
                    <span>返回</span>
                </button>

                <!-- 加载状态 -->
                <div v-if="loading" class="article-skeleton">
                    <div class="skeleton-layout">
                        <div class="skeleton-main">
                            <!-- 文章标题骨架 -->
                            <div class="skeleton-header">
                                <div class="skeleton-tags">
                                    <div class="skeleton-tag shimmer"></div>
                                    <div class="skeleton-tag shimmer"></div>
                                    <div class="skeleton-tag shimmer"></div>
                                </div>
                                <div class="skeleton-title shimmer"></div>
                                <div class="skeleton-meta">
                                    <div class="skeleton-meta-item shimmer"></div>
                                    <div class="skeleton-meta-item shimmer"></div>
                                    <div class="skeleton-meta-item shimmer"></div>
                                    <div class="skeleton-meta-item shimmer"></div>
                                </div>
                            </div>

                            <!-- 文章封面骨架 -->
                            <div class="skeleton-cover shimmer"></div>

                            <!-- 文章内容骨架 -->
                            <div class="skeleton-content">
                                <div class="skeleton-line shimmer" style="width: 100%"></div>
                                <div class="skeleton-line shimmer" style="width: 100%"></div>
                                <div class="skeleton-line shimmer" style="width: 85%"></div>
                                <div class="skeleton-line shimmer" style="width: 100%"></div>
                                <div class="skeleton-line shimmer" style="width: 60%"></div>
                                <div class="skeleton-line shimmer" style="width: 90%"></div>
                                <div class="skeleton-line shimmer" style="width: 70%"></div>
                            </div>
                        </div>

                        <!-- 侧边栏骨架 -->
                        <div class="skeleton-sidebar">
                            <div class="skeleton-card shimmer">
                                <div class="skeleton-card-title"></div>
                                <div class="skeleton-card-item"></div>
                                <div class="skeleton-card-item"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="article-layout">
                    <article class="article-main">
                        <!-- 文章头部 -->
                        <header class="article-header">
                            <div class="article-tags">
                                <span v-for="tag in article?.tags" :key="tag" class="article-tag"
                                    @click="$router.push({ path: '/', query: { tag } })">
                                    {{ tag }}
                                </span>
                            </div>

                            <h1 class="article-title">{{ article?.title }}</h1>

                            <div class="article-meta">
                                <div class="meta-item">
                                    <el-icon>
                                        <Calendar />
                                    </el-icon>
                                    <span>{{ formatDate(article?.createdAt) }}</span>
                                </div>
                                <div class="meta-item">
                                    <el-icon>
                                        <Timer />
                                    </el-icon>
                                    <span>{{ article?.readTime }} 分钟阅读</span>
                                </div>
                                <div class="meta-item">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                    <span>{{ formatNumber(article?.views || 0) }} 阅读</span>
                                </div>
                                <div class="meta-item like-meta"
                                    :class="{ 'is-liked': visitorStore.isLiked(currentArticleId) }" @click="handleLike">
                                    <el-icon>
                                        <Star-Filled v-if="visitorStore.isLiked(currentArticleId)" />
                                        <Star v-else />
                                    </el-icon>
                                    <span>{{ getLikeCount() }} 点赞</span>
                                </div>
                            </div>
                        </header>

                        <!-- 文章封面 -->
                        <div class="article-cover">
                            <img :src="article?.cover" :alt="article?.title" />
                        </div>

                        <!-- 文章内容 -->
                        <div class="article-body">
                            <markdown-renderer :content="article?.content || ''" />
                        </div>

                        <!-- 文章底部 -->
                        <footer class="article-footer">
                            <div class="footer-divider">
                                <span class="divider-text">END</span>
                            </div>

                            <div class="article-actions">
                                <button class="action-btn like-btn"
                                    :class="{ 'is-liked': visitorStore.isLiked(currentArticleId) }" @click="handleLike">
                                    <el-icon :size="20">
                                        <Star-Filled v-if="visitorStore.isLiked(currentArticleId)" />
                                        <Star v-else />
                                    </el-icon>
                                    <span>{{ visitorStore.isLiked(currentArticleId) ? '已点赞' : '点赞' }} ({{ getLikeCount()
                                        }})</span>
                                </button>

                                <button class="action-btn share-btn" @click="handleShare">
                                    <el-icon :size="20">
                                        <Share />
                                    </el-icon>
                                    <span>分享</span>
                                </button>
                            </div>
                        </footer>
                    </article>

                    <!-- 侧边栏 -->
                    <sidebar class="article-sidebar" />
                </div>
            </div>
        </main>

        <!-- 返回顶部按钮 -->
        <transition name="fade">
            <button v-if="showBackTop" class="back-top-btn" @click="scrollToTop">
                <el-icon>
                    <ArrowUp />
                </el-icon>
            </button>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GridBackground from '@/components/common/GridBackground.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import SearchModal from '@/components/sections/SearchModal.vue'
import { useArticleStore } from '@/stores/article'
import { useVisitorStore } from '@/stores/visitor'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const visitorStore = useVisitorStore()

const article = computed(() => articleStore.currentArticle)
const currentArticleId = computed(() => parseInt(route.params.id as string) || 0)
const loading = computed(() => articleStore.loading)
const showBackTop = ref(false)
const showEmptyState = ref(false)
const countdown = ref(3)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const formatDate = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
}

// 获取点赞数（文章原有点赞 + 当前用户是否点赞）
const getLikeCount = () => {
    const baseLikes = article.value?.likes || 0
    return visitorStore.isLiked(currentArticleId.value) ? baseLikes + 1 : baseLikes
}

// 处理点赞
const handleLike = () => {
    const isLiked = visitorStore.toggleLike(currentArticleId.value)
    if (isLiked) {
        toast.success('点赞成功', { description: `《${article.value?.title}》已点赞`, duration: 2000 })
    } else {
        toast.info('取消点赞', { description: `《${article.value?.title}》已取消点赞`, duration: 2000 })
    }
}

const handleShare = () => {
    if (navigator.share) {
        navigator.share({
            title: article.value?.title || '',
            url: window.location.href
        })
    } else {
        navigator.clipboard.writeText(window.location.href)
        toast.success('链接已复制到剪贴板', { duration: 2000 })
    }
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goBack = () => {
    // 如果有来源页面，返回上一页
    if (window.history.state && window.history.state.back) {
        router.back()
    } else {
        // 否则返回首页并滚动到文章板块
        router.push({ path: '/', hash: '#articles' })
    }
}

const goToList = () => {
    // 清除倒计时
    if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
    router.push({ path: '/', hash: '#articles' })
}

const startCountdown = () => {
    showEmptyState.value = true
    countdown.value = 3
    countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            goToList()
        }
    }, 1000)
}

const fetchArticle = async () => {
    const articleId = parseInt(route.params.id as string)
    if (!articleId || isNaN(articleId)) {
        startCountdown()
        return
    }

    await articleStore.fetchArticleById(articleId)

    // 检查文章是否存在
    if (!articleStore.currentArticle && !articleStore.loading) {
        startCountdown()
    } else {
        // 重置状态
        showEmptyState.value = false
        if (countdownTimer) {
            clearInterval(countdownTimer)
            countdownTimer = null
        }
    }
}

const handleScroll = () => {
    showBackTop.value = window.scrollY > 300
}

// 监听路由参数变化
watch(() => route.params.id, () => {
    fetchArticle()
})

onMounted(async () => {
    // 确保侧边栏数据已加载
    if (articleStore.articles.length === 0) {
        await articleStore.fetchArticles()
    }
    if (articleStore.tags.length === 0) {
        await articleStore.fetchTags()
    }
    if (articleStore.archives.length === 0) {
        await articleStore.fetchArchives()
    }

    fetchArticle()
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
})
</script>

<style scoped lang="scss">
.article-detail-page {
    min-height: 100vh;
    padding-top: 80px;
    padding-bottom: 80px;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    position: relative;
    z-index: 10;
}

.empty-content {
    text-align: center;
    padding: 48px;
}

.empty-icon {
    font-size: 80px;
    color: rgba(255, 255, 255, 0.2);
    margin-bottom: 24px;
}

.empty-content h2 {
    font-size: 28px;
    color: #fff;
    margin-bottom: 8px;
}

.empty-content p {
    font-size: 16px;
    color: var(--text-muted);
    margin-bottom: 24px;
}

.countdown {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
    font-family: var(--font-mono);

    span {
        color: var(--neon-cyan);
        font-size: 24px;
        font-weight: 700;
    }
}

.go-list-btn {
    padding: 12px 32px;
    background: var(--neon-cyan-glow);
    border: 1px solid var(--neon-cyan);
    border-radius: 8px;
    color: var(--neon-cyan);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--neon-cyan);
        color: var(--bg-primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-glow-cyan);
    }
}

.loading-state {
    padding: 40px;
    background: rgba(30, 41, 59, 0.4);
    border-radius: 20px;
}

// 骨架屏样式
.article-skeleton {
    .skeleton-layout {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 48px;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }
    }

    .skeleton-main {
        display: flex;
        flex-direction: column;
        gap: 32px;
    }

    .skeleton-header {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .skeleton-tags {
        display: flex;
        gap: 8px;
    }

    .skeleton-tag {
        width: 60px;
        height: 28px;
        border-radius: 4px;
    }

    .skeleton-title {
        width: 80%;
        height: 40px;
        border-radius: 8px;
    }

    .skeleton-meta {
        display: flex;
        gap: 24px;
    }

    .skeleton-meta-item {
        width: 80px;
        height: 20px;
        border-radius: 4px;
    }

    .skeleton-cover {
        width: 100%;
        height: 240px;
        border-radius: 16px;
    }

    .skeleton-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .skeleton-line {
        height: 16px;
        border-radius: 4px;
    }

    .skeleton-sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;

        @media (max-width: 1024px) {
            display: none;
        }
    }

    .skeleton-card {
        padding: 24px;
        border-radius: 16px;
        height: 200px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .skeleton-card-title {
        width: 60%;
        height: 20px;
        border-radius: 4px;
    }

    .skeleton-card-item {
        width: 100%;
        height: 40px;
        border-radius: 8px;
    }

    // 闪光动画效果
    .shimmer {
        background: linear-gradient(90deg,
                var(--neon-cyan-glow) 0%,
                rgba(8, 145, 178, 0.15) 50%,
                var(--neon-cyan-glow) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }

        100% {
            background-position: 200% 0;
        }
    }
}

.main-content {
    position: relative;
    z-index: 10;
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

    &:hover {
        background: var(--neon-cyan);
        color: var(--bg-primary);
        transform: translateX(-4px);
        box-shadow: var(--shadow-glow-cyan);
    }
}

.article-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 48px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
}

.article-main {
    min-width: 0;
}

.article-header {
    margin-bottom: 32px;
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.article-tag {
    font-size: 12px;
    padding: 4px 12px;
    background: var(--neon-cyan-glow);
    color: var(--neon-cyan);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: var(--neon-cyan);
        color: var(--bg-primary);
    }
}

.article-title {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 16px;

    @media (max-width: 768px) {
        font-size: 28px;
    }
}

.article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--text-muted);

    .el-icon {
        color: var(--text-secondary);
    }

    &.like-meta {
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 2px 8px;
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

.article-cover {
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 32px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    img {
        width: 100%;
        height: auto;
        display: block;
    }
}

.article-body {
    margin-bottom: 48px;
}

.article-footer {
    text-align: center;
}

.footer-divider {
    position: relative;
    margin-bottom: 32px;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    }

    .divider-text {
        position: relative;
        display: inline-block;
        padding: 0 16px;
        background: var(--bg-primary);
        font-size: 14px;
        color: var(--text-muted);
        font-family: var(--font-mono);
    }
}

.article-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }

    &.like-btn {

        &:hover,
        &.is-liked {
            border-color: #FF71CE;
            color: #FF71CE;
            background: rgba(255, 113, 206, 0.1);
            box-shadow: 0 4px 12px rgba(255, 113, 206, 0.2);
        }

        &.is-liked .el-icon {
            color: #FF71CE;
        }
    }

    &.share-btn:hover {
        border-color: var(--neon-cyan);
        color: var(--neon-cyan);
        background: var(--neon-cyan-glow);
        box-shadow: var(--shadow-glow-cyan);
    }
}

.article-sidebar {
    @media (max-width: 1024px) {
        display: none;
    }
}

.back-top-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--neon-cyan-glow);
    border: 1px solid var(--neon-cyan);
    color: var(--neon-cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;

    &:hover {
        background: var(--neon-cyan);
        color: var(--bg-primary);
        transform: translateY(-4px);
        box-shadow: var(--shadow-glow-cyan);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
