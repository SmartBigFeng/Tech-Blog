import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

interface VisitorInfo {
  id: string
  fingerprint: string
  ip?: string
  userAgent: string
  screen: string
  timezone: string
  language: string
  firstVisit: string
  lastVisit: string
  visitCount: number
}

// 生成浏览器指纹
function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    navigator.hardwareConcurrency || '',
    navigator.platform || '',
  ]

  const str = components.join('###')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).substring(0, 12)
}

// 获取 IP 地址
async function getIpAddress(): Promise<string | null> {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  } catch {
    return null
  }
}

// 生成访客 ID
function generateVisitorId(fingerprint: string, ip: string | null): string {
  const base = ip ? `${fingerprint}-${ip}` : fingerprint
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `visitor_${Math.abs(hash).toString(16).substring(0, 16)}`
}

export function useVisitor() {
  const visitorInfo = useStorage<VisitorInfo>('visitor-info', {
    id: '',
    fingerprint: '',
    ip: undefined,
    userAgent: '',
    screen: '',
    timezone: '',
    language: '',
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
    visitCount: 0,
  })

  const isReady = ref(false)

  async function initVisitor() {
    // 如果已经有 ID，只更新访问时间和计数
    if (visitorInfo.value.id) {
      visitorInfo.value.lastVisit = new Date().toISOString()
      visitorInfo.value.visitCount++
      isReady.value = true
      return
    }

    // 首次访问，生成完整信息
    const fingerprint = generateFingerprint()
    const ip = await getIpAddress()
    const visitorId = generateVisitorId(fingerprint, ip)

    visitorInfo.value = {
      id: visitorId,
      fingerprint,
      ip: ip || undefined,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitCount: 1,
    }

    isReady.value = true
  }

  onMounted(() => {
    initVisitor()
  })

  return {
    visitorId: computed(() => visitorInfo.value.id),
    visitorInfo: computed(() => visitorInfo.value),
    isReady: computed(() => isReady.value),
    initVisitor,
  }
}
