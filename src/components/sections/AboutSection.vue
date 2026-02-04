<template>
  <section id="about" class="about-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-number">02.</span>
          关于
        </h2>
        <p class="section-subtitle">了解更多关于我的信息</p>
      </div>

      <!-- Bento Grid 布局 -->
      <div class="bento-grid">
        <!-- 左侧：个人信息 + 开源项目 -->
        <div class="bento-left">
          <!-- 个人信息 -->
          <div class="profile-card glass-card">
            <div class="profile-row">
              <div class="profile-left">
                <div class="avatar-wrap">
                  <img :src="user?.avatar" alt="avatar" />
                  <div class="status-dot"></div>
                </div>
                <div class="profile-text">
                  <h2 class="name">{{ user?.name }}</h2>
                  <p class="role">{{ user?.role }}</p>
                  <div class="social-bar">
                    <a v-for="(link, platform) in user?.social" :key="platform" :href="link" target="_blank" rel="noopener" class="social-btn">
                      <github-icon v-if="platform === 'github'" class="icon-sm" />
                      <juejin-icon v-else-if="platform === 'juejin'" class="icon-sm" />
                      <el-icon v-else><Message /></el-icon>
                    </a>
                  </div>
                </div>
              </div>
              <div class="stats-bar">
                <div class="stat-box" v-for="(value, key) in user?.stats" :key="key">
                  <span class="stat-value">{{ formatNumber(value) }}</span>
                  <span class="stat-label">{{ getStatLabel(key) }}</span>
                </div>
              </div>
            </div>
            <p class="bio-text">{{ user?.bio }}</p>
          </div>

          <!-- 开源项目 -->
          <div class="projects-card glass-card">
            <div class="card-head">
              <el-icon class="head-icon project"><FolderOpened /></el-icon>
              <span>开源项目</span>
            </div>
            <div class="project-list">
              <a v-for="(proj, idx) in projects" :key="idx" :href="proj.url" target="_blank" class="project-item">
                <div class="project-icon" :class="proj.color">
                  <el-icon><component :is="proj.icon" /></el-icon>
                </div>
                <div class="project-info">
                  <h4>{{ proj.name }}</h4>
                  <p>{{ proj.desc }}</p>
                </div>
                <div class="project-stars">
                  <el-icon><Star /></el-icon>
                  <span>{{ proj.stars }}</span>
                </div>
              </a>
            </div>
          </div>

          <!-- 技术栈 -->
          <div class="techstack-card glass-card">
            <div class="card-head">
              <el-icon class="head-icon tech"><Cpu /></el-icon>
              <span>技术栈</span>
            </div>
            <div class="techstack-grid">
              <div class="techstack-item" v-for="(tech, idx) in techStack" :key="idx">
                <div class="tech-icon" :class="tech.color">
                  <el-icon><component :is="tech.icon" /></el-icon>
                </div>
                <div class="tech-info">
                  <span class="tech-name">{{ tech.name }}</span>
                  <span class="tech-level">{{ tech.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：技能 + 标签 + 热门 + 时间线 + 归档 + 技术栈 -->
        <div class="bento-skills glass-card">
          <div class="card-head">
            <el-icon class="head-icon skill"><Aim /></el-icon>
            <span>技能分布</span>
          </div>
          <div class="skills-chart">
            <div class="skill-bar" v-for="(skill, idx) in skills" :key="idx">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-progress">
                <span :style="{ width: skill.level + '%' }"></span>
              </div>
              <span class="skill-level">{{ skill.level }}%</span>
            </div>
          </div>
        </div>

        <!-- 标签云 -->
        <div class="bento-tags glass-card">
          <div class="card-head">
            <el-icon class="head-icon tag"><CollectionTag /></el-icon>
            <span>标签云</span>
          </div>
          <div class="tag-flow">
            <span v-for="tag in displayTags.slice(0, 16)" :key="tag.name" class="tag-pill" @click.stop="filterByTag(tag.name)">
              {{ tag.name }}
            </span>
          </div>
        </div>

        <!-- 热门文章 -->
        <div class="bento-hot glass-card">
          <div class="card-head">
            <el-icon class="head-icon fire"><FireFilled /></el-icon>
            <span>热门文章</span>
          </div>
          <ul class="hot-list">
            <li v-for="(article, idx) in hotArticles.slice(0, 10)" :key="article.id" @click.stop="goToArticle(article.id)">
              <span class="rank" :class="`rank-${idx + 1}`">{{ idx + 1 }}</span>
              <span class="hot-title">{{ article.title }}</span>
            </li>
          </ul>
        </div>

        <!-- 最新动态 -->
        <div class="bento-timeline glass-card">
          <div class="card-head">
            <el-icon class="head-icon timeline"><Clock /></el-icon>
            <span>最新动态</span>
          </div>
          <div class="timeline-list">
            <div class="timeline-item" v-for="(item, idx) in timeline" :key="idx">
              <div class="timeline-dot" :class="item.type"></div>
              <div class="timeline-info">
                <p class="timeline-text">{{ item.text }}</p>
                <span class="timeline-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章归档 -->
        <div class="bento-archive glass-card">
          <div class="card-head">
            <el-icon class="head-icon archive"><Calendar /></el-icon>
            <span>文章归档</span>
          </div>
          <div class="archive-list">
            <div v-for="arc in displayArchives.slice(0, 6)" :key="arc.value" class="arc-item" @click="goToArchive(arc)">
              <span class="arc-date">{{ arc.label }}</span>
              <div class="arc-bar"><span :style="{ width: getArchivePercent(arc.count) + '%' }"></span></div>
              <span class="arc-count">{{ arc.count }}篇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArticleStore } from '@/stores/article'
import { useAppStore } from '@/stores/app'
import JuejinIcon from '@/components/icons/JuejinIcon.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'

const router = useRouter()
const userStore = useUserStore()
const articleStore = useArticleStore()
const appStore = useAppStore()

const user = computed(() => userStore.user)
const hotArticles = computed(() => articleStore.hotArticles)
const displayTags = computed(() => articleStore.sortedTags)
const displayArchives = computed(() => articleStore.formattedArchives)

const skills = [
  { name: 'Vue.js', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Node.js', level: 85 },
  { name: 'React', level: 80 },
  { name: 'Python', level: 75 },
]

const timeline = [
  { type: 'article', text: '发布了《深入理解 Vue 3 Composition API》', time: '3天前' },
  { type: 'project', text: '开源项目 tech-blog 获得 100+ Stars', time: '1周前' },
  { type: 'share', text: '分享了 TypeScript 高级类型技巧', time: '2周前' },
  { type: 'update', text: '更新了博客主题样式', time: '1个月前' },
]

const projects = [
  { name: 'tech-blog', desc: '个人技术博客系统', stars: '128', url: '#', color: 'cyan', icon: 'Document' },
  { name: 'vue-hooks', desc: 'Vue Composition 工具库', stars: '86', url: '#', color: 'purple', icon: 'Connection' },
  { name: 'cli-tool', desc: '前端脚手架工具', stars: '64', url: '#', color: 'green', icon: 'Tools' },
]

const techStack = [
  { name: 'Vue.js', level: '精通', color: 'green', icon: 'CircleCheck' },
  { name: 'React', level: '熟练', color: 'cyan', icon: 'CircleCheck' },
  { name: 'TypeScript', level: '精通', color: 'blue', icon: 'CircleCheck' },
  { name: 'Node.js', level: '熟练', color: 'green', icon: 'CircleCheck' },
  { name: 'Docker', level: '了解', color: 'purple', icon: 'CircleCheck' },
  { name: 'K8s', level: '了解', color: 'purple', icon: 'CircleCheck' },
]

const getStatLabel = (key: string) => {
  const map: Record<string, string> = { articles: '文章', views: '浏览', likes: '点赞', comments: '评论' }
  return map[key] || key
}

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const goToArticle = (id: number) => router.push(`/article/${id}`)
const filterByTag = (tag: string) => router.push({ path: '/', query: { tag } })
const goToArchive = (arc: any) => router.push({ path: '/archive', query: { month: arc.value } })

const maxCount = computed(() => Math.max(...displayArchives.value.map(a => a.count), 1))
const getArchivePercent = (c: number) => (c / maxCount.value) * 100
</script>

<style scoped lang="scss">
.about-section {
  padding: 0 0 20px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    height: auto;
    min-height: calc(100vh - 70px);
  }

  @media (max-width: 768px) {
    padding: 100px 0 40px;
    height: auto;
    min-height: auto;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;

  .title-number {
    color: var(--neon-cyan);
    font-family: var(--font-mono);
    margin-right: 8px;
  }
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

// Bento Grid 布局
.bento-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  grid-template-rows: minmax(100px, auto) minmax(100px, auto) minmax(100px, auto);
  gap: 10px;
  grid-template-areas:
    "left skills tags"
    "left hot timeline"
    "left hot archive";

  @media (max-width: 1200px) {
    grid-template-columns: 1.2fr 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "left skills"
      "left tags"
      "hot timeline"
      "projects archive";
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "left"
      "skills"
      "tags"
      "hot"
      "timeline"
      "projects"
      "archive";
    gap: 16px;
  }
}

.glass-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--neon-cyan-glow);
    background: rgba(30, 41, 59, 0.6);
  }
}

