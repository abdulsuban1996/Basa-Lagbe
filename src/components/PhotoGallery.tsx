'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface PhotoGalleryProps {
  photos: string[]
  title: string
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-gray-100 md:h-96">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Camera className="h-12 w-12" />
          <p className="text-sm">কোনো ছবি নেই</p>
        </div>
      </div>
    )
  }

  const prev = () => {
    setDirection(-1)
    setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
  }

  const next = () => {
    setDirection(1)
    setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1))
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.96,
    }),
  }

  return (
    <div className="space-y-3">
      {/* Main image carousel */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-gray-900 md:h-108 shadow-md">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 320, damping: 30 },
              opacity: { duration: 0.25 },
            }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={photos[currentIndex]}
              alt={`${title} - ছবি ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Counter pill */}
        <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 backdrop-blur-xs px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Arrows */}
        {photos.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 backdrop-blur-xs p-2.5 text-white hover:bg-black/75 transition-colors cursor-pointer shadow-md"
              aria-label="আগের ছবি"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 backdrop-blur-xs p-2.5 text-white hover:bg-black/75 transition-colors cursor-pointer shadow-md"
              aria-label="পরের ছবি"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {photos.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {photos.map((photo, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={cn(
                'relative h-18 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer shadow-xs',
                index === currentIndex ? 'border-slate-ocean ring-2 ring-slate-ocean/30' : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={photo}
                alt={`থাম্বনেইল ${index + 1}`}
                fill
                className="object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
