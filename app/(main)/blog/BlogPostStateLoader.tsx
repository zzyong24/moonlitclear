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
    blogPostState.postId = post._id
  }, [post._id])
  React.useEffect(() => {
    // only append new comments
    comments?.forEach((comment) => {
      if (blogPostState.comments.find((c) => c.id === comment.id)) return
      addComment(comment)
    })
  }, [comments])

  return null
}
