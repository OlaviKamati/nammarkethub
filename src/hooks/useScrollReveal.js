import { useEffect, useRef } from 'react'

// Attaches an IntersectionObserver to a container ref.
// Any child with class "reveal" gets "visible" added when it enters the viewport.
// `deps` lets callers re-run the observer setup when content that wasn't
// there on mount appears later (e.g. items rendered only after an async
// fetch resolves) — otherwise querySelectorAll runs once against an
// empty/loading container and never finds the real elements.
export function useScrollReveal(threshold = 0.1, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold }
    )

    const targets = el.querySelectorAll('.reveal')
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, ...deps])

  return ref
}
