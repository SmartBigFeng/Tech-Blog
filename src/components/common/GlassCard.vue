<template>
  <div
    ref="cardRef"
    class="glass-card"
    :class="{
      'is-hovering': isHovering,
      [`glow-${glowColor}`]: glowColor
    }"
    :style="cardStyle"
  >
    <slot />
    <div v-if="isHovering" class="glow-effect" :style="glowStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMouseGlow } from '@/composables/useMouseGlow'

interface Props {
  glowColor?: 'cyan' | 'purple' | 'pink' | 'mint'
  enableMouseGlow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  glowColor: 'cyan',
  enableMouseGlow: true
})

const { cardRef, glowPosition, isHovering } = useMouseGlow()

const cardStyle = computed(() => ({
  '--mouse-x': `${glowPosition.value.x}px`,
  '--mouse-y': `${glowPosition.value.y}px`
}))

const glowStyle = computed(() => {
  if (!props.enableMouseGlow) return {}
  return {
    background: `radial-gradient(300px circle at ${glowPosition.value.x}px ${glowPosition.value.y}px, rgba(255,255,255,0.15), transparent 60%)`
  }
})
</script>

<style scoped lang="scss">
.glass-card {
  position: relative;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, var(--border-color), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .glow-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.is-hovering {
    transform: translateY(-4px);

    .glow-effect {
      opacity: 1;
    }
  }

  &.glow-cyan:hover {
    box-shadow: var(--shadow-glow-cyan);
    border-color: var(--neon-cyan-glow);
  }

  &.glow-purple:hover {
    box-shadow: var(--shadow-glow-purple);
    border-color: var(--neon-purple-glow);
  }

  &.glow-pink:hover {
    box-shadow: var(--shadow-glow-pink);
    border-color: var(--neon-pink-glow);
  }

  &.glow-mint:hover {
    box-shadow: 0 0 30px var(--neon-mint-glow), 0 0 60px var(--neon-mint-glow);
    border-color: var(--neon-mint-glow);
  }
}
</style>
