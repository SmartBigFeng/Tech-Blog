<template>
  <span class="count-up">{{ prefix }}{{ formattedValue }}{{ suffix }}</span>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCountUp } from '@/composables/useCountUp'

interface Props {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  startOnMount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  decimals: 0,
  prefix: '',
  suffix: '',
  startOnMount: true
})

const { formattedValue, animate } = useCountUp(props.value, {
  duration: props.duration,
  decimals: props.decimals,
  startOnMount: false
})

let hasAnimated = false

const startAnimation = () => {
  if (!hasAnimated) {
    hasAnimated = true
    setTimeout(animate, 100)
  }
}

onMounted(() => {
  if (props.startOnMount) {
    startAnimation()
  }
})

// 监听startOnMount的变化
watch(() => props.startOnMount, (newVal) => {
  if (newVal && !hasAnimated) {
    startAnimation()
  }
})

// 监听value的变化，当值变化时重置并重新播放动画
watch(() => props.value, () => {
  hasAnimated = false
  if (props.startOnMount) {
    startAnimation()
  }
})

// 暴露方法供父组件调用
defineExpose({
  animate,
  reset: () => {
    hasAnimated = false
  }
})
</script>

<style scoped lang="scss">
.count-up {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}
</style>
