import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // 使用正确的生产环境URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://h-qshaoshifuv1.vercel.app'
    
    // 服务端渲染时使用绝对URL
    const apiUrl = `${baseUrl}/api/banquet/${params.id}`
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    
    if (!response.ok) {
      return {
        title: '烧师富邀约函',
        description: '烧师富·板前创作烧鸟'
      }
    }
    
    const data = await response.json()
    
    // 验证数据完整性
    if (!data || !data.id) {
      return {
        title: '烧师富邀约函',
        description: '烧师富·板前创作烧鸟'
      }
    }
    
    const title = data.title || '宴请邀请'
    const hostName = data.hostName || '贵客'
    const restaurantName = data.restaurant?.name || '烧师富'
    const date = data.date || ''
    const time = data.time || ''
    const roomName = data.roomName || ''
    
    return {
      title: `${title} · ${hostName}的宴请邀请`,
      description: `诚邀您出席${hostName}在${restaurantName}举办的私宴，时间：${date} ${time}，地点：${roomName}`,
      openGraph: {
        type: 'article',
        title: `${title} · ${hostName}的宴请邀请`,
        description: `${restaurantName} · ${date} ${time} · ${roomName}`,
        images: [{
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&host=${encodeURIComponent(hostName)}&date=${encodeURIComponent(date)}`,
          width: 1200,
          height: 630,
          alt: title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} · ${hostName}的宴请邀请`,
        description: `${restaurantName} · ${date} ${time}`,
        images: [`${baseUrl}/api/og?title=${encodeURIComponent(title)}&host=${encodeURIComponent(hostName)}&date=${encodeURIComponent(date)}`]
      }
    }
  } catch (error) {
    // 出错时返回默认标题，不要显示"未找到"
    return {
      title: '烧师富邀约函',
      description: '烧师富·板前创作烧鸟'
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
