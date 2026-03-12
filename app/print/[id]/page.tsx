'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { toPng } from 'html-to-image'
import { Download, MapPin, Phone, AlertCircle, User, CreditCard, ClipboardList } from 'lucide-react'

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
  // 新增员工版字段
  vipLevel?: string
  bookingChannel?: string
  paymentStatus?: string
  dietaryRestrictions?: string
  handoverNotes?: string
  prepReminder?: string
}

// 品牌关键词
const BRAND_KEYWORDS = [
  { text: '板前创作', desc: 'Chef\'s Counter' },
  { text: '风土食材', desc: 'Terroir' },
  { text: '小聚场', desc: 'Gathering' }
]

export default function PrintPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'table'
  const [data, setData] = useState<BanquetData | null>(null)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/banquet/${params.id}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [params.id])

  const exportCard = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `烧师富_${data?.hostName}_${type === 'table' ? '桌上' : '员工'}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      alert('导出失败')
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

  // 桌上版 - 大字，完整品牌故事
  if (type === 'table') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
        {/* 导出按钮 */}
        <div className="mb-8 flex justify-center no-print">
          <button
            onClick={exportCard}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90"
            style={{ fontFamily: 'serif' }}
          >
            <Download className="w-5 h-5" />
            导出PNG
          </button>
        </div>

        {/* 桌上展示版 */}
        <div 
          ref={cardRef}
          className="w-[420px] mx-auto bg-[#0a0a0a] border border-white/20"
        >
          {/* 顶部细红线 */}
          <div className="h-1 bg-[#c41e3a]"></div>
          
          <div className="p-10">
            {/* Logo 头部 */}
            <div className="text-center mb-8">
              <h1 className="text-6xl text-white mb-6 tracking-widest" style={{ fontFamily: 'serif', fontWeight: 700 }}>
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
            <div className="text-center mb-8 py-6 border-y border-white/20">
              <div className="text-5xl text-white mb-3 tracking-wider" style={{ fontFamily: 'serif', fontWeight: 700 }}>
                {dateInfo.month}月{dateInfo.day}日
              </div>
              <div className="text-lg text-white/50 tracking-widest" style={{ fontFamily: 'serif' }}>
                {data.time} · {data.roomName}
              </div>
            </div>

            {/* 客人信息 */}
            <div className="space-y-4 mb-8 text-lg" style={{ fontFamily: 'serif' }}>
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
            <div className="mb-8">
              <h2 className="text-lg text-white mb-5 text-center tracking-[0.15em]" style={{ fontFamily: 'serif' }}>
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

            {/* 地址和电话 */}
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
              <div className="flex items-center gap-2 text-lg text-white/60" style={{ fontFamily: 'serif' }}>
                <Phone className="w-4 h-4" />
                <span>177 1554 9313</span>
              </div>
            </div>

            {/* 品牌故事 */}
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-lg text-white mb-5 text-center tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
                关于烧师富
              </h2>
              <div className="text-sm text-white/50 leading-loose space-y-3 text-center" style={{ fontFamily: 'serif' }}>
                <p>在很多城市里，烧鸟是一种很有烟火气的料理。</p>
                <p>下班以后，坐在吧台前，点几串烧鸟，喝一点酒，聊一会天。</p>
                <p>这种简单的快乐，一直存在。</p>
                <p>但大多数烧鸟店的菜单，十几年几乎没有变化。</p>
                <p>烧师富想做的事情，是让烧鸟重新变成一种可以创作的料理。</p>
                <p>所以我们把自己定义为「板前创作」。</p>
                <p>在烧师富，烧鸟不是流水线的产品。</p>
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

        <p className="text-center text-sm text-white/30 mt-8 no-print" style={{ fontFamily: 'serif' }}>
          适合放在桌上给客人看的版本
        </p>
      </div>
    )
  }

  // 员工版 - 内部工作备忘（省略，保持原样）
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      {/* 导出按钮 */}
      <div className="mb-8 flex justify-center no-print">
        <button
          onClick={exportCard}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90"
          style={{ fontFamily: 'serif' }}
        >
          <Download className="w-5 h-5" />
          导出PNG
        </button>
      </div>

      {/* 员工内部版 */}
      <div 
        ref={cardRef}
        className="w-[400px] mx-auto bg-[#0a0a0a] border border-white/20"
      >
        {/* 顶部标识 */}
        <div className="bg-[#c41e3a] px-6 py-3 flex justify-between items-center">
          <span className="text-white text-sm tracking-widest" style={{ fontFamily: 'serif' }}>
            内部 · 员工备忘
          </span>
          <span className="text-white/70 text-xs" style={{ fontFamily: 'serif' }}>
            请勿外泄
          </span>
        </div>

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-4xl text-white mb-2" style={{ fontFamily: 'serif', fontWeight: 700 }}>
              烧师富
            </h1>
            <p className="text-sm text-white/50 tracking-widest" style={{ fontFamily: 'serif' }}>
              板前创作
            </p>
          </div>

          {/* 核心预订信息 */}
          <div className="space-y-3 mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex justify-between text-white text-base">
              <span className="text-white/50">日期</span>
              <span>{dateInfo.month}/{dateInfo.day} ({data.time})</span>
            </div>
            <div className="flex justify-between text-white text-base">
              <span className="text-white/50">包厢</span>
              <span>{data.roomName}</span>
            </div>
            <div className="flex justify-between text-white text-base">
              <span className="text-white/50">人数</span>
              <span>{data.guestCount}位</span>
            </div>
          </div>

          {/* 客人信息 */}
          <div className="space-y-3 mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#c41e3a]" />
              <span className="text-[#c41e3a] text-sm">客人信息</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="text-white/50">组局人</span>
              <span>{data.hostName}</span>
            </div>
            {data.hostPhone && (
              <div className="flex justify-between text-white">
                <span className="text-white/50">电话</span>
                <span className="text-base">{data.hostPhone}</span>
              </div>
            )}
            <div className="flex justify-between text-white">
              <span className="text-white/50">VIP等级</span>
              <span className="text-white/40">—</span>
            </div>
          </div>

          {/* 预订渠道与付款 */}
          <div className="space-y-3 mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-[#c41e3a]" />
              <span className="text-[#c41e3a] text-sm">预订信息</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="text-white/50">预订渠道</span>
              <span className="text-white/40">□微信 □电话 □点评</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="text-white/50">付款状态</span>
              <span className="text-white/40">□预付 □到付</span>
            </div>
          </div>

          {/* 饮食禁忌 */}
          <div className="mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-[#c41e3a]" />
              <span className="text-[#c41e3a] text-sm">饮食禁忌 / 过敏</span>
            </div>
            <div className="bg-white/5 p-3 min-h-[60px] text-white/70 text-sm">
              {data.dietaryRestrictions || '□无  □海鲜  □花生  □其他：________'}
            </div>
          </div>

          {/* 备餐提醒 */}
          <div className="mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-[#c41e3a]" />
              <span className="text-[#c41e3a] text-sm">备餐提醒</span>
            </div>
            <div className="bg-white/5 p-3 min-h-[60px] text-white/70 text-sm">
              {data.prepReminder || '_________________________________\n_________________________________'}
            </div>
          </div>

          {/* 交接备注 */}
          <div className="mb-6" style={{ fontFamily: 'serif' }}>
            <div className="text-[#c41e3a] text-sm mb-3">服务员交接备注</div>
            <div className="bg-white/5 p-3 min-h-[80px] text-white/70 text-sm">
              {data.handoverNotes || '_________________________________\n_________________________________\n_________________________________'}
            </div>
          </div>

          {/* 现场沟通 - 手写留白 */}
          <div className="mb-6" style={{ fontFamily: 'serif' }}>
            <div className="text-white/60 text-sm mb-3">现场提前沟通事项（手写）</div>
            <div className="border border-white/20 p-4 min-h-[100px] bg-[#0a0a0a]">
              <div className="text-white/20 text-xs">_________________________________</div>
              <div className="text-white/20 text-xs mt-2">_________________________________</div>
              <div className="text-white/20 text-xs mt-2">_________________________________</div>
              <div className="text-white/20 text-xs mt-2">_________________________________</div>
            </div>
          </div>

          {/* 停车指引 */}
          <div className="pt-4 border-t border-white/10" style={{ fontFamily: 'serif' }}>
            <div className="text-white/50 text-xs mb-2">停车指引</div>
            <p className="text-white/30 text-xs leading-relaxed">
              环宇荟Manner旁下地库，到底右转到底再右转，
              橙色B区停车，客梯到一楼左手边即达
            </p>
          </div>

          {/* 门店电话 */}
          <div className="mt-4 pt-4 border-t border-white/10" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 text-white/50">
              <Phone className="w-3 h-3" />
              <span className="text-sm">177 1554 9313</span>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="bg-[#c41e3a]/10 px-6 py-3 text-center">
          <span className="text-white/40 text-xs" style={{ fontFamily: 'serif' }}>
            此备忘仅限内部使用 · 请勿向客人展示
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-white/30 mt-8 no-print" style={{ fontFamily: 'serif' }}>
        员工内部使用，含手写留白区域
      </p>
    </div>
  )
}
