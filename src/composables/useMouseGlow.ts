import { ref, onMounted, onUnmounted } from 'vue'

export function useMouseGlow() {
  const cardRef = ref<HTMLElement | null>(null)
  const glowPosition = ref({ x: 0, y: 0 })
  const isHovering = ref(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.value) return

    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    glowPosition.value = { x, y }
  }

  const handleMouseEnter = () => {
    isHovering.value = true
  }

  const handleMouseLeave = () => {
    isHovering.value = false
  }

  onMounted(() => {
    if (!cardRef.value) return

    cardRef.value.addEventListener('mousemove', handleMouseMove)
    cardRef.value.addEventListener('mouseenter', handleMouseEnter)
    cardRef.value.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    if (!cardRef.value) return

    cardRef.value.removeEventListener('mousemove', handleMouseMove)
    cardRef.value.removeEventListener('mouseenter', handleMouseEnter)
    cardRef.value.removeEventListener('mouseleave', handleMouseLeave)
  })

  return {
    cardRef,
    glowPosition,
    isHovering
  }
}
