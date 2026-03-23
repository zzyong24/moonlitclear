'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import React from 'react'

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
 * 鼠标追踪光晕 — 暗色下冷蓝光，亮色下暖橙光
 */
function MouseGlow() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { damping: 20, stiffness: 120 })
  const springY = useSpring(mouseY, { damping: 20, stiffness: 120 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    },
    [mouseX, mouseY]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0" onMouseMove={handleMouseMove}>
      {/* 暗色 — 冷蓝色星光追踪 */}
      <motion.div
        className="absolute hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full dark:block"
        style={{
          x: springX,
          y: springY,
          background: 'radial-gradient(circle, rgba(100,150,255,0.08) 0%, rgba(100,150,255,0.03) 40%, transparent 70%)',
        }}
      />
      {/* 亮色 — 暖橙色能量追踪 */}
      <motion.div
        className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full dark:hidden"
        style={{
          x: springX,
          y: springY,
          background: 'radial-gradient(circle, rgba(255,120,30,0.1) 0%, rgba(255,80,0,0.04) 40%, transparent 70%)',
        }}
      />
    </div>
  )
}

// ========== 暗色模式 — 星空 + 流星 ==========

/**
 * 繁星背景 — 大量随机分布的小星星 + 闪烁动画
 *
 * 设计决策：用 CSS 实现 60+ 个星星的闪烁效果，
 * 通过随机延迟和不同的动画时长实现真实星空感
 */
function StarField() {
  // 生成星星数据 — 在组件外固定，避免每次渲染变化
  const stars = React.useMemo(() => {
    const result: Array<{
      left: string; top: string; size: number;
      delay: string; duration: string; variant: 'normal' | 'bright' | 'dim';
    }> = []
    // 使用伪随机以保证 SSR / CSR 一致
    const seed = (i: number) => ((i * 7919 + 104729) % 100000) / 100000
    for (let i = 0; i < 80; i++) {
      const s = seed
      result.push({
        left: `${s(i * 3 + 1) * 100}%`,
        top: `${s(i * 3 + 2) * 100}%`,
        size: s(i * 3) < 0.15 ? 3 : s(i * 3) < 0.4 ? 2 : 1,
        delay: `${(s(i * 3 + 7) * 6).toFixed(1)}s`,
        duration: `${(2 + s(i * 3 + 5) * 4).toFixed(1)}s`,
        variant: s(i * 3 + 9) < 0.15 ? 'bright' : s(i * 3 + 9) < 0.5 ? 'normal' : 'dim',
      })
    }
    return result
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.variant === 'bright'
              ? 'rgba(180,210,255,1)' // 蓝白色亮星
              : star.variant === 'normal'
              ? 'rgba(220,220,240,0.8)' // 白色普通星
              : 'rgba(200,200,220,0.5)', // 暗淡小星
            boxShadow: star.variant === 'bright'
              ? '0 0 6px 2px rgba(140,180,255,0.4)'
              : star.variant === 'normal'
              ? '0 0 3px 1px rgba(200,200,255,0.2)'
              : 'none',
            animation: `${star.variant === 'bright' ? 'twinkle-alt' : 'twinkle'} ${star.duration} ease-in-out ${star.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * 流星效果 — 多条流星以不同角度、速度划过星空
 */
function MeteorShower() {
  const meteors = React.useMemo(() => [
    { left: '20%', top: '-5%', delay: '0s', duration: '8s', width: '120px', type: 'short' as const },
    { left: '55%', top: '-8%', delay: '3s', duration: '10s', width: '180px', type: 'long' as const },
    { left: '80%', top: '-3%', delay: '6s', duration: '7s', width: '100px', type: 'short' as const },
    { left: '35%', top: '-6%', delay: '11s', duration: '12s', width: '220px', type: 'long' as const },
    { left: '65%', top: '-4%', delay: '15s', duration: '9s', width: '150px', type: 'short' as const },
    { left: '10%', top: '-7%', delay: '20s', duration: '11s', width: '200px', type: 'long' as const },
  ], [])

  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
      {meteors.map((m, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: m.left,
            top: m.top,
            width: m.width,
            height: '2px',
            background: `linear-gradient(to left, rgba(200,220,255,0.8), rgba(120,160,255,0.4), transparent)`,
            borderRadius: '2px',
            boxShadow: '0 0 8px 2px rgba(150,180,255,0.3)',
            animation: `${m.type === 'long' ? 'meteor-long' : 'meteor'} ${m.duration} linear ${m.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * 星云 + 极光 — 为深空背景增加色彩层次
 */
function NebulaAndAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
      {/* 星云 — 蓝紫色大面积渐变 */}
      <div
        className="absolute left-[20%] top-[30%] h-[60vh] w-[60vh] rounded-full blur-[120px] animate-nebula-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(60,40,150,0.2) 0%, rgba(30,60,180,0.08) 50%, transparent 80%)',
        }}
      />
      <div
        className="absolute right-[10%] top-[15%] h-[50vh] w-[50vh] rounded-full blur-[100px] animate-nebula-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(100,30,120,0.15) 0%, rgba(60,20,100,0.05) 50%, transparent 80%)',
          animationDelay: '5s',
        }}
      />
      {/* 底部极光 — 水平渐变色带 */}
      <div
        className="absolute bottom-0 left-0 h-[40vh] w-full animate-aurora-shift"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(20,80,100,0.06) 30%, rgba(30,100,80,0.08) 60%, rgba(40,60,120,0.04) 100%)',
        }}
      />
      <div
        className="absolute bottom-[5%] left-0 h-[30vh] w-full animate-aurora-shift"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(80,30,120,0.05) 40%, rgba(30,80,100,0.06) 100%)',
          animationDelay: '7s',
          animationDirection: 'reverse',
        }}
      />
    </div>
  )
}

