import { GetServerSideProps } from 'next'
import { GALLERY_URL } from '../constants'

function generateRobots() {
  return `User-agent: *
Allow: /
Sitemap: ${GALLERY_URL}/sitemap.xml
Host: ${GALLERY_URL}
`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robots = generateRobots()

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return {
    props: {},
  }
}

export default function Robots() {
  return null
}
