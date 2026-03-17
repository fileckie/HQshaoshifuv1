'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { toJpeg } from 'html-to-image'
import { Download, MapPin, Phone, AlertCircle, User, CreditCard, ClipboardList, Printer, ArrowLeft, ArrowRight } from 'lucide-react'

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
  { text: '小聚酒场', desc: 'Gathering' }
]

export default function PrintPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
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

  // 导出 JPG
  const exportCard = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toJpeg(cardRef.current, { 
        quality: 0.95, 
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
        cacheBust: true,
        skipFonts: true,
      })
      const link = document.createElement('a')
      link.download = `烧师富_${data?.hostName}_${type === 'table' ? '桌上' : '员工'}.jpg`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  // 打印
  const handlePrint = () => {
    window.print()
  }

  // 切换版本
  const switchType = () => {
    const newType = type === 'table' ? 'staff' : 'table'
    router.push(`/print/${params.id}?type=${newType}`)
  }

  const formatDate = (dateStr: string) => {
    // 解析 YYYY-MM-DD 格式，避免时区问题
    const [year, month, day] = dateStr.split('-').map(Number)
    return {
      month: month,
      day: day,
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">加载中...</div>
  if (!data) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">未找到</div>

  const dateInfo = formatDate(data.date)

  // 桌上版
  if (type === 'table') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
        {/* 顶部导航 */}
        <div className="max-w-lg mx-auto mb-6 flex items-center justify-between no-print">
          <button 
            onClick={() => router.push(`/invitation/${params.id}`)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: 'serif' }}>返回邀约卡</span>
          </button>
          <h1 className="text-white/80 text-lg" style={{ fontFamily: 'serif' }}>桌上展示版</h1>
        </div>

        {/* 操作按钮 */}
        <div className="max-w-lg mx-auto mb-8 flex flex-wrap gap-2 no-print">
          <button
            onClick={exportCard}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-white/90"
          >
            <Download className="w-5 h-5" />
            导出JPG
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-white/40 text-white hover:bg-white/10"
          >
            <Printer className="w-5 h-5" />
            打印
          </button>
          <button
            onClick={switchType}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40"
          >
            <span style={{ fontFamily: 'serif' }}>员工版</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 桌上展示版卡片 */}
        <div 
          ref={cardRef}
          className="w-[420px] mx-auto bg-[#0a0a0a] border-2 border-white/30"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <div className="h-2 bg-[#c41e3a]"></div>
          
          <div className="p-10" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-center mb-8">
              <h1 className="text-6xl text-white mb-6 tracking-widest" style={{ fontFamily: 'serif', fontWeight: 700 }}>
                烧师富
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {['板', '前', '创', '作', '烧', '鸟'].map((char, i) => (
                  <div key={i} className="w-8 h-8 border border-[#c41e3a] rounded-full flex items-center justify-center">
                    <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>{char}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-xl text-white/60 tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
                烧鸟料理的创作道场
              </p>
            </div>

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

            <div className="text-center mb-8 py-6 border-y border-white/20">
              <div className="text-5xl text-white mb-3 tracking-wider" style={{ fontFamily: 'serif', fontWeight: 700 }}>
                {dateInfo.month}月{dateInfo.day}日
              </div>
              <div className="text-lg text-white/50 tracking-widest" style={{ fontFamily: 'serif' }}>
                {data.time} · {data.roomName}
              </div>
            </div>

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

            <div className="mb-8">
              <h2 className="text-lg text-white mb-6 text-center tracking-[0.15em]" style={{ fontFamily: 'serif' }}>
                今日推荐
              </h2>
              <div className="space-y-6" style={{ fontFamily: 'serif' }}>
                {/* 主厨限定串 */}
                <div className="text-center">
                  <div className="text-white text-base mb-1">
                    {(data.menu && data.menu[0]?.name) || '主厨限定串'}
                  </div>
                  <div className="text-white/40 text-xs">
                    主厨当日精选部位创作
                  </div>
                </div>
                {/* 当季时令烧鸟 */}
                <div className="text-center">
                  <div className="text-white text-base mb-1">
                    {(data.menu && data.menu[1]?.name) || '当季时令烧鸟'}
                  </div>
                  <div className="text-white/40 text-xs">
                    根据当日食材新鲜度呈现
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20 mb-8">
              <div className="flex items-start gap-2 text-sm text-white/50 mb-3" style={{ fontFamily: 'serif' }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
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

            <div className="pt-6 border-t border-white/10">
              <h2 className="text-lg text-white mb-5 text-center tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
                关于烧师富
              </h2>
              <div className="text-xs text-white/50 leading-relaxed space-y-2 text-center" style={{ fontFamily: 'serif' }}>
                <p>在很多城市里，烧鸟一直是一种很日常的存在。</p>
                <p>下班以后，找一家店，坐在吧台前，点几串鸡腿、鸡皮、鸡心，配点酒，聊几句天。</p>
                <p>它不复杂，也不需要被解释。这种简单的快乐，一直都在。</p>
                <p>但我们慢慢发现——大多数烧鸟店的菜单，十几年几乎没有变化。</p>
                <p>好像烧鸟这件事，早就被定义好了。</p>
                <p>烧师富想做的，是一件更"多此一举"的事情。</p>
                <p>我们不把烧鸟当成"已经完成的答案"，而是把它当成一种还可以继续被创作的料理。</p>
                <p>所以在这里，烧鸟不只是鸡肉的不同部位，也不只是调味和火候的变化。</p>
                <p>它可以和水果发生关系——青提卷进五花肉，黄油去烤杨桃，火腿和鸡腿重新组合。</p>
                <p>有些组合很好吃，有些还在尝试。</p>
                <p>但"变化"本身，就是这件事的意义。</p>
                <p>我们保留了板前。</p>
                <p>炭火、竹签、油脂滴落的声音都在现场发生。每一串烧鸟，都不是从厨房端出来的成品，而是在你面前完成的一次创作。</p>
                <p>有时候主厨不太爱说话，但前厅的伙伴会把每一串的想法讲给你听。</p>
                <p>烧师富不太像一家传统的烧鸟店。</p>
                <p>更像一个还在生长的、小小的料理现场。</p>
                <p>我们不确定每一道都会成为经典，但我们确定——烧鸟这件事，还没有被做完。</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-white/60 text-base leading-relaxed" style={{ fontFamily: 'serif' }}>
                不只是一家烧鸟店
              </p>
              <p className="text-white/40 text-sm mt-2 italic" style={{ fontFamily: 'serif' }}>
                更是"烧鸟料理的创作道场"
              </p>
            </div>
          </div>

          <div className="h-2 bg-[#c41e3a]"></div>
        </div>

        <p className="text-center text-sm text-white/30 mt-8 no-print" style={{ fontFamily: 'serif' }}>
          适合放在桌上给客人看的版本
        </p>
      </div>
    )
  }

  // 员工版
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      {/* 顶部导航 */}
      <div className="max-w-lg mx-auto mb-6 flex items-center justify-between no-print">
        <button 
          onClick={() => router.push(`/invitation/${params.id}`)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontFamily: 'serif' }}>返回邀约卡</span>
        </button>
        <h1 className="text-white/80 text-lg" style={{ fontFamily: 'serif' }}>员工备忘版</h1>
      </div>

      {/* 操作按钮 */}
      <div className="max-w-lg mx-auto mb-8 flex flex-wrap gap-2 no-print">
        <button
          onClick={exportCard}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-white/90"
        >
          <Download className="w-5 h-5" />
          导出JPG
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-white/40 text-white hover:bg-white/10"
        >
          <Printer className="w-5 h-5" />
          打印
        </button>
        <button
          onClick={switchType}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40"
        >
          <ArrowRight className="w-4 h-4" />
          <span style={{ fontFamily: 'serif' }}>桌上版</span>
        </button>
      </div>

      {/* 员工版卡片 */}
      <div 
        ref={cardRef}
        className="w-[400px] mx-auto bg-[#0a0a0a] border-2 border-white/30"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <div className="bg-[#c41e3a] px-6 py-3 flex justify-between items-center">
          <span className="text-white text-sm tracking-widest" style={{ fontFamily: 'serif' }}>
            内部 · 员工备忘
          </span>
          <span className="text-white/70 text-xs" style={{ fontFamily: 'serif' }}>
            请勿外泄
          </span>
        </div>

        <div className="p-8" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="text-center mb-6">
            <h1 className="text-4xl text-white mb-2" style={{ fontFamily: 'serif', fontWeight: 700 }}>
              烧师富
            </h1>
            <p className="text-sm text-white/50 tracking-widest" style={{ fontFamily: 'serif' }}>
              板前创作
            </p>
          </div>

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

          <div className="mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-[#c41e3a]" />
              <span className="text-[#c41e3a] text-sm">饮食禁忌 / 过敏</span>
            </div>
            <div className="bg-white/5 p-3 min-h-[60px] text-white/70 text-sm">
              {data.dietaryRestrictions || '□无  □海鲜  □花生  □其他：________'}
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-white/20" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-[#c41e3a]" />
              <span className="text-[#c41e3a] text-sm">备餐提醒</span>
            </div>
            <div className="bg-white/5 p-3 min-h-[60px] text-white/70 text-sm">
              {data.prepReminder || '_________________________________\n_________________________________'}
            </div>
          </div>

          <div className="mb-6" style={{ fontFamily: 'serif' }}>
            <div className="text-[#c41e3a] text-sm mb-3">服务员交接备注</div>
            <div className="bg-white/5 p-3 min-h-[80px] text-white/70 text-sm">
              {data.handoverNotes || '_________________________________\n_________________________________\n_________________________________'}
            </div>
          </div>

          <div className="mb-6" style={{ fontFamily: 'serif' }}>
            <div className="text-white/60 text-sm mb-3">现场提前沟通事项（手写）</div>
            <div className="border border-white/20 p-4 min-h-[100px] bg-[#0a0a0a]">
              <div className="text-white/20 text-xs">_________________________________</div>
              <div className="text-white/20 text-xs mt-2">_________________________________</div>
              <div className="text-white/20 text-xs mt-2">_________________________________</div>
              <div className="text-white/20 text-xs mt-2">_________________________________</div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10" style={{ fontFamily: 'serif' }}>
            <div className="text-white/50 text-xs mb-2">停车指引</div>
            <p className="text-white/30 text-xs leading-relaxed">
              环宇荟Manner旁下地库，到底右转到底再右转，
              橙色B区停车，客梯到一楼左手边即达
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10" style={{ fontFamily: 'serif' }}>
            <div className="flex items-center gap-2 text-white/50">
              <Phone className="w-3 h-3" />
              <span className="text-sm">177 1554 9313</span>
            </div>
          </div>
        </div>

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
