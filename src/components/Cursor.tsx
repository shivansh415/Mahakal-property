'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(true)

  useEffect(() => {
    // Detect touch device — hide custom cursor on mobile/tablet
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(isTouchDevice)
    if (isTouchDevice) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Track mouse position
    const onMouseMove = (e: MouseEvent) => {
      // Dot follows instantly
      gsap.to(dot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: 'power2.out',
      })
      // Ring lags behind
      gsap.to(ring, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.35,
        ease: 'power2.out',
      })
    }

    // Hover states
    const onMouseEnterLink = () => {
      ring.classList.add('hover-link')
      gsap.to(dot, { scale: 0, duration: 0.2 })
      gsap.to(ring, {
        x: `+=−10`,
        y: `+=−10`,
        duration: 0.3,
      })
    }

    const onMouseLeaveLink = () => {
      ring.classList.remove('hover-link')
      ring.classList.remove('hover-button')
      gsap.to(dot, { scale: 1, duration: 0.2 })
    }

    const onMouseEnterButton = () => {
      ring.classList.add('hover-button')
      gsap.to(dot, { scale: 0.5, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMouseMove)

    // Attach hover listeners to interactive elements
    const links = document.querySelectorAll('a, [data-cursor="link"]')
    const buttons = document.querySelectorAll(
      'button, [data-cursor="button"], .btn-gold-outline, .btn-gold-fill'
    )

    links.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink)
      el.addEventListener('mouseleave', onMouseLeaveLink)
    })

    buttons.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterButton)
      el.addEventListener('mouseleave', onMouseLeaveLink)
    })

    // Hide cursor when leaving window
    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    }
    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 })
    }

    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      links.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink)
        el.removeEventListener('mouseleave', onMouseLeaveLink)
      })
      buttons.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterButton)
        el.removeEventListener('mouseleave', onMouseLeaveLink)
      })
    }
  }, [isTouch])

  // Don't render on touch devices
  if (isTouch) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}
