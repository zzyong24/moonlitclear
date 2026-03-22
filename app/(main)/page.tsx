import React from 'react'

import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { PencilSwooshIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

/**
 * 首页布局
 *
 * 设计决策：
 * - Hero 区全屏沉浸式设计，适合作为视频录制的大屏背景
 * - Hero 区突破 Container 限制，直接铺满视口
 * - 文章区域使用网格布局，大屏下三列展示，充分利用屏幕宽度
 */
export default function BlogHomePage() {
  return (
    <>
      {/* Hero 区 — 在 Headline 组件内部实现全屏效果 */}
      <Container className="mt-10 lg:mt-16 2xl:mt-20">
        <Headline />
      </Container>

      <Container className="mt-16 md:mt-20 lg:mt-24">
        <div className="flex flex-col gap-6 pt-6">
          <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <PencilSwooshIcon className="h-5 w-5 flex-none" />
            <span className="ml-2">近期文章</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3 2xl:gap-8">
            <BlogPosts />
          </div>
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60
