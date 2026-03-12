'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { toPng } from 'html-to-image'
import { Download, MapPin, Phone, Printer } from 'lucide-react'
import Link from 'next/link'

interface BanquetData {
  id: string
  title: string
  date: string
  time: string
  guestCount: number
  roomName: string
  hostName: string
  hostPhone: string
  note?: string
  menu: { name: string; desc: string }[]
  restaurant: {
    name: string
    address: string
    phone: string
  }
}

// 品牌关键词
const BRAND_KEYWORDS = [
  { text: '板前创作', desc: 'Chef\'s Counter Creation' },
  { text: '风土食材', desc: 'Terroir Ingredients' },
  { text: '小聚场', desc: 'Intimate Gathering' }
]

export default function InvitationPage() {
  const params = useParams()
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/banquet/${params.id}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [params.id])

  const exportCard = async () => {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `烧师富_${data?.hostName}_邀约.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      month: date.getMonth() + 1,
      day: date.getDate(),
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">加载中...</div>
  if (!data) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">未找到</div>

  const dateInfo = formatDate(data.date)

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      {/* 操作按钮 */}
      <div className="max-w-sm mx-auto mb-8 flex justify-between no-print">
        <Link href={`/print/${params.id}?type=table`} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm hover:bg-white/90">
          <Printer className="w-4 h-4" />
          桌上版
        </Link>
        <Link href={`/print/${params.id}?type=staff`} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm hover:bg-white/90">
          <Printer className="w-4 h-4" />
          员工版
        </Link>
        <button
          onClick={exportCard}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 border border-white/40 text-white text-sm hover:bg-white/10"
        >
          <Download className="w-4 h-4" />
          {exporting ? '导出中...' : '保存'}
        </button>
      </div>

      {/* 邀约卡 */}
      <div 
        ref={cardRef}
        className="max-w-sm mx-auto bg-[#0a0a0a] border border-white/20"
      >
        {/* 顶部细红线 */}
        <div className="h-1 bg-[#c41e3a]"></div>
        
        <div className="p-8">
          {/* 头部 Logo */}
          <div className="text-center mb-10">
            {/* 书法字 */}
            <h1 className="text-7xl text-white mb-6 tracking-widest" style={{ fontFamily: 'serif', fontWeight: 700 }}>
              烧师富
            </h1>
            
            {/* 红圈圈修饰 板前创作烧鸟 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>板</span>
              </div>
              <div className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>前</span>
              </div>
              <div className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>创</span>
              </div>
              <div className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>作</span>
              </div>
              <div className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>烧</span>
              </div>
              <div className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>鸟</span>
              </div>
            </div>
          </div>

          {/* 品牌关键词 */}
          <div className="flex justify-center gap-6 mb-8 py-4 border-y border-white/10">
            {BRAND_KEYWORDS.map((keyword, i) => (
              <div key={i} className="text-center">
                <div className="text-white/80 text-sm tracking-widest" style={{ fontFamily: 'serif' }}>
                  {keyword.text}
                </div>
                <div className="text-white/30 text-[10px] mt-1 tracking-wider">
                  {keyword.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 日期时间 */}
          <div className="text-center mb-10 py-6 border-y border-white/20">
            <div className="text-5xl text-white mb-2 tracking-wider" style={{ fontFamily: 'serif', fontWeight: 700 }}>
              {dateInfo.month}月{dateInfo.day}日
            </div>
            <div className="text-lg text-white/50 tracking-widest">
              {data.time} · {data.roomName}
            </div>
          </div>

          {/* 信息 */}
          <div className="space-y-4 mb-10 text-base" style={{ fontFamily: 'serif' }}>
            <div className="flex justify-between text-white">
              <span className="text-white/50">人数</span>
              <span>{data.guestCount}位</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="text-white/50">组局</span>
              <span>{data.hostName}</span>
            </div>
            {data.title && data.title !== '邀请函' && (
              <div className="flex justify-between text-white">
                <span className="text-white/50">主题</span>
                <span>{data.title}</span>
              </div>
            )}
          </div>

          {/* 今日炭火料理推荐 */}
          <div className="mb-10">
            <h2 className="text-lg text-white mb-6 text-center tracking-[0.15em]" style={{ fontFamily: 'serif' }}>
              今日炭火料理推荐
            </h2>
            <div className="space-y-4" style={{ fontFamily: 'serif' }}>
              {/* 主厨限定串 */}
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm w-24">主厨限定串</span>
                <span className="text-white/40 text-sm flex-1 border-b border-white/10 pb-1">
                  {(data.menu && data.menu[0]?.name) || ''}
                </span>
                <span className="text-white/20 text-sm w-16 text-right">_____</span>
              </div>
              {/* 当季时令烧鸟 */}
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm w-24">当季时令烧鸟</span>
                <span className="text-white/40 text-sm flex-1 border-b border-white/10 pb-1">
                  {(data.menu && data.menu[1]?.name) || ''}
                </span>
                <span className="text-white/20 text-sm w-16 text-right">_____</span>
              </div>
            </div>
          </div>

          {/* 地址和交通指引 */}
          <div className="pt-6 border-t border-white/20 mb-8">
            <div className="flex items-start gap-2 text-sm text-white/50 mb-3" style={{ fontFamily: 'serif' }}>
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/50" />
              <div>
                <p className="mb-2">双塔街道竹辉路168号环宇荟·L133</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  环宇荟Manner旁下地库，到底右转到底再右转，
                  橙色B区停车，客梯到一楼左手边即达
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-base text-white/60" style={{ fontFamily: 'serif' }}>
              <Phone className="w-4 h-4" />
              <span>177 1554 9313</span>
            </div>
          </div>

          {/* 品牌故事 */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-lg text-white mb-6 text-center tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
              关于烧师富
            </h2>
            <div className="text-base text-white/50 leading-loose text-center space-y-4" style={{ fontFamily: 'serif' }}>
              <p>在很多城市里，烧鸟是一种很有烟火气的料理。</p>
              <p>下班以后，坐在吧台前，点几串烧鸟，喝一点酒，聊一会天。</p>
              <p className="py-2">这种简单的快乐，一直存在。</p>
              <p>但大多数烧鸟店的菜单，十几年几乎没有变化。</p>
              <p className="py-2">烧师富想做的事情，是让烧鸟重新变成一种可以创作的料理。</p>
              <p>所以我们把自己定义为「板前创作」。</p>
              <p className="py-2">在烧师富，烧鸟不是流水线的产品。</p>
              <p>厨师站在炭火前，根据食材的状态进行组合。</p>
            </div>
          </div>

          {/* 氛围文案 */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-base leading-relaxed" style={{ fontFamily: 'serif' }}>
              不只是一家烧鸟店
            </p>
            <p className="text-white/40 text-sm mt-2 italic" style={{ fontFamily: 'serif' }}>
              更是"烧鸟料理的创作道场"
            </p>
          </div>
        </div>

        {/* 底部细红线 */}
        <div className="h-1 bg-[#c41e3a]"></div>
      </div>

      <p className="text-center text-sm text-white/20 mt-8 no-print" style={{ fontFamily: 'serif' }}>
        长按保存图片或点击打印按钮
      </p>
    </div>
  )
}
