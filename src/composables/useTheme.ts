import { ref, computed } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme-preference'
const THEME_ATTR = 'data-theme'

// 主题状态
const currentTheme = ref<Theme>('dark')

// 初始化主题
export const initTheme = () => {
  // 检查本地存储
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved) {
    currentTheme.value = saved
  } else {
    // 检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    currentTheme.value = prefersDark ? 'dark' : 'light'
  }
  applyTheme(currentTheme.value)
}

// 应用主题
export const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute(THEME_ATTR, theme)
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem(STORAGE_KEY, theme)
}

// 切换主题
const toggleTheme = async () => {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  currentTheme.value = newTheme
  applyTheme(newTheme)
  return newTheme
}

// 设置特定主题
const setTheme = (theme: Theme) => {
  currentTheme.value = theme
  applyTheme(theme)
}

export function useTheme() {
  return {
    theme: currentTheme,
    isDark: computed(() => currentTheme.value === 'dark'),
    initTheme,
    toggleTheme,
    setTheme
  }
}
