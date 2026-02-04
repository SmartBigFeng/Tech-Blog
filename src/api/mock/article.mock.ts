import type { Article, Tag, ArchiveItem } from '@/types/article'

// 示例文章数据
const articles: Article[] = [
  {
    id: 1,
    title: '深入理解 Vue 3 Composition API',
    summary: 'Vue 3 的 Composition API 为我们提供了一种全新的组织组件逻辑的方式。本文将深入探讨其设计理念、使用场景以及最佳实践。',
    content: `# 深入理解 Vue 3 Composition API

Vue 3 引入的 Composition API 是一套全新的 API，旨在解决 Vue 2 中 Options API 在大型组件中代码组织困难的问题。

## 为什么需要 Composition API？

在 Options API 中，相关逻辑被分散在 data、methods、computed 等选项中。当组件变得复杂时，代码可读性和可维护性会下降。

### 主要优势

1. **逻辑复用**：通过组合函数（Composables）实现逻辑的提取和复用
2. **更好的 TypeScript 支持**：类型推断更加自然
3. **代码组织**：相关逻辑可以放在一起

## 核心概念

### setup 函数

\`\`\`vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
\`\`\`

### 响应式引用

- ref：用于基本类型的响应式
- reactive：用于对象的响应式
- computed：计算属性

## 最佳实践

1. 将可复用逻辑提取到 composables 中
2. 使用命名规范（useXxx）
3. 注意响应式丢失问题`,
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['Vue 3', 'JavaScript', '前端'],
    views: 1256,
    likes: 89,
    comments: 23,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    readTime: 8
  },
  {
    id: 2,
    title: 'TypeScript 高级类型体操指南',
    summary: '从条件类型到模板字面量类型，全面掌握 TypeScript 类型系统的进阶技巧，让你的代码更加健壮和智能。',
    content: `# TypeScript 高级类型体操指南

TypeScript 的类型系统是图灵完备的，这意味着你可以用它来实现复杂的类型操作。

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false

// 使用
type A = IsString<string> // true
type B = IsString<number> // false
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
\`\`\`

## infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
\`\`\``,
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['TypeScript', 'JavaScript'],
    views: 2341,
    likes: 156,
    comments: 45,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
    readTime: 12
  },
  {
    id: 3,
    title: '构建高性能 React 应用的最佳实践',
    summary: '探索 React 性能优化的核心策略，包括虚拟列表、代码分割、Memoization 等技术，打造流畅的用户体验。',
    content: `# 构建高性能 React 应用的最佳实践

性能优化是前端开发中的重要课题。本文将介绍多种实用的 React 性能优化技巧。

## 1. 使用 React.memo

\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  // 组件逻辑
})
\`\`\`

## 2. useMemo 和 useCallback

\`\`\`jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
\`\`\`

## 3. 虚拟列表

对于长列表，使用 react-window 或 react-virtualized。`,
    cover: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
    tags: ['React', '性能优化', '前端'],
    views: 1890,
    likes: 112,
    comments: 34,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-08',
    readTime: 10
  },
  {
    id: 4,
    title: 'CSS Grid 布局完全指南',
    summary: '从基础概念到高级技巧，全面掌握 CSS Grid 布局系统，创建复杂而优雅的网页布局。',
    content: `# CSS Grid 布局完全指南

CSS Grid 是 Web 布局的一次革命，它让我们能够轻松创建复杂的二维布局。

## 基础概念

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

## Grid 区域

\`\`\`css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
\`\`\``,
    cover: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    tags: ['CSS', '前端', '布局'],
    views: 3156,
    likes: 234,
    comments: 67,
    createdAt: '2023-12-28',
    updatedAt: '2024-01-02',
    readTime: 15
  },
  {
    id: 5,
    title: 'Node.js 微服务架构实践',
    summary: '从零开始构建可扩展的微服务系统，涵盖服务发现、负载均衡、熔断器等核心概念与实现。',
    content: `# Node.js 微服务架构实践

微服务架构已经成为构建大型应用的主流方式。本文将介绍如何使用 Node.js 构建微服务。

## 架构设计

### 核心组件

- **API 网关**：统一入口，处理认证、限流
- **服务注册与发现**：动态管理服务实例
- **配置中心**：集中管理配置
- **消息队列**：异步通信

## 技术选型

\`\`\`javascript
// Express 微服务示例
const express = require('express')
const app = express()

app.get('/health', (req, res) => {
  res.json({ status: 'UP' })
})
\`\`\``,
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tags: ['Node.js', '微服务', '后端'],
    views: 987,
    likes: 76,
    comments: 18,
    createdAt: '2023-12-20',
    updatedAt: '2023-12-22',
    readTime: 20
  },
  {
    id: 6,
    title: 'WebAssembly：前端性能的新纪元',
    summary: '探索 WebAssembly 的强大能力，学习如何将高性能计算带到浏览器中，解锁新的可能性。',
    content: `# WebAssembly：前端性能的新纪元

WebAssembly（Wasm）是一种新型的代码格式，可以在现代 Web 浏览器中以接近原生的性能运行。

## 什么是 WebAssembly？

WebAssembly 是一种低级的类汇编语言，具有紧凑的二进制格式，可以作为 C/C++/Rust 等高级语言的编译目标。

## 核心优势

1. **高性能**：接近原生代码的执行速度
2. **安全性**：在沙箱环境中执行
3. **开放性**：Web 标准，所有主流浏览器支持

## 使用场景

- 图像/视频处理
- 游戏引擎
- 科学计算
- 加密运算`,
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['WebAssembly', '性能', '前沿技术'],
    views: 1456,
    likes: 98,
    comments: 29,
    createdAt: '2023-12-15',
    updatedAt: '2023-12-18',
    readTime: 12
  },
  {
    id: 7,
    title: '深入理解 JavaScript 异步编程',
    summary: '从回调地狱到 async/await，全面掌握 JavaScript 异步编程的演进历程和最佳实践。',
    content: `# 深入理解 JavaScript 异步编程

JavaScript 是单线程语言，异步编程是其核心特性之一。本文将深入探讨异步编程的各种模式。

## 回调函数

最早的异步编程模式，但容易导致回调地狱。

## Promise

ES6 引入的 Promise 解决了回调地狱问题。

## async/await

ES2017 引入的语法糖，让异步代码看起来像同步代码。`,
    cover: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
    tags: ['JavaScript', '异步编程', '前端'],
    views: 3890,
    likes: 267,
    comments: 89,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-12',
    readTime: 15
  },
  {
    id: 8,
    title: 'Docker 容器化部署实战',
    summary: '学习如何使用 Docker 容器化你的应用，实现一次构建，到处运行的部署体验。',
    content: `# Docker 容器化部署实战

Docker 已经成为现代应用部署的标准工具。本文将介绍 Docker 的核心概念和实战技巧。

## 镜像与容器

镜像是只读的模板，容器是镜像的运行实例。

## Dockerfile 编写

学习如何编写高效的 Dockerfile。

## Docker Compose

使用 Docker Compose 编排多容器应用。`,
    cover: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
    tags: ['Docker', 'DevOps', '部署'],
    views: 2156,
    likes: 178,
    comments: 45,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-08',
    readTime: 12
  },
  {
    id: 9,
    title: 'Next.js 14 新特性详解',
    summary: '深入了解 Next.js 14 带来的 Server Actions、Partial Prerendering 等革命性特性。',
    content: `# Next.js 14 新特性详解

Next.js 14 带来了许多激动人心的新特性，让全栈开发更加便捷。

## Server Actions

直接在组件中编写服务端逻辑。

## Partial Prerendering

静态和动态内容的完美结合。

## Turbopack

新一代打包工具，速度提升 10 倍。`,
    cover: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
    tags: ['Next.js', 'React', '全栈'],
    views: 4523,
    likes: 312,
    comments: 98,
    createdAt: '2024-04-20',
    updatedAt: '2024-04-22',
    readTime: 10
  },
  {
    id: 10,
    title: 'Git 工作流最佳实践',
    summary: '掌握 Git 分支管理策略，团队协作更加高效顺畅。',
    content: `# Git 工作流最佳实践

良好的 Git 工作流是团队协作的基础。

## Git Flow

经典的分支管理模型。

## GitHub Flow

适合持续部署的简单工作流。

## Commit 规范

编写清晰的提交信息。`,
    cover: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
    tags: ['Git', '团队协作', '工具'],
    views: 3245,
    likes: 234,
    comments: 67,
    createdAt: '2024-05-15',
    updatedAt: '2024-05-16',
    readTime: 8
  },
  {
    id: 11,
    title: '前端性能监控与优化',
    summary: '建立完整的前端性能监控体系，持续优化用户体验。',
    content: `# 前端性能监控与优化

性能是用户体验的关键指标。

## Core Web Vitals

LCP、FID、CLS 三大核心指标。

## 性能监控

使用 Performance API 采集性能数据。

## 优化策略

代码分割、懒加载、缓存策略等。`,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tags: ['性能优化', '监控', '前端'],
    views: 2876,
    likes: 198,
    comments: 54,
    createdAt: '2024-06-01',
    updatedAt: '2024-06-03',
    readTime: 14
  },
  {
    id: 12,
    title: 'GraphQL 入门到精通',
    summary: '告别 REST API，拥抱 GraphQL 的灵活数据查询方式。',
    content: `# GraphQL 入门到精通

GraphQL 是 Facebook 开源的查询语言，让客户端精确获取所需数据。

## Schema 定义

类型系统是 GraphQL 的核心。

## Resolver

实现数据获取逻辑。

## 前端集成

使用 Apollo Client 管理状态。`,
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['GraphQL', 'API', '后端'],
    views: 1934,
    likes: 145,
    comments: 42,
    createdAt: '2024-06-10',
    updatedAt: '2024-06-12',
    readTime: 11
  }
]

