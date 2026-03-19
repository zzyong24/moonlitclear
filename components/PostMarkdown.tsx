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
 * - 每个内容块（段落/标题/代码块/图片/引用块）注入 Commentable 组件，
 *   恢复原版 PortableText 的块级评论功能
 *
 * blockId 生成策略：
 * - 原版 Sanity 使用 Portable Text 的 _key 作为 blockId（随机字符串）
 * - 新版使用自增计数器生成 "block-N" 格式的 ID
 * - 注意：如果文章内容变更导致段落顺序变化，已有评论可能错位
 *   这是 Markdown 无原生 block ID 的固有局限，可接受的权衡
 */

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'
import { Mermaid } from '~/components/Mermaid'

/** 全局标题计数器，用于给标题生成与 extractHeadings 一致的 ID */
let headingCounter = 0
/** 全局内容块计数器，用于给每个块生成唯一的评论 blockId */
let blockCounter = 0

function resetCounters() {
  headingCounter = 0
  blockCounter = 0
}

/** 生成标题 ID，与 vault.ts 中 extractHeadings 的逻辑保持一致 */
function getHeadingId(): string {
  headingCounter++
  return `heading-${headingCounter}`
}

/** 生成内容块 ID，用于 Commentable 组件的 blockId */
function getBlockId(): string {
  blockCounter++
  return `block-${blockCounter}`
}

export function PostMarkdown({ content }: { content: string }) {
  // 每次渲染时重置计数器
  resetCounters()

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 段落 — 注入评论组件
        p: ({ children }) => {
          // 检查段落内容是否为空（只有空白字符）
          const textContent = React.Children.toArray(children)
            .map((child) =>
              typeof child === 'string' ? child : ''
            )
            .join('')
            .trim()
          const isEmpty = textContent.length === 0

          // 如果段落中包含 img，不要包裹在 <p> 中（HTML 规范不允许 <p> 内嵌 <img>）
          const hasImage = React.Children.toArray(children).some(
            (child) =>
              React.isValidElement(child) &&
              (child.type === 'img' || (child.props as any)?.node?.tagName === 'img')
          )
          if (hasImage) {
            return <>{children}</>
          }

          const bid = isEmpty ? undefined : getBlockId()
          return (
            <p
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              {!isEmpty && bid && (
                <ClientOnly>
                  <Commentable blockId={bid} />
                </ClientOnly>
              )}
              {children}
            </p>
          )
        },

        // 标题组件 — 生成与目录导航对应的锚点 + 评论组件
        h1: ({ children }) => {
          const id = getHeadingId()
          const bid = getBlockId()
          return (
            <h1
              id={id}
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h1>
          )
        },
        h2: ({ children }) => {
          const id = getHeadingId()
          const bid = getBlockId()
          return (
            <h2
              id={id}
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h2>
          )
        },
        h3: ({ children }) => {
          const id = getHeadingId()
          const bid = getBlockId()
          return (
            <h3
              id={id}
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h3>
          )
        },
        h4: ({ children }) => {
          const id = getHeadingId()
          const bid = getBlockId()
          return (
            <h4
              id={id}
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
              <a href={`#${id}`} className="anchor-link">
                {children}
              </a>
            </h4>
          )
        },

        // 代码块 — 带语法高亮 + Mermaid 图表渲染 + 评论组件
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

          const bid = getBlockId()
          return (
            <div
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-xl !my-4"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
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

        // 图片 — 评论组件
        img({ src, alt }) {
          const bid = getBlockId()
          return (
            <figure
              data-blockid={bid}
              className="group relative pr-3 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || ''}
                className="rounded-xl"
                loading="lazy"
              />
            </figure>
          )
        },

        // 引用块 — 评论组件
        blockquote({ children }) {
          const bid = getBlockId()
          return (
            <blockquote
              data-blockid={bid}
              className="group relative border-l-4 border-zinc-300 pl-4 pr-3 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400 md:pr-0"
            >
              <ClientOnly>
                <Commentable blockId={bid} />
              </ClientOnly>
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
