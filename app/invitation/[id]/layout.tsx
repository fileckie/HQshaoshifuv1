import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // 开发环境使用相对路径，生产环境使用绝对URL
    const isDev = process.env.NODE_ENV === 'development'
    const baseUrl = isDev ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_APP_URL || 'https://hqinvitation.vercel.app')
    const apiUrl = isDev ? `http://localhost:3000/api/banquet/${params.id}` : `${baseUrl}/api/banquet/${params.id}`
    
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return {
        title: '邀请函未找到',
        description: '该邀请函可能已过期或不存在'
      }
    }
    
    const data = await response.json()
    
    return {
      title: `${data.title} · ${data.hostName}的宴请邀请`,
      description: `诚邀您出席${data.hostName}在${data.restaurant.name}举办的私宴，时间：${data.date} ${data.time}，地点：${data.roomName}`,
      openGraph: {
        type: 'article',
        title: `${data.title} · ${data.hostName}的宴请邀请`,
        description: `${data.restaurant.name} · ${data.date} ${data.time} · ${data.roomName}`,
        images: [{
          url: `${baseUrl}/api/og?title=${encodeURIComponent(data.title)}&host=${encodeURIComponent(data.hostName)}&date=${encodeURIComponent(data.date)}`,
          width: 1200,
          height: 630,
          alt: data.title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data.title} · ${data.hostName}的宴请邀请`,
        description: `${data.restaurant.name} · ${data.date} ${data.time}`,
        images: [`${baseUrl}/api/og?title=${encodeURIComponent(data.title)}&host=${encodeURIComponent(data.hostName)}&date=${encodeURIComponent(data.date)}`]
      }
    }
  } catch (error) {
    return {
      title: '烧鸟料理邀约函',
      description: '烧师富·板前创作烧鸟邀约函'
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
