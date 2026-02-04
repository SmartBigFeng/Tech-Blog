import { onMounted, onUnmounted } from 'vue'

export function useShortcut(
  keyCombo: string,
  callback: () => void,
  options: {
    preventDefault?: boolean
  } = {}
) {
  const { preventDefault = true } = options

  const parseKeyCombo = (combo: string) => {
    const keys = combo.toLowerCase().split('+').map(k => k.trim())
    return {
      ctrl: keys.includes('ctrl'),
      alt: keys.includes('alt'),
      shift: keys.includes('shift'),
      meta: keys.includes('meta') || keys.includes('cmd') || keys.includes('command'),
      key: keys.find(k => !['ctrl', 'alt', 'shift', 'meta', 'cmd', 'command'].includes(k)) || ''
    }
  }

  const combo = parseKeyCombo(keyCombo)

  const handleKeyDown = (e: KeyboardEvent) => {
    const ctrlPressed = e.ctrlKey || e.metaKey
    const altPressed = e.altKey
    const shiftPressed = e.shiftKey

    const matchCtrl = combo.ctrl === ctrlPressed
    const matchAlt = combo.alt === altPressed
    const matchShift = combo.shift === shiftPressed
    const matchKey = e.key.toLowerCase() === combo.key

    if (matchCtrl && matchAlt && matchShift && matchKey) {
      if (preventDefault) {
        e.preventDefault()
      }
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    unregister: () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }
}
