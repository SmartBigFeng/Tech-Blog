<template>
  <span
    class="neon-text"
    :class="`neon-${color}`"
    :style="{ fontSize: size }"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  color?: 'cyan' | 'purple' | 'pink' | 'mint' | 'gradient'
  size?: string
}

withDefaults(defineProps<Props>(), {
  color: 'cyan',
  size: 'inherit'
})
</script>

<style scoped lang="scss">
.neon-text {
  font-weight: 600;
  transition: all 0.3s ease;

  &.neon-cyan {
    color: var(--neon-cyan);
    text-shadow: var(--shadow-glow-cyan);
  }

  &.neon-purple {
    color: var(--neon-purple);
    text-shadow: var(--shadow-glow-purple);
  }

  &.neon-pink {
    color: var(--neon-pink);
    text-shadow: var(--shadow-glow-pink);
  }

  &.neon-mint {
    color: var(--neon-mint);
    text-shadow:
      0 0 5px var(--neon-mint-glow),
      0 0 10px var(--neon-mint-glow),
      0 0 20px var(--neon-mint-glow),
      0 0 40px var(--neon-mint-glow);
  }

  &.neon-gradient {
    background: var(--gradient-cyber);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 10px var(--neon-cyan-glow));
  }
}
</style>
