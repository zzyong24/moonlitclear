'use client'

/**
 * Markdown 渲染组件
 *
 * 替代原来的 PostPortableText（Sanity Portable Text 渲染器），
 * 使用 react-markdown + remark-gfm 渲染 vault 的 Markdown 内容。
 *
 * 设计决策：
 * - 复用项目中已有的 react-markdown 和 remark-gfm 依赖
 * - 复用 react-syntax-highlighter 做代码高亮
 * - 标题自动生成锚点 ID，与 BlogPostTableOfContents 的 heading-N 格式对应
 */

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

import { Mermaid } from '~/components/Mermaid'

/** 全局标题计数器，用于给标题生成与 extractHeadings 一致的 ID */
let headingCounter = 0

function resetHeadingCounter() {
  headingCounter = 0
}

/** 生成标题 ID，与 vault.ts 中 extractHeadings 的逻辑保持一致 */
function getHeadingId(): string {
  headingCounter++
  return `heading-${headingCounter}`
}

export function PostMarkdown({ content }: { content: string }) {
  // 每次渲染时重置计数器
  resetHeadingCounter()

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 标题组件 — 生成与目录导航对应的锚点
        h1: ({ children }) => {
          const id = getHeadingId()
          return (
            <h1 id={id}>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h1>
          )
        },
        h2: ({ children }) => {
          const id = getHeadingId()
          return (
            <h2 id={id}>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h2>
          )
        },
        h3: ({ children }) => {
          const id = getHeadingId()
          return (
            <h3 id={id}>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h3>
          )
        },
        h4: ({ children }) => {
          const id = getHeadingId()
          return (
            <h4 id={id}>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h4>
          )
        },

        // 代码块 — 带语法高亮 + Mermaid 图表渲染
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const isInline = !match

          if (isInline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }

          // Mermaid 代码块 → 渲染为图表
          if (match[1] === 'mermaid') {
            return <Mermaid chart={String(children).replace(/\n$/, '')} />
          }

          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              className="rounded-xl !my-4"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          )
        },

        // 链接 — 外部链接新窗口打开
        a({ href, children, ...props }) {
          const isExternal = href && !href.startsWith('/') && !href.startsWith('#')
          return (
            <a
              href={href}
              {...(isExternal
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
              {...props}
            >
              {children}
            </a>
          )
        },

        // 图片
        img({ src, alt }) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ''}
              className="rounded-xl"
              loading="lazy"
            />
          )
        },

        // 引用块
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
              {children}
            </blockquote>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
