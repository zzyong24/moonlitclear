import Balancer from 'react-wrap-balancer'

import { Container } from '~/components/ui/Container'

const title = 'AMA 一对一交流'
const description =
  '我是 MoonlitClear，26 岁软件工程师，AI 实践者。我有全栈开发、AI 工具链搭建、知识管理系统设计、架构思维应用等经验，可以为你解答相关问题。'

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
}

export default function AskMeAnythingPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Ask Me Anything / 一对一交流
        </h1>
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>{description}</Balancer>
        </p>
      </header>

      <article className="prose dark:prose-invert">
        <h2>可以聊什么</h2>
        <p>我可以帮你解答以下方面的问题：</p>
        <ul>
          <li>
            <b>AI 工具链搭建</b>
            ：如何用 AI 构建个人知识管理系统？怎么把 AI 融入日常工作流？不是教你写
            Prompt，而是帮你设计整条业务线。
          </li>
          <li>
            <b>全栈开发</b>
            ：前端/后端/系统架构相关问题，React、Next.js、Go、Node.js
            等技术栈的实战经验。
          </li>
          <li>
            <b>知识管理</b>
            ：如何搭建个人知识体系？Obsidian + AI
            的最佳实践？如何让知识真正流动起来？
          </li>
          <li>
            <b>架构思维</b>
            ：如何用工程师的系统化思维拆解非技术问题？如何把复杂问题变成可执行的工作流？
          </li>
          <li>
            <b>跨界探索</b>
            ：程序员如何做内容创作？如何从技术人转向跨界探索者？个人品牌怎么起步？
          </li>
        </ul>

        <h2>关于我</h2>
        <p>
          26 岁，软件工程师，正在用 AI + 架构思维拆解行业。
          已搭建 40+ 工具的个人 AI 知识管理系统，涵盖知识收藏、自动生成知识卡片、
          深度反思、创作追踪、数据驱动复盘等完整链路。
          目标是把这套方法论复制到 100 个行业。
        </p>
        <p>
          信条：<strong>AI 为基，认知破界。</strong>
        </p>

        <h2>交流方式</h2>
        <p>
          目前可以通过邮件或留言墙与我联系。如果你对 AI
          工具链、知识管理系统或跨界探索有兴趣，欢迎交流。
        </p>
      </article>
    </Container>
  )
}
