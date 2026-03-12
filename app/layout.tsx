import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '烧师富 · 板前创作烧鸟',
  description: '烧师富板前创作烧鸟 · 席位预约 · 双塔街道竹辉路168号环宇荟',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
