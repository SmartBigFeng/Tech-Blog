<template>
    <nav class="navbar">
        <div class="container">
            <div class="navbar-inner">
                <router-link to="/" class="logo">
                    <neon-text color="cyan">AC</neon-text>
                    <span class="logo-text">Blog</span>
                </router-link>

                <div class="nav-links hide-mobile">
                    <a v-for="item in navItems" :key="item.id" href="javascript:void(0)" class="nav-link"
                        :class="{ active: activeSection === item.id }" @click="handleNavClick($event, item.id)">
                        <span class="nav-number">{{ item.number }}</span>
                        {{ item.label }}
                    </a>
                </div>

                <div class="nav-actions">
                    <button class="search-btn" @click="openSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                        <span class="shortcut">Alt S</span>
                    </button>

                    <ThemeToggle />

                    <el-button class="menu-btn hide-desktop" text @click="toggleMobileMenu">
                        <el-icon size="24">
                            <Menu />
                        </el-icon>
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 移动端菜单 -->
        <transition name="slide-down">
            <div v-if="mobileMenuOpen" class="mobile-menu hide-desktop">
                <a v-for="item in navItems" :key="item.id" href="javascript:void(0)" class="mobile-nav-link"
                    :class="{ active: activeSection === item.id }" @click="handleNavClick($event, item.id)">
                    <span class="nav-number">{{ item.number }}</span>
                    {{ item.label }}
                </a>
            </div>
        </transition>
    </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import NeonText from '@/components/common/NeonText.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false)

// 从 store 获取当前激活的 section
const activeSection = computed(() => appStore.activeSection)

const navItems = [
    { id: 'home', label: '首页', number: '01' },
    { id: 'about', label: '关于', number: '02' },
    { id: 'articles', label: '文章', number: '03' },
]

const openSearch = () => {
    appStore.openSearchModal()
}

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleNavClick = (e: Event, sectionId: string) => {
    e.preventDefault()
    mobileMenuOpen.value = false

    // 如果在首页，直接滚动到对应板块
    if (route.path === '/' || route.name === 'Home') {
        appStore.scrollToSection(sectionId)
    } else {
        // 如果在详情页或其他页面，跳转回首页
        router.push('/').then(() => {
            // 等待页面渲染完成后再滚动
            setTimeout(() => {
                appStore.scrollToSection(sectionId)
            }, 150)
        })
    }
}
</script>

<style scoped lang="scss">
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 16px 0;
    transition: all 0.3s ease;
    background: linear-gradient(-90deg, var(--bg-primary), var(--bg-secondary));

    &.is-scrolled {
        background: rgba(var(--bg-primary-rgb), 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        padding: 12px 0;
    }
}

.navbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-size: 24px;
    font-weight: 700;

    .logo-text {
        background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}

.nav-links {
    display: flex;
    gap: 32px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    font-family: var(--font-mono);
    transition: all 0.3s ease;
    position: relative;

    .nav-number {
        color: var(--neon-cyan);
        font-size: 12px;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--gradient-cyber);
        transition: width 0.3s ease;
    }

    &:hover,
    &.active {
        color: var(--text-primary);

        &::after {
            width: 100%;
        }
    }
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;

    .shortcut {
        padding: 2px 6px;
        background: var(--bg-secondary);
        border-radius: 4px;
        font-size: 12px;
        font-family: var(--font-mono);
    }

    &:hover {
        border-color: var(--neon-cyan);
        color: var(--neon-cyan);
        background: var(--neon-cyan-glow);
    }
}

.menu-btn {
    color: var(--text-secondary);

    &:hover {
        color: var(--neon-cyan);
    }
}

.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-color);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: var(--text-secondary);
    text-decoration: none;
    font-family: var(--font-mono);
    border-radius: 8px;
    transition: all 0.3s ease;

    .nav-number {
        color: var(--neon-cyan);
    }

    &:hover,
    &.active {
        background: var(--neon-cyan-glow);
        color: #fff;
    }
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
