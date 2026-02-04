<template>
    <button class="theme-toggle" :class="{ 'is-light': theme === 'light' }" @click="handleToggle"
        aria-label="切换主题">

        <!-- 图标容器 -->
        <div class="icon-wrapper" :class="{ 'is-dark': theme === 'dark' }">
            <!-- 太阳图标 (亮色模式) -->
            <svg class="icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>

            <!-- 月亮图标 (暗色模式) -->
            <svg class="icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        </div>
    </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const isAnimating = ref(false)
const clipPercent = ref(150)


const handleToggle = async () => {
    if (isAnimating.value) return

    isAnimating.value = true

    // 开始收缩动画：从 150% 到 0%
    const startTime = performance.now()
    const duration = 500

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // 使用 ease-in-out 缓动函数
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

        clipPercent.value = 150 * (1 - easeProgress)

        if (progress < 1) {
            requestAnimationFrame(animate)
        } else {
            // 动画完成，切换主题
            clipPercent.value = 150
            isAnimating.value = false
        }
    }

    requestAnimationFrame(animate)

    // 执行主题切换（在动画中间时刻）
    setTimeout(() => {
        toggleTheme()
    }, duration / 2)
}
</script>

<style scoped lang="scss">
.theme-toggle {
    position: relative;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease;

    &:hover {
        border-color: var(--neon-cyan);
    }

    &.is-light {
        border-color: rgba(0, 0, 0, 0.1);

        &:hover {
            border-color: #f59e0b;
        }
    }
}

// 内层背景 - 当前主题色
.bg-inner {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(255, 255, 255, 0.05);
    clip-path: circle(150% at 50% 50%);
}

.theme-toggle.is-light .bg-inner {
    background: rgba(0, 0, 0, 0.05);
}

// 图标容器
.icon-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    position: absolute;
    width: 20px;
    height: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-icon {
    color: #f59e0b;
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.moon-icon {
    color: #00ffff;
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
}

.icon-wrapper.is-dark {
    .sun-icon {
        opacity: 0;
        transform: rotate(90deg) scale(0.5);
    }

    .moon-icon {
        opacity: 1;
        transform: rotate(0deg) scale(1);
    }
}
</style>
