import {
  Card,
  Grid,
  Metric,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from '@tremor/react'
import { desc, sql } from 'drizzle-orm'
import Link from 'next/link'
import React from 'react'

import { db } from '~/db'
import { comments } from '~/db/schema'
import { url } from '~/lib'
import { truncate } from '~/lib/string'
import { getLatestVaultPosts } from '~/lib/vault'

export default async function AdminCommentsPage() {
  const {
    rows: [commentsCount],
  } = await db.execute<{
    today_count: number
    this_week_count: number
    this_month_count: number
  }>(
    sql`SELECT 
  (SELECT COUNT(*) FROM comments WHERE created_at::date = CURRENT_DATE) AS today_count,
  (SELECT COUNT(*) FROM comments WHERE EXTRACT('YEAR' FROM created_at) = EXTRACT('YEAR' FROM CURRENT_DATE) AND EXTRACT('WEEK' FROM created_at) = EXTRACT('WEEK' FROM CURRENT_DATE)) AS this_week_count,
  (SELECT COUNT(*) FROM comments WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS this_month_count`
  )

  const latestComments = await db
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt))
    .limit(15)
  // 从 vault 获取所有文章，构建 postId → 文章信息 的映射
  // 注意：评论的 postId 存储的是 Sanity 时代的 _id，vault 中 _id 是文件名
  // 这里用 slug 做匹配备选，并兼容 _id 匹配
  const allPosts = getLatestVaultPosts({ limit: 999 })
  const postMap = new Map(
    allPosts.flatMap((post) => [
      [post._id, { _id: post._id, title: post.title, slug: post.slug }],
      // 也用 slug 作为 key，兼容可能的 postId 格式
      [post.slug, { _id: post._id, title: post.title, slug: post.slug }],
    ])
  )

  return (
    <>
      <Title>评论</Title>

      <Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
        <Card>
          <Text>今日评论数</Text>

          {commentsCount && 'today_count' in commentsCount && (
            <Metric>{commentsCount.today_count}</Metric>
          )}
        </Card>
        <Card>
          <Text>本周评论数</Text>
          {commentsCount && 'this_week_count' in commentsCount && (
            <Metric>{commentsCount.this_week_count}</Metric>
          )}
        </Card>

        <Card>
          <Text>本月评论数</Text>
          {commentsCount && 'this_month_count' in commentsCount && (
            <Metric>{commentsCount.this_month_count}</Metric>
          )}
        </Card>
      </Grid>

      <Card className="mt-6">
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>文章</TableHeaderCell>
              <TableHeaderCell>评论内容</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <Link
                    href={
                      url(`/blog/${postMap.get(comment.postId)?.slug ?? ''}`)
                        .href
                    }
                  >
                    {postMap.get(comment.postId)?.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Text>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {truncate((comment.body as any).text as string)}
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
