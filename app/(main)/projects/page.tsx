import { type Metadata } from 'next'

import { Projects } from '~/app/(main)/projects/Projects'
import { Container } from '~/components/ui/Container'

const title = '我的项目'
const description =
  '我相信最好的学习方式是造东西。这里是我正在打磨的产品和项目，从 AI 知识管理到教育科技，每一个都是对某个真实问题的回应。'
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
} satisfies Metadata

export default function ProjectsPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          我正在造的东西。
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          我相信最好的学习方式是造东西。这里是我正在打磨的<b>产品</b>和<b>项目</b>
          ，从 <b>AI 知识管理</b>到<b>教育科技</b>
          ，每一个都是对某个真实问题的回应——用代码把想法变成可运行的系统。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
      </div>
    </Container>
  )
}

export const revalidate = 3600
