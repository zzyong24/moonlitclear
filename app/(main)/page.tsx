import React from 'react'

import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { PencilSwooshIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

/**
 * 首页布局
 *
 * 设计决策：
 * - Hero 区采用沉浸式大字设计，在 2K+ 屏幕上有足够的视觉冲击力
 * - 文章使用网格布局，大屏下双列展示，充分利用屏幕宽度
 * - Newsletter 订阅组件只在 Footer 保留一份，避免页面出现两个重复的"动态更新"区块
 */
export default function BlogHomePage() {
  return (
    <>
      <Container className="mt-10 lg:mt-16 2xl:mt-20">
        <Headline />
      </Container>

      <Container className="mt-24 md:mt-28 lg:mt-32">
        <div className="flex flex-col gap-6 pt-6">
          <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <PencilSwooshIcon className="h-5 w-5 flex-none" />
            <span className="ml-2">近期文章</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:gap-8">
            <BlogPosts />
          </div>
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60
