import { parseDateTime } from '@zolplay/utils'
import Image from 'next/image'
import Link from 'next/link'

import {
  CalendarIcon,
  CursorClickIcon,
  HourglassIcon,
  ScriptIcon,
} from '~/assets'
import { prettifyNumber } from '~/lib/math'
import { type VaultPost } from '~/lib/vault'

export function BlogPostCard({
  post,
  views,
}: {
  post: VaultPost
  views: number
}) {
  const { title, slug, mainImage, publishedAt, categories, readingTime } = post
  const hasImage = mainImage.asset.url !== ''

  return (
    <Link
      href={`/blog/${slug}`}
      prefetch={false}
      className="group relative flex w-full transform-gpu flex-col rounded-3xl bg-transparent ring-2 ring-[--post-image-bg] transition-transform hover:-translate-y-0.5"
      style={
        {
          '--post-image-fg':
            mainImage.asset.dominant?.foreground ?? '#e0e0e0',
          '--post-image-bg':
            mainImage.asset.dominant?.background ?? '#1a1a2e',
        } as React.CSSProperties
      }
    >
      {/* 封面区域：有图显示图片，无图显示渐变色块 */}
      <div className="relative aspect-[240/135] w-full">
        {hasImage ? (
          <Image
            src={mainImage.asset.url}
            alt=""
            className="rounded-t-3xl object-cover"
            placeholder={mainImage.asset.lqip ? 'blur' : 'empty'}
            blurDataURL={mainImage.asset.lqip || undefined}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded-t-3xl"
            style={{
              background: `linear-gradient(135deg, ${mainImage.asset.dominant?.background ?? '#1a1a2e'}, ${mainImage.asset.dominant?.foreground ?? '#e0e0e0'}20)`,
            }}
          >
            <span className="text-4xl font-bold opacity-20" style={{ color: mainImage.asset.dominant?.foreground ?? '#e0e0e0' }}>
              {title.slice(0, 1)}
            </span>
          </div>
        )}
      </div>
      <span className="relative z-10 flex w-full flex-1 shrink-0 flex-col justify-between gap-0.5 rounded-b-[calc(1.5rem+1px)] p-4 md:p-5"
        style={{ backgroundColor: mainImage.asset.dominant?.background ?? '#1a1a2e' }}
      >
        <h2 className="z-20 text-base font-bold tracking-tight text-[--post-image-fg] opacity-70 transition-opacity group-hover:opacity-100 md:text-xl">
          {title}
        </h2>

        <span className="relative z-20 flex items-center justify-between opacity-50 transition-opacity group-hover:opacity-80">
          <span className="inline-flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm">
              <CalendarIcon />
              <span>
                {parseDateTime({ date: new Date(publishedAt) })?.format(
                  'YYYY/MM/DD'
                )}
              </span>
            </span>

            {Array.isArray(categories) && categories.length > 0 && (
              <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm">
                <ScriptIcon />
                <span>{categories.join(', ')}</span>
              </span>
            )}
          </span>
          <span className="inline-flex items-center space-x-3 text-[12px] font-medium text-[--post-image-fg] md:text-xs">
            <span className="inline-flex items-center space-x-1">
              <CursorClickIcon />
              <span>{prettifyNumber(views, true)}</span>
            </span>

            <span className="inline-flex items-center space-x-1">
              <HourglassIcon />
              <span>{readingTime.toFixed(0)}分钟阅读</span>
            </span>
          </span>
        </span>
      </span>
    </Link>
  )
}
