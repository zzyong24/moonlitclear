import React from 'react'

import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { PencilSwooshIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

/**
 * 首页布局
 *
 * 设计决策：
 * - Newsletter 订阅组件只在 Footer 保留一份，避免页面出现两个重复的"动态更新"区块
 * - 右侧 aside 留给未来扩展（如标签云、热门文章等）
 */
export default function BlogHomePage() {
  return (
    <>
      <Container className="mt-10">
        <Headline />
      </Container>

      <Container className="mt-24 md:mt-28">
        <div className="flex flex-col gap-6 pt-6">
          <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <PencilSwooshIcon className="h-5 w-5 flex-none" />
            <span className="ml-2">近期文章</span>
          </h2>
          <BlogPosts />
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60
