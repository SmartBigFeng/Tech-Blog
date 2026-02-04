<template>
  <span class="typewriter-text">
    {{ displayText }}<span v-if="showCursor" class="cursor" :class="{ blinking: !isTyping }">|</span>
  </span>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

interface Props {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  loop?: boolean
  showCursor?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speed: 100,
  deleteSpeed: 50,
  pauseTime: 2000,
  loop: true,
  showCursor: true
})

const { displayText, isTyping, start, stop } = useTypewriter(props.texts, {
  speed: props.speed,
  deleteSpeed: props.deleteSpeed,
  pauseTime: props.pauseTime,
  loop: props.loop
})

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
</script>

<style scoped lang="scss">
.typewriter-text {
  font-family: var(--font-mono);
}

.cursor {
  color: var(--neon-cyan);
  font-weight: 300;

  &.blinking {
    animation: blink 1s step-end infinite;
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