// ========== 亮色模式 — 火星撞地球 ==========

/**
 * 撞击核心 — 中心爆炸点 + 冲击波扩散
 *
 * 设计决策：
 * - 页面中心偏下位置放置一个巨大的能量核心
 * - 从核心向外扩散多层冲击波环
 * - 中心用高亮岩浆色渐变，向外过渡到暗红/深橙
 */
function ImpactCore() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden dark:hidden">
      {/* 核心发光体 — 白热中心 */}
      <div
        className="absolute left-1/2 top-[55%] h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] animate-energy-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,200,50,0.5) 0%, rgba(255,100,0,0.3) 30%, rgba(200,30,0,0.15) 60%, transparent 85%)',
        }}
      />
      {/* 外层热辐射 */}
      <div
        className="absolute left-1/2 top-[55%] h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,80,0,0.12) 0%, rgba(200,30,0,0.06) 40%, rgba(150,0,0,0.02) 70%, transparent 100%)',
          animation: 'energy-pulse 5s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      {/* 冲击波环 1 — 快速 */}
      <div
        className="absolute left-1/2 top-[55%] h-[90vh] w-[90vh] rounded-full border border-orange-500/20 animate-shockwave"
      />
      {/* 冲击波环 2 — 延迟 */}
      <div
        className="absolute left-1/2 top-[55%] h-[90vh] w-[90vh] rounded-full border border-red-500/15 animate-shockwave-delayed"
      />
      {/* 冲击波环 3 — 更大更慢 */}
      <div
        className="absolute left-1/2 top-[55%] h-[120vh] w-[120vh] rounded-full border border-orange-400/10"
        style={{
          animation: 'shockwave 6s ease-out 1s infinite',
        }}
      />
    </div>
  )
}

/**
 * 火焰粒子 — 从撞击点向上升腾的火星
 *
 * 每个粒子有独立的运动轨迹、颜色和大小
 */
