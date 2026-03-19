'use client'

import React from 'react'
import { useQuery } from 'react-query'

import { addComment, blogPostState } from '~/app/(main)/blog/blog-post.state'
import { type PostIDLessCommentDto } from '~/db/dto/comment.dto'

interface MinimalPost {
  _id: string
}

export function BlogPostStateLoader({ post }: { post: MinimalPost }) {
  const { data: comments } = useQuery(
    ['comments', post._id],
    async () => {
      try {
        const res = await fetch(`/api/comments/${post._id}`)
        if (!res.ok) return []
        const data = await res.json()
        return data as PostIDLessCommentDto[]
      } catch {
        // 评论系统未启用时静默失败
        return []
      }
    },
    { initialData: [] }
  )

  React.useEffect(() => {
    // 切换文章时，先清空旧评论再设置新 postId
    // 防止 A 文章的评论残留在 B 文章页面
    blogPostState.comments.splice(0, blogPostState.comments.length)
    blogPostState.replyingTo = null
    blogPostState.currentBlockId = null
    blogPostState.postId = post._id
  }, [post._id])
  React.useEffect(() => {
    if (!comments || comments.length === 0) return
    // 批量同步评论：先清空再全量写入，避免增量追加导致的残留
    blogPostState.comments.splice(0, blogPostState.comments.length)
    comments.forEach((comment) => {
      addComment(comment)
    })
  }, [comments])

  return null
}
