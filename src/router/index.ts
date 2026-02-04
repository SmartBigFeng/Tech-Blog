import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      section: 'home'
    }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail.vue'),
    meta: {
      title: '文章详情',
      section: 'article'
    }
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/views/Archive.vue'),
    meta: {
      title: '归档',
      section: 'archive'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'Coder Wang 的技术博客' // 改为默认标题，而不是"页面未找到"
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 返回空，由 afterEach 守卫处理滚动
    return false
  }
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - Coder Wang 的技术博客`
  } else {
    document.title = 'Coder Wang 的技术博客'
  }
  next()
})

// 全局路由守卫：处理文章详情页之间的导航
// 当从文章详情页进入另一个文章详情页时，使用replace而不是push
router.beforeEach((to, from, next) => {
  // 如果目标不是文章详情页，直接放行
  if (to.name !== 'ArticleDetail') {
    next()
    return
  }

  // 如果来源是文章详情页，并且目标也是文章详情页（文章切换）
  // 标记这次导航应该使用replace
  if (from.name === 'ArticleDetail' && to.name === 'ArticleDetail') {
    // 通过设置replace标志来告诉组件使用replace
    to.meta.replace = true
  }

  next()
})

// 全局后置守卫：处理非首页的滚动
// 首页的滚动由 Home.vue 组件内部处理
router.afterEach((to, from) => {
  // 首页的滚动交给 Home.vue 组件处理
  if (to.name === 'Home') {
    return
  }

  // 其他页面滚动到顶部
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 50)
})

export default router
