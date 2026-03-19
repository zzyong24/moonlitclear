import { type MetadataRoute } from 'next'

import { url } from '~/lib'
import { getAllVaultPostSlugs } from '~/lib/vault'

export default async function sitemap() {
  const staticMap = [
    {
      url: url('/').href,
      lastModified: new Date(),
    },
    {
      url: url('/blog').href,
      lastModified: new Date(),
    },
    {
      url: url('/projects').href,
      lastModified: new Date(),
    },
    {
      url: url('/guestbook').href,
      lastModified: new Date(),
    },
  ] satisfies MetadataRoute.Sitemap

  const slugs = getAllVaultPostSlugs()

  const dynamicMap = slugs.map((slug) => ({
    url: url(`/blog/${slug}`).href,
    lastModified: new Date(),
  })) satisfies MetadataRoute.Sitemap

  return [...staticMap, ...dynamicMap]
}

export const revalidate = 60