// 左侧区域
.bento-left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;

  > * {
    min-height: 0;
  }
}

// 个人信息卡片 - 紧凑
.profile-card {
  padding: 8px 16px;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-wrap {
  position: relative;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--neon-cyan);
  }

  .status-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background: #05FFA1;
    border-radius: 50%;
    border: 2px solid rgba(30, 41, 59, 1);
    box-shadow: 0 0 6px #05FFA1;
  }
}

.profile-text {
  .name {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .role {
    font-size: 12px;
    color: var(--neon-cyan);
    font-family: var(--font-mono);
    margin: 2px 0 8px;
  }
}

.social-bar {
  display: flex;
  gap: 6px;

  .social-btn {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 12px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background: var(--neon-cyan-glow);
      border-color: var(--neon-cyan);
      color: var(--neon-cyan);
    }

    .icon-sm {
      width: 13px;
      height: 13px;
    }
  }
}

.stats-bar {
  display: flex;
  gap: 20px;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 640px) {
    border-left: none;
    padding-left: 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    width: 100%;
    justify-content: space-around;
  }
}

.stat-box {
  text-align: center;

  .stat-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: var(--neon-cyan);
    font-family: var(--font-mono);
    line-height: 1;
  }

  .stat-label {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.bio-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-line;
}

// 开源项目
.projects-card {
  flex: 1;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

// 技术栈
.techstack-card {
  flex: 1;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.techstack-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  flex: 1;
  align-content: center;
}

.techstack-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
}

