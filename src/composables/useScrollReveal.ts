import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(
  options: {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (triggerOnce && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            isVisible.value = false
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    elementRef,
    isVisible
  }
}

// 批量滚动动画
export function useBatchReveal(
  selector: string,
  options: {
    stagger?: number
    baseDelay?: number
  } = {}
) {
  const { stagger = 100, baseDelay = 0 } = options
  const revealedElements = ref<Set<Element>>(new Set())

  let observer: IntersectionObserver | null = null

  const init = () => {
    const elements = document.querySelectorAll(selector)

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target
            if (!revealedElements.value.has(element)) {
              const index = Array.from(elements).indexOf(element)
              const delay = baseDelay + index * stagger

              setTimeout(() => {
                element.classList.add('revealed')
                revealedElements.value.add(element)
              }, delay)

              if (observer) {
                observer.unobserve(element)
              }
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    elements.forEach((el) => {
      el.classList.add('reveal')
      observer?.observe(el)
    })
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    revealedElements
  }
}
