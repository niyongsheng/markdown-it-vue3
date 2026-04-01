export const on = (element, event, handler) => {
  element?.addEventListener(event, handler, false)
}

export const off = (element, event, handler) => {
  element?.removeEventListener(event, handler, false)
}

export function rafThrottle(fn) {
  let locked = false
  return function (...args) {
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}

export const isFirefox = /firefox/i.test(typeof window !== 'undefined' ? window.navigator.userAgent : '')