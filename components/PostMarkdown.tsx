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

import React, { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'
import { Mermaid } from '~/components/Mermaid'

/**
 * 计数器 hook，避免模块级全局变量在并发渲染下的竞态
 *
 * 设计决策：使用 useRef 代替模块级全局变量，
 * 保证每个组件实例独立计数，React 18 Strict Mode 兼容。
 * 每次渲染前通过 reset 重置，确保 SSR 和 CSR 生成的 ID 一致。
 */
function useCounters() {
  const headingRef = useRef(0)
  const blockRef = useRef(0)

  // 每次组件渲染时重置（在渲染阶段调用是安全的，ref 不触发 re-render）
  headingRef.current = 0
  blockRef.current = 0

  return {
    getHeadingId: () => {
      headingRef.current++
      return `heading-${headingRef.current}`
    },
    getBlockId: () => {
      blockRef.current++
      return `block-${blockRef.current}`
    },
  }
}

export function PostMarkdown({ content }: { content: string }) {
  const { getHeadingId, getBlockId } = useCounters()

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
