import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 简化处理：始终返回默认标题
  // 客户端会动态获取数据并显示
  return {
    title: '烧师富邀约函',
    description: '烧师富·板前创作烧鸟·席位预约',
    openGraph: {
      type: 'article',
      title: '烧师富邀约函',
      description: '烧师富·板前创作烧鸟',
    }
  }
}

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