.tech-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &.cyan {
    background: var(--neon-cyan-glow);
    color: var(--neon-cyan);
  }

  &.purple {
    background: rgba(185, 103, 255, 0.1);
    color: #B967FF;
  }

  &.green {
    background: rgba(5, 255, 161, 0.1);
    color: #05FFA1;
  }

  &.blue {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
  }
}

.tech-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .tech-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .tech-level {
    font-size: 11px;
    color: var(--text-muted);
  }
}

.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;

  .head-icon {
    font-size: 16px;

    &.fire { color: var(--neon-pink); }
    &.tag { color: var(--neon-purple); }
    &.tech { color: var(--neon-cyan); }
    &.archive { color: #05FFA1; }
    &.skill { color: #FFD700; }
    &.timeline { color: #FF6B6B; }
    &.project { color: #4ECDC4; }
  }
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow: hidden;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &.cyan {
    background: var(--neon-cyan-glow);
    color: var(--neon-cyan);
  }

  &.purple {
    background: rgba(185, 103, 255, 0.1);
    color: #B967FF;
  }

  &.green {
    background: rgba(5, 255, 161, 0.1);
    color: #05FFA1;
  }
}

.project-info {
  flex: 1;

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  p {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.project-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);

  .el-icon {
    color: #FFD700;
  }
}

// 技能分布
.bento-skills {
  grid-area: skills;
}

.skills-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-bar {
  display: flex;
  align-items: center;
  gap: 10px;

  .skill-name {
    font-size: 12px;
    color: var(--text-secondary);
    width: 70px;
    flex-shrink: 0;
  }

  .skill-progress {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    overflow: hidden;

    span {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--neon-cyan), #B967FF);
      border-radius: 3px;
      transition: width 0.5s ease;
    }
  }

  .skill-level {
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    width: 36px;
    text-align: right;
  }
}

// 标签云
.bento-tags {
  grid-area: tags;
}

.tag-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  padding: 5px 12px;
  background: rgba(185, 103, 255, 0.1);
  border: 1px solid rgba(185, 103, 255, 0.2);
  border-radius: 14px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(185, 103, 255, 0.2);
    border-color: rgba(185, 103, 255, 0.4);
    color: #B967FF;
    transform: scale(1.05);
  }
}

// 热门文章
.bento-hot {
  grid-area: hot;
}

.hot-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 4px 0;

    &:hover .hot-title {
      color: #FF71CE;
    }
  }
}

.rank {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  flex-shrink: 0;

  &.rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; }
  &.rank-2 { background: linear-gradient(135deg, #C0C0C0, #808080); color: #000; }
  &.rank-3 { background: linear-gradient(135deg, #CD7F32, #8B4513); color: #fff; }
  &:not(.rank-1):not(.rank-2):not(.rank-3) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
  }
}

.hot-title {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

// 时间线
.bento-timeline {
  grid-area: timeline;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;

  &.article { background: var(--neon-cyan); box-shadow: 0 0 6px var(--neon-cyan); }
  &.project { background: #FF71CE; box-shadow: 0 0 6px rgba(255, 113, 206, 0.5); }
  &.share { background: #B967FF; box-shadow: 0 0 6px rgba(185, 103, 255, 0.5); }
  &.update { background: #05FFA1; box-shadow: 0 0 6px rgba(5, 255, 161, 0.5); }
}

.timeline-info {
  flex: 1;
}

.timeline-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 2px;
}

.timeline-time {
  font-size: 11px;
  color: var(--text-muted);
}

// 归档
.bento-archive {
  grid-area: archive;
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.arc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    .arc-date { color: #05FFA1; }
    .arc-bar span { background: #05FFA1; }
  }
}

.arc-date {
  font-size: 12px;
  color: var(--text-secondary);
  width: 64px;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.arc-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: rgba(5, 255, 161, 0.5);
    border-radius: 2px;
    transition: all 0.2s ease;
  }
}

.arc-count {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  width: 40px;
  text-align: right;
}
</style>