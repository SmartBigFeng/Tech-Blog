<template>
  <canvas ref="canvasRef" class="particle-background"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null

// 粒子配置
const config = {
  particleCount: 50,
  connectionDistance: 150,
  maxConnections: 3,
  speed: 0.5,
  size: 2
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

let particles: Particle[] = []

const initParticles = (width: number, height: number) => {
  particles = []
  for (let i = 0; i < config.particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      size: Math.random() * config.size + 1,
      alpha: Math.random() * 0.5 + 0.3
    })
  }
}

const drawParticles = () => {
  if (!ctx || !canvasRef.value) return

  const { width, height } = canvasRef.value
  ctx.clearRect(0, 0, width, height)

  // 获取主题色
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  const particleColor = isDark ? '0, 255, 255' : '13, 148, 136'

  // 更新和绘制粒子
  particles.forEach((particle, i) => {
    // 更新位置
    particle.x += particle.vx
    particle.y += particle.vy

    // 边界反弹
    if (particle.x < 0 || particle.x > width) particle.vx *= -1
    if (particle.y < 0 || particle.y > height) particle.vy *= -1

    // 绘制粒子
    ctx!.beginPath()
    ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx!.fillStyle = `rgba(${particleColor}, ${particle.alpha})`
    ctx!.fill()

    // 绘制连线
    let connections = 0
    for (let j = i + 1; j < particles.length; j++) {
      if (connections >= config.maxConnections) break

      const otherParticle = particles[j]
      if (!otherParticle) continue

      const dx = otherParticle.x - particle.x
      const dy = otherParticle.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < config.connectionDistance) {
        const alpha = (1 - distance / config.connectionDistance) * 0.3
        ctx!.beginPath()
        ctx!.moveTo(particle.x, particle.y)
        ctx!.lineTo(otherParticle.x, otherParticle.y)
        ctx!.strokeStyle = `rgba(${particleColor}, ${alpha})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()
        connections++
      }
    }
  })

  animationId = requestAnimationFrame(drawParticles)
}

const handleResize = () => {
  if (!canvasRef.value) return

  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
  initParticles(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  if (!canvasRef.value) return

  ctx = canvasRef.value.getContext('2d')
  handleResize()
  drawParticles()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
