import { ref, computed, onMounted, watch } from 'vue'

export function useCountUp(
  targetValue: number,
  options: {
    duration?: number
    startOnMount?: boolean
    decimals?: number
  } = {}
) {
  const {
    duration = 2000,
    startOnMount = false,
    decimals = 0
  } = options

  const currentValue = ref(0)
  const isAnimating = ref(false)
  const hasAnimated = ref(false)

  const animate = () => {
    if (isAnimating.value || hasAnimated.value) return

    isAnimating.value = true
    hasAnimated.value = true
    const startTime = performance.now()
    const startValue = 0

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (easeOutExpo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      currentValue.value = startValue + (targetValue - startValue) * easeOutExpo

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        currentValue.value = targetValue
        isAnimating.value = false
      }
    }

    requestAnimationFrame(step)
  }

  const formattedValue = computed(() => {
    return currentValue.value.toFixed(decimals)
  })

  onMounted(() => {
    if (startOnMount) {
      animate()
    }
  })

  // 监听目标值变化，重置动画状态
  watch(() => targetValue, (newValue) => {
    // 重置动画状态
    hasAnimated.value = false
    currentValue.value = 0
    // 如果配置了自动开始，则重新播放动画
    if (startOnMount) {
      animate()
    }
  })

  return {
    currentValue,
    formattedValue,
    isAnimating,
    hasAnimated,
    animate
  }
}
