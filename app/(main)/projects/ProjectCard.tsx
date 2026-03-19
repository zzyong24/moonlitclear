'use client'

import {
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'
import { motion } from 'framer-motion'
import React from 'react'

import { ExternalLinkIcon } from '~/assets'
import { Card } from '~/components/ui/Card'

interface Project {
  _id: string
  name: string
  url: string
  description: string
  icon: string
  tags?: string[]
  status?: 'active' | 'building' | 'planning'
}

/** 项目状态对应的标签样式和文案 */
const statusConfig = {
  active: { label: '运行中', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  building: { label: '开发中', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  planning: { label: '规划中', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
} as const

export function ProjectCard({ project }: { project: Project }) {
  const { _id, url, name, description, icon, tags, status } = project

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2)
    },
    [mouseX, mouseY, radius]
  )
  const maskBackground = useMotionTemplate`radial-gradient(circle ${radius}px at ${mouseX}px ${mouseY}px, black 40%, transparent)`
  const [isHovering, setIsHovering] = React.useState(false)

  return (
    <Card
      as="li"
      key={_id}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <span className="text-2xl" role="img" aria-label={name}>
          {icon || name.slice(0, 1)}
        </span>
      </div>
      <h2 className="mt-6 text-base font-bold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={url} target="_blank">
          {name}
        </Card.Link>
      </h2>
      {/* 项目状态标签 */}
      {status && (
        <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[status].className}`}>
          {statusConfig[status].label}
        </span>
      )}
      <Card.Description>{description}</Card.Description>
      {/* 技术标签 */}
      {tags && tags.length > 0 && (
        <div className="relative z-40 mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="pointer-events-none relative z-40 mt-6 flex items-center text-sm font-medium text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:text-lime-600 dark:text-zinc-200 dark:group-hover:text-lime-400">
        <span className="mr-2">{url ? new URL(url).host : ''}</span>
        <ExternalLinkIcon className="h-4 w-4 flex-none" />
      </p>

      <AnimatePresence>
        {isHovering && (
          <motion.footer
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 z-30 select-none px-4 py-6 sm:-inset-x-6 sm:rounded-2xl sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              WebkitMaskImage: maskBackground,
            }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-x-px inset-y-px rounded-2xl border border-dashed border-zinc-900/30 dark:border-zinc-100/20" />
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-zinc-900/20 bg-white dark:border-zinc-100/20 dark:bg-zinc-800">
              <div className="h-9 w-9 rounded-full border border-dashed border-zinc-900/40 dark:border-zinc-100/60 dark:bg-zinc-900/20" />
            </div>
            <h2 className="mt-6 text-base font-bold text-zinc-50 [text-shadow:rgb(0,0,0)_-0.5px_0.5px_0px,rgb(0,0,0)_0.5px_0.5px_0px,rgb(0,0,0)_0.5px_-0.5px_0px,rgb(0,0,0)_-0.5px_-0.5px_0px] dark:text-zinc-900 dark:[text-shadow:rgb(255,255,255)_-0.5px_0.5px_0px,rgb(255,255,255)_0.5px_0.5px_0px,rgb(255,255,255)_0.5px_-0.5px_0px,rgb(255,255,255)_-0.5px_-0.5px_0px]">
              {name}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 opacity-50 dark:text-zinc-400">
              {description}
            </p>
          </motion.footer>
        )}
      </AnimatePresence>
    </Card>
  )
}
