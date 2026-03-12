import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hqinvitation.vercel.app'
    const response = await fetch(`${baseUrl}/api/banquet/${params.id}`, {
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
      title: '私宴邀请函',
      description: '平江颂私域宴请邀请函'
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
