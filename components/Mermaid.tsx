'use client'

/**
 * Mermaid 图表渲染组件
 *
 * 设计决策：
 * - 使用 useEffect 在客户端动态初始化 mermaid，避免 SSR 报错（mermaid 依赖 DOM）
 * - 每个图表生成唯一 ID，支持同一页面多个 mermaid 代码块
 * - 渲染失败时展示原始代码 + 错误提示，不影响页面其他内容
 * - 支持暗色/亮色主题自动切换
 */

import React, { useEffect, useId, useRef, useState } from 'react'

interface MermaidProps {
  /** mermaid 图表定义代码 */
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueId = useId().replace(/:/g, '-')
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default

        // 检测当前主题
        const isDark = document.documentElement.classList.contains('dark')

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, sans-serif',
        })

        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${uniqueId}`,
          chart.trim()
        )

        if (!cancelled) {
          setSvg(renderedSvg)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Mermaid] Render failed:', err)
          setError(err instanceof Error ? err.message : 'Mermaid 渲染失败')
        }
      }
    }

    renderChart()

    return () => {
      cancelled = true
    }
  }, [chart, uniqueId])

  // 渲染失败时展示原始代码 + 错误提示
  if (error) {
    return (
      <div className="my-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
        <p className="mb-2 text-sm text-red-600 dark:text-red-400">
          ⚠️ Mermaid 图表渲染失败：{error}
        </p>
        <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
          <code>{chart}</code>
        </pre>
      </div>
    )
  }

  // 加载中状态
  if (!svg) {
    return (
      <div className="my-4 flex items-center justify-center rounded-xl bg-zinc-50 p-8 dark:bg-zinc-800/50">
        <div className="text-sm text-zinc-400">图表加载中...</div>
      </div>
    )
  }

  // 成功渲染
  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-xl bg-white p-4 dark:bg-zinc-800/50 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
