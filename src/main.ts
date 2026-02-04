import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { initMock } from '@/api/mock'
import { initTheme } from '@/composables/useTheme'
import { Toaster } from '@/components/ui/sonner'

// 初始化主题（在应用创建前执行）
initTheme()

// Tailwind CSS (先加载，确保工具类优先级正确)
import './assets/styles/tailwind.css'

// 全局样式 (SCSS)
import './assets/styles/global.scss'
import './assets/styles/animations.scss'

// Element Plus 样式
import 'element-plus/dist/index.css'
import 'vue-sonner/style.css'
// 禁用浏览器默认的滚动恢复行为，让 Vue Router 完全控制
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
}

// 尽早初始化 Mock（在应用创建前，确保拦截所有请求）
initMock()

// 创建应用
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.component('Toaster', Toaster);
// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    size: 'default',
    zIndex: 3000
})

// 挂载应用
app.mount('#app')
