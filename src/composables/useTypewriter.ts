import { ref, computed } from 'vue'

export function useTypewriter(texts: string[], options: {
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  loop?: boolean
} = {}) {
  const {
    speed = 100,
    deleteSpeed = 50,
    pauseTime = 2000,
    loop = true
  } = options

  const currentText = ref('')
  const currentIndex = ref(0)
  const isTyping = ref(true)
  const isDeleting = ref(false)

  const displayText = computed(() => currentText.value)
  const isComplete = computed(() => !isTyping.value && !isDeleting.value)

  let timeout: ReturnType<typeof setTimeout> | null = null

  const type = () => {
    const fullText = texts[currentIndex.value]
    if (!fullText) return

    if (isDeleting.value) {
      currentText.value = fullText.substring(0, currentText.value.length - 1)

      if (currentText.value === '') {
        isDeleting.value = false
        isTyping.value = true
        currentIndex.value = (currentIndex.value + 1) % texts.length

        if (!loop && currentIndex.value === 0) {
          return
        }

        timeout = setTimeout(type, 500)
      } else {
        timeout = setTimeout(type, deleteSpeed)
      }
    } else {
      currentText.value = fullText.substring(0, currentText.value.length + 1)

      if (currentText.value === fullText) {
        isTyping.value = false
        isDeleting.value = true
        timeout = setTimeout(type, pauseTime)
      } else {
        timeout = setTimeout(type, speed)
      }
    }
  }

  const start = () => {
    if (timeout) clearTimeout(timeout)
    currentText.value = ''
    currentIndex.value = 0
    isTyping.value = true
    isDeleting.value = false
    type()
  }

  const stop = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return {
    displayText,
    isComplete,
    isTyping,
    isDeleting,
    start,
    stop
  }
}
