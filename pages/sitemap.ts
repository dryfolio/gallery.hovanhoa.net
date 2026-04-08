import { GetServerSideProps } from 'next'
import { GALLERY_URL, BASE_URL, INSIGHT_URL } from '../constants'
import getResults from '../utils/cachedImages'

const INFO_URL = 'https://info.hovanhoa.net'
const STATUS_URL = 'https://status.hovanhoa.net'
const MUSIC_URL = 'https://music.hovanhoa.net'

function generateSitemap(imageResults: any) {
  const resources = imageResults?.resources || []
  const now = new Date().toISOString()

  const staticPages = [
    {
      url: GALLERY_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: INSIGHT_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: INFO_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: STATUS_URL,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: MUSIC_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const photoPages = resources.map((img: any, index: number) => ({
    url: `${GALLERY_URL}/p/${index}`,
    lastModified: img.uploaded_at || now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const allPages = [...staticPages, ...photoPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return sitemap
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const imageResults = await getResults()
  const sitemap = generateSitemap(imageResults)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function Sitemap() {
  return null
}
