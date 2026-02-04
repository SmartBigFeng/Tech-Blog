<template>
  <div class="grid-background">
    <div class="grid-lines"></div>
    <div class="grid-glow"></div>
  </div>
</template>

<script setup lang="ts">
// 动态网格背景组件
</script>

<style scoped lang="scss">
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image:
    linear-gradient(rgba(8, 145, 178, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(8, 145, 178, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  animation: gridMove 20s linear infinite;
}

.grid-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(8, 145, 178, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(185, 103, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 113, 206, 0.05) 0%, transparent 60%);
}

@keyframes gridMove {
  0% {
    transform: perspective(500px) rotateX(60deg) translateY(0);
  }
  100% {
    transform: perspective(500px) rotateX(60deg) translateY(50px);
  }
}
</style>
