'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence, HTMLMotionProps, TargetAndTransition } from 'motion/react'

interface MotionFadeProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export function MotionFade({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
  ...props
}: MotionFadeProps) {
  const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
    none: { x: 0, y: 0 },
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionStaggerContainer({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.1,
  className = '',
}: {
  children: ReactNode
  staggerChildren?: number
  delayChildren?: number
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionScale({
  children,
  className = '',
  whileHover = { scale: 1.03 },
  whileTap = { scale: 0.97 },
}: {
  children: ReactNode
  className?: string
  whileHover?: TargetAndTransition
  whileTap?: TargetAndTransition
}) {
  return (
    <motion.div
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { AnimatePresence, motion }
