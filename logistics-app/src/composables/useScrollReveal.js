/**
 * useScrollReveal.js
 * GSAP + IntersectionObserver : fade-in sections & stagger children
 */
import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

/* ── Single element fade-in ─────────────────────────────────────── */
export function useScrollReveal(targets, opts = {}) {
  const { y = 36, duration = 0.72, delay = 0 } = opts
  const observers = []

  onMounted(() => {
    const els = (Array.isArray(targets) ? targets : [targets])
      .map(t => t?.value)
      .filter(Boolean)

    for (const el of els) {
      gsap.set(el, { opacity: 0, y })
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: 'power3.out' })
          obs.unobserve(el)
        },
        { threshold: 0.08 }
      )
      obs.observe(el)
      observers.push(obs)
    }
  })

  onBeforeUnmount(() => observers.forEach(o => o.disconnect()))
}

/* ── Stagger children inside a container ────────────────────────── */
export function useStaggerReveal(containerRef, selector = '.anim-child', opts = {}) {
  const { y = 28, duration = 0.65, stagger = 0.09 } = opts
  const observers = []

  onMounted(() => {
    const el = containerRef?.value
    if (!el) return
    const children = el.querySelectorAll(selector)
    if (!children.length) return

    gsap.set(children, { opacity: 0, y })

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        gsap.to(children, { opacity: 1, y: 0, duration, stagger, ease: 'power3.out' })
        obs.unobserve(el)
      },
      { threshold: 0.05 }
    )
    obs.observe(el)
    observers.push(obs)
  })

  onBeforeUnmount(() => observers.forEach(o => o.disconnect()))
}

/* ── Counter animation (number rolling) ─────────────────────────── */
export function useCountUp(refVal, target, duration = 1.2) {
  const obj = { n: 0 }
  gsap.to(obj, {
    n: target,
    duration,
    ease: 'power2.out',
    onUpdate() { refVal.value = Math.round(obj.n) },
    onComplete() { refVal.value = target },
  })
}