function EmberParticles() {
  const embers = React.useMemo(() => {
    const seed = (i: number) => ((i * 6271 + 89123) % 100000) / 100000
    const result: Array<{
      left: string; bottom: string; size: number;
      dx: number; dy: number;
      delay: string; duration: string; color: string;
    }> = []
    for (let i = 0; i < 30; i++) {
      const s = seed
      result.push({
        left: `${30 + s(i * 4 + 1) * 40}%`, // 集中在中心区域
        bottom: `${10 + s(i * 4 + 2) * 30}%`,
        size: 2 + s(i * 4) * 4,
        dx: (s(i * 4 + 3) - 0.5) * 100, // -50 ~ 50
        dy: -(100 + s(i * 4 + 5) * 200), // -100 ~ -300 向上
        delay: `${(s(i * 4 + 6) * 5).toFixed(1)}s`,
        duration: `${(2 + s(i * 4 + 7) * 3).toFixed(1)}s`,
        color: s(i * 4 + 8) < 0.3
          ? 'rgba(255,220,80,0.9)' // 黄色火星
          : s(i * 4 + 8) < 0.6
          ? 'rgba(255,140,20,0.85)' // 橙色火星
          : 'rgba(255,60,20,0.8)', // 红色火星
      })
    }
    return result
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden dark:hidden">
      {embers.map((e, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: `${e.size}px`,
            height: `${e.size}px`,
            backgroundColor: e.color,
            boxShadow: `0 0 ${e.size * 2}px ${e.size}px ${e.color}`,
            animation: `ember-rise ${e.duration} ease-out ${e.delay} infinite`,
            ['--ember-dx' as string]: `${e.dx}px`,
            ['--ember-dy' as string]: `${e.dy}px`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * 岩浆裂纹 — 从中心向外延伸的发光裂纹线
 *
 * 用 SVG 路径模拟不规则裂纹，带脉冲发光效果
 */
function LavaCracks() {
  const cracks = React.useMemo(() => [
    // 从中心向各方向延伸的裂纹路径
    { d: 'M 50 55 L 35 45 L 28 38 L 20 42 L 12 35', delay: '0s' },
    { d: 'M 50 55 L 60 42 L 72 38 L 78 30 L 88 28', delay: '1s' },
    { d: 'M 50 55 L 45 65 L 38 72 L 30 68 L 22 75', delay: '0.5s' },
    { d: 'M 50 55 L 58 68 L 65 75 L 72 70 L 82 78', delay: '1.5s' },
    { d: 'M 50 55 L 42 50 L 32 52 L 25 48 L 15 55', delay: '2s' },
    { d: 'M 50 55 L 55 48 L 62 50 L 68 44 L 75 50', delay: '0.8s' },
    { d: 'M 50 55 L 48 62 L 52 70 L 48 78 L 55 85', delay: '2.5s' },
    { d: 'M 50 55 L 56 58 L 62 62 L 70 58 L 80 65', delay: '1.2s' },
  ], [])

  return (
    <div className="pointer-events-none absolute inset-0 dark:hidden">
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {cracks.map((crack, i) => (
          <path
            key={i}
            d={crack.d}
            fill="none"
            stroke="url(#lava-gradient)"
            strokeWidth="0.15"
            strokeLinecap="round"
            style={{
              animation: `lava-crack-glow 4s ease-in-out ${crack.delay} infinite`,
              filter: 'drop-shadow(0 0 3px rgba(255,100,0,0.5))',
            }}
          />
        ))}
        <defs>
          <linearGradient id="lava-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,200,50,0.9)" />
            <stop offset="50%" stopColor="rgba(255,100,0,0.7)" />
            <stop offset="100%" stopColor="rgba(200,20,0,0.4)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

/**
 * 热浪效果 — 整屏覆盖的微妙扭曲感
 */
function HeatShimmer() {
  return (
    <div className="pointer-events-none absolute inset-0 dark:hidden">
      <div className="absolute inset-0 animate-heat-shimmer"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,120,0,0.02) 4px, rgba(255,120,0,0.02) 5px)',
        }}
      />
    </div>
  )
}

/**
 * 碎片飞溅 — 从撞击点飞出的发光碎片
 */
function DebrisField() {
  const debris = React.useMemo(() => [
    { left: '48%', top: '52%', dx: -180, dy: -120, rot: 220, delay: '0s', size: 4, color: 'rgba(255,180,50,0.7)' },
    { left: '52%', top: '54%', dx: 150, dy: -160, rot: -180, delay: '1.5s', size: 3, color: 'rgba(255,100,20,0.8)' },
    { left: '50%', top: '53%', dx: -100, dy: -200, rot: 300, delay: '3s', size: 5, color: 'rgba(255,200,80,0.6)' },
    { left: '49%', top: '56%', dx: 200, dy: -80, rot: -250, delay: '0.5s', size: 3, color: 'rgba(255,60,10,0.7)' },
    { left: '51%', top: '55%', dx: -220, dy: -50, rot: 180, delay: '2s', size: 4, color: 'rgba(255,150,30,0.7)' },
    { left: '50%', top: '54%', dx: 80, dy: -240, rot: -300, delay: '4s', size: 3, color: 'rgba(255,220,100,0.6)' },
  ], [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden dark:hidden">
      {debris.map((d, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: d.left,
            top: d.top,
            width: `${d.size}px`,
            height: `${d.size}px`,
            backgroundColor: d.color,
            boxShadow: `0 0 ${d.size * 3}px ${d.size}px ${d.color}`,
            animation: `debris-fly 6s ease-out ${d.delay} infinite`,
            ['--debris-dx' as string]: `${d.dx}px`,
            ['--debris-dy' as string]: `${d.dy}px`,
            ['--debris-rot' as string]: `${d.rot}deg`,
          }}
        />
      ))}
    </div>
  )
}

// ========== 统计卡片 — 双主题适配 ==========

function StatCard({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="group relative flex flex-col items-center rounded-2xl border px-8 py-5 backdrop-blur-sm transition-all duration-500 2xl:px-10 2xl:py-6
      border-white/[0.08] bg-white/[0.03] hover:border-blue-400/30 hover:bg-white/[0.06]
      dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-blue-400/20 dark:hover:bg-white/[0.04]">
      <span className={`text-3xl font-bold 2xl:text-4xl ${
        accent
          ? 'bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400'
          : 'text-zinc-800 dark:text-zinc-100'
      }`}>
        {value}
      </span>
      <span className="mt-1 text-xs text-zinc-500 2xl:text-sm">{label}</span>
      {/* hover 光效 — 亮色暖橙，暗色冷蓝 */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:hidden"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,120,0,0.06) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 hidden rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:block"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(100,150,255,0.06) 0%, transparent 70%)' }}
      />
    </div>
  )
}

// ========== 主组件 ==========

export function Headline() {
  return (
    <div className="relative -mx-4 -mt-10 sm:-mx-8 lg:-mx-12 lg:-mt-16 2xl:-mt-20">
      {/* ===== 暗色模式层 — 星空宇宙 ===== */}
      <StarField />
      <MeteorShower />
      <NebulaAndAurora />

      {/* ===== 亮色模式层 — 火星撞地球 ===== */}
      <ImpactCore />
      <LavaCracks />
      <EmberParticles />
      <DebrisField />
      <HeatShimmer />

      {/* ===== 通用层 ===== */}
      <MouseGlow />

      {/* 亮色模式 — 底部热辐射渐变 */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[30vh] w-full dark:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(255,60,0,0.06) 0%, rgba(255,120,0,0.03) 40%, transparent 100%)',
        }}
      />

      {/* 暗色模式 — 底部深空渐变 */}
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[20vh] w-full dark:block"
        style={{
          background: 'linear-gradient(to top, rgba(0,2,18,0.8) 0%, transparent 100%)',
        }}
      />

      {/* Hero 区 — 全屏高度居中 */}
      <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-20 text-center">
        {/* 主标题 */}
        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl 2xl:text-7xl
            text-zinc-800 dark:text-zinc-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 100,
          }}
        >
          <SystemBuilder />，<AIPractitioner />，
          <span className="block h-3 lg:h-4" />
          <CrossBoundaryExplorer />，<Builder />
        </motion.h1>

        {/* 描述 */}
        <motion.p
          className="mx-auto mt-8 max-w-3xl text-base leading-relaxed lg:mt-10 lg:text-lg 2xl:max-w-4xl 2xl:text-xl 2xl:leading-relaxed
            text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 85,
            delay: 0.1,
          }}
        >
          我是 MoonlitClear，00后软件工程师，AI 为基，认知破界。
          聚焦方向：以架构思维 + AI 能力，赋能个人实现效率升级与价值创造 
          目标：重构 100 个流程。
        </motion.p>

        {/* 统计卡片组 */}
        <motion.div
          className="mt-12 flex items-center gap-4 lg:mt-16 lg:gap-6 2xl:gap-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 50,
            stiffness: 90,
            delay: 0.2,
          }}
        >
          <StatCard value="40+" label="AI 工具集" />
          <StatCard value="100" label="流程目标" />
          <StatCard value="∞" label="探索边界" accent />
        </motion.div>

        {/* 社交链接 */}
        <motion.div
          className="mt-10 flex gap-6 lg:mt-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            damping: 50,
            stiffness: 90,
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

        {/* 底部滚动提示 — 暗色闪光，亮色暖光 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-zinc-500">向下滚动</span>
            <div className="h-8 w-px animate-pulse bg-gradient-to-b from-orange-500/50 to-transparent dark:from-blue-400/50" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
