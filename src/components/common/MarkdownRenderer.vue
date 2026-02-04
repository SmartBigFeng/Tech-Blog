<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface Props {
  content: string
}

const props = defineProps<Props>()

// 使用 ref 来存储 markdown 实例和内容
const md = ref<any>(null)
const hljsRef = ref<any>(null)
const isClient = ref(false)

onMounted(async () => {
  // 动态导入，确保只在客户端执行
  const MarkdownIt = (await import('markdown-it')).default
  const hljs = (await import('highlight.js/lib/core')).default

  hljsRef.value = hljs
  isClient.value = true

  // 动态导入样式
  await import('highlight.js/styles/atom-one-dark.css')

  md.value = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str: string, lang: string) => {
      if (lang && hljsRef.value?.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code class="language-${lang}">${
            hljsRef.value.highlight(str, { language: lang }).value
          }</code></pre>`
        } catch (__) {}
      }
      return `<pre class="hljs"><code>${md.value.utils.escapeHtml(str)}</code></pre>`
    }
  })
})

const renderedContent = computed(() => {
  if (!isClient.value || !md.value) {
    // 服务端或加载中时，返回纯文本转换的简单 HTML
    return props.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  }
  return md.value.render(props.content)
})
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.scss";

.markdown-body {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 16px;

  :deep(h1) {
    font-size: 2em;
    margin: 1.5em 0 0.5em;
    color: var(--neon-cyan);
    text-shadow: 0 0 10px var(--neon-cyan-glow);

    &:first-child {
      margin-top: 0;
    }
  }

  :deep(h2) {
    font-size: 1.5em;
    margin: 1.5em 0 0.5em;
    color: #B967FF;
    border-bottom: 1px solid rgba(185, 103, 255, 0.3);
    padding-bottom: 0.3em;
  }

  :deep(h3) {
    font-size: 1.25em;
    margin: 1.5em 0 0.5em;
    color: #FF71CE;
  }

  :deep(p) {
    margin: 1em 0;
  }

  :deep(pre) {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1em;
    overflow-x: auto;
    margin: 1em 0;

    code {
      background: none;
      padding: 0;
      border-radius: 0;
    }
  }

  :deep(code) {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--neon-cyan-glow);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    color: var(--neon-cyan);
  }

  :deep(ul), :deep(ol) {
    margin: 1em 0;
    padding-left: 2em;

    li {
      margin: 0.5em 0;
    }
  }

  :deep(a) {
    color: var(--neon-cyan);
    text-decoration: none;
    border-bottom: 1px solid var(--neon-cyan-glow);
    transition: all 0.3s ease;

    &:hover {
      border-bottom-color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
    }
  }

  :deep(blockquote) {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid #B967FF;
    background: rgba(185, 103, 255, 0.1);
    border-radius: 0 8px 8px 0;

    p {
      margin: 0;
    }
  }

  :deep(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    margin: 2em 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;

    th, td {
      padding: 0.75em;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: left;
    }

    th {
      background: var(--neon-cyan-glow);
      color: var(--neon-cyan);
    }

    tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.02);
    }
  }
}
</style>
