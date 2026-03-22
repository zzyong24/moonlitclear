'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import React from 'react'
import Balancer from 'react-wrap-balancer'

import { SparkleIcon, UserSecurityIcon } from '~/assets'
import { SocialLink } from '~/components/links/SocialLink'

function SystemBuilder() {
  return (
    <span className="group">
      <span className="font-mono">&lt;</span>造系统的工程师
      <span className="font-mono">/&gt;</span>
      <span className="invisible inline-flex text-zinc-300 before:content-['|'] group-hover:visible group-hover:animate-typing dark:text-zinc-500" />
    </span>
  )
}

function AIPractitioner() {
  return (
    <span className="group relative bg-black/5 p-1 dark:bg-white/5">
      <span className="pointer-events-none absolute inset-0 border border-lime-700/90 opacity-70 group-hover:border-dashed group-hover:opacity-100 dark:border-lime-400/90">
        <span className="absolute -left-[3.5px] -top-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        <span className="absolute -bottom-[3.5px] -right-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        <span className="absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
        <span className="absolute -right-[3.5px] -top-[3.5px] size-1.5 border border-lime-700 bg-zinc-50 dark:border-lime-400" />
      </span>
      AI 实践者
    </span>
  )
}

function CrossBoundaryExplorer() {
  return (
    <span className="group inline-flex items-center">
      <SparkleIcon className="mr-1 inline-flex transform-gpu transition-transform duration-500 group-hover:rotate-180" />
      <span>跨界探索者</span>
    </span>
  )
}

function Builder() {
  return (
    <span className="group inline-flex items-center">
      <UserSecurityIcon className="mr-1 inline-flex group-hover:fill-zinc-600/20 dark:group-hover:fill-zinc-200/20" />
      <span>创造者</span>
    </span>
  )
}

/**
 * 鼠标追踪光晕效果组件
 *
 * 设计决策：使用 CSS radial-gradient + framer-motion 的 spring 动画，
 * 比 Canvas 粒子系统更轻量，同时保持流畅的视觉反馈
 */
function MouseGlow({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      {/* 鼠标追踪光晕 */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 hover:opacity-100 [.group:hover_&]:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(163,230,53,0.06), transparent 40%)`,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <div className="absolute -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-lime-400/[0.03] blur-[80px] dark:bg-lime-400/[0.06]" />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * 浮动装饰粒子
 *
 * 纯 CSS 动画实现，不消耗 JS 运行时性能
 */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 左上角漂浮光球 */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-lime-400/10 to-emerald-400/5 blur-3xl animate-float-slow dark:from-lime-400/[0.07] dark:to-emerald-400/[0.03]" />
      {/* 右侧漂浮光球 */}
      <div className="absolute -right-10 top-1/3 h-60 w-60 rounded-full bg-gradient-to-bl from-cyan-400/10 to-blue-400/5 blur-3xl animate-float-medium dark:from-cyan-400/[0.07] dark:to-blue-400/[0.03]" />
      {/* 底部漂浮光球 */}
      <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-gradient-to-tr from-violet-400/10 to-pink-400/5 blur-3xl animate-float-fast dark:from-violet-400/[0.05] dark:to-pink-400/[0.03]" />
    </div>
  )
}

export function Headline() {
  return (
    <div className="group relative max-w-2xl lg:max-w-3xl 2xl:max-w-4xl">
      <FloatingOrbs />
      <MouseGlow>
        <motion.h1
          className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl lg:text-6xl 2xl:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 100,
            duration: 0.3,
          }}
        >
          <SystemBuilder />，<AIPractitioner />，
          <span className="block h-2 lg:h-3" />
          <CrossBoundaryExplorer />，<Builder />
        </motion.h1>

        <motion.p
          className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400 lg:mt-8 lg:text-lg 2xl:text-xl 2xl:leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 85,
            duration: 0.3,
            delay: 0.1,
          }}
        >
          <Balancer>
            我是 MoonlitClear，00后软件工程师，AI 为基，认知破界。
            白天写代码，晚上用 AI 拆行业 —— 已搭建 40+ 工具的个人知识管理系统，
            正在用架构思维 + AI 帮创作者搭建工作流。目标：重构 100 个流程。
          </Balancer>
        </motion.p>

        {/* 统计数据装饰 */}
        <motion.div
          className="mt-8 flex items-center gap-8 lg:mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 50,
            stiffness: 90,
            duration: 0.35,
            delay: 0.2,
          }}
        >
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 lg:text-3xl">40+</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">AI 工具集</span>
          </div>
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 lg:text-3xl">100</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">流程目标</span>
          </div>
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-lime-600 dark:text-lime-400 lg:text-3xl">∞</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">探索边界</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 flex gap-6 lg:mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 50,
            stiffness: 90,
            duration: 0.35,
            delay: 0.3,
          }}
        >
          <SocialLink
            href="https://github.com/zzyong24"
            aria-label="我的 GitHub"
            platform="github"
          />
          <SocialLink href="/feed.xml" platform="rss" aria-label="RSS 订阅" />
          <SocialLink
            href="mailto:qq1968286694@gmail.com"
            aria-label="我的邮箱"
            platform="mail"
          />
        </motion.div>
      </MouseGlow>
    </div>
  )
}
