import { GetServerSideProps } from 'next'
import { GALLERY_URL, BASE_URL, INSIGHT_URL } from '../constants'

const INFO_URL = 'https://info.hovanhoa.net'
const STATUS_URL = 'https://status.hovanhoa.net'

function generateSitemap() {
  const staticPages = [
    {
      url: GALLERY_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: INSIGHT_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: INFO_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: STATUS_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'always',
      priority: 0.8,
    },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
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
  const sitemap = generateSitemap()

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