// 标签数据
const tags: Tag[] = [
  { name: 'Vue 3', count: 12 },
  { name: 'React', count: 15 },
  { name: 'TypeScript', count: 18 },
  { name: 'JavaScript', count: 25 },
  { name: 'CSS', count: 10 },
  { name: 'Node.js', count: 8 },
  { name: '前端', count: 30 },
  { name: '性能优化', count: 6 },
  { name: '微服务', count: 4 },
  { name: 'WebAssembly', count: 3 },
  { name: '布局', count: 7 },
  { name: '后端', count: 5 },
  { name: '前沿技术', count: 9 }
]

// 归档数据
const archives: ArchiveItem[] = [
  { year: 2024, month: 6, count: 8 },
  { year: 2024, month: 5, count: 12 },
  { year: 2024, month: 4, count: 6 },
  { year: 2024, month: 3, count: 15 },
  { year: 2024, month: 2, count: 9 },
  { year: 2024, month: 1, count: 5 }
]

export const articleMocks = {
  // 获取文章列表
  getArticles: (config: any) => {
    const params = new URLSearchParams(config.url?.split('?')[1] || '')
    const page = parseInt(params.get('page') || '1')
    const pageSize = parseInt(params.get('pageSize') || '10')
    const tag = params.get('tag')

    let result = [...articles]

    // 按标签筛选
    if (tag) {
      result = result.filter(a => a.tags.includes(tag))
    }

    // 分页
    const total = result.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = result.slice(start, end)

    return [200, {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize
      }
    }]
  },

  // 获取单篇文章
  getArticleById: (config: any) => {
    const id = parseInt(config.url?.match(/\/articles\/(\d+)/)?.[1] || '0')
    const article = articles.find(a => a.id === id)

    if (article) {
      return [200, {
        code: 0,
        message: 'success',
        data: article
      }]
    }

    return [404, {
      code: 404,
      message: 'Article not found',
      data: null
    }]
  },

  // 获取标签列表
  getTags: () => {
    return [200, {
      code: 0,
      message: 'success',
      data: tags
    }]
  },

  // 获取归档数据
  getArchives: () => {
    return [200, {
      code: 0,
      message: 'success',
      data: archives
    }]
  },

  // 搜索文章
  searchArticles: (config: any) => {
    const params = new URLSearchParams(config.url?.split('?')[1] || '')
    const keyword = params.get('q')?.toLowerCase() || ''

    const result = articles.filter(a =>
      a.title.toLowerCase().includes(keyword) ||
      a.summary.toLowerCase().includes(keyword) ||
      a.tags.some(t => t.toLowerCase().includes(keyword))
    )

    return [200, {
      code: 0,
      message: 'success',
      data: result
    }]
  }
}
