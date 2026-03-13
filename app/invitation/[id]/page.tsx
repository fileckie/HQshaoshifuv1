'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Download, MapPin, Phone, Printer, ArrowLeft, Share2 } from 'lucide-react'
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
  const router = useRouter()
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

  // 导出图片 - 使用可靠的方式
  const exportCard = useCallback(async () => {
    if (!cardRef.current) {
      alert('卡片未加载完成，请稍后再试')
      return
    }
    
    setExporting(true)
    
    try {
      // 动态导入 dom-to-image-more
      const domtoimage = await import('dom-to-image-more')
      
      const element = cardRef.current
      
      // 确保元素有明确的背景色
      const originalBg = element.style.backgroundColor
      element.style.backgroundColor = '#0a0a0a'
      
      // 等待字体加载
      await document.fonts.ready
      
      // 生成 JPEG
      const dataUrl = await domtoimage.toJpeg(element, {
        quality: 0.95,
        pixelRatio: 2,
        bgcolor: '#0a0a0a',
        style: {
          backgroundColor: '#0a0a0a',
        },
        // 过滤掉可能影响渲染的元素
        filter: (node: Node) => {
          const element = node as HTMLElement;
          if (element.classList && element.classList.contains('no-print')) {
            return false
          }
          return true
        }
      })
      
      // 恢复原背景
      element.style.backgroundColor = originalBg
      
      // 下载
      const link = document.createElement('a')
      link.download = `烧师富_${data?.hostName || '邀约'}_${Date.now()}.jpg`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      
      // 延迟移除链接
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
      
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出图片失败，请尝试使用浏览器截图功能（Ctrl+Shift+S 或 Cmd+Shift+4）')
    } finally {
      setExporting(false)
    }
  }, [data?.hostName])

  // 打印功能
  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }, [])

  // 分享功能
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `烧师富预约 - ${data?.hostName}`,
          text: `您有一张烧师富预约邀请函，日期：${data?.date} ${data?.time}`,
          url: window.location.href,
        })
      } catch {
        // 用户取消
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }, [data])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { month: '--', day: '--' }
    try {
      const date = new Date(dateStr)
      return {
        month: date.getMonth() + 1,
        day: date.getDate(),
      }
    } catch {
      return { month: '--', day: '--' }
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">加载中...</div>
  if (!data) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">未找到邀请信息</div>

  const dateInfo = formatDate(data.date)

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      {/* 顶部导航栏 */}
      <div className="max-w-sm mx-auto mb-6 flex items-center justify-between no-print">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontFamily: 'serif' }}>返回</span>
        </button>
        <h1 className="text-white/80 text-lg" style={{ fontFamily: 'serif' }}>邀约卡</h1>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="max-w-sm mx-auto mb-8 flex flex-wrap gap-2 no-print">
        <Link href={`/print/${params.id}?type=table`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-black text-sm hover:bg-white/90 min-w-[80px]">
          <Printer className="w-4 h-4" />
          桌上版
        </Link>
        <Link href={`/print/${params.id}?type=staff`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-black text-sm hover:bg-white/90 min-w-[80px]">
          <Printer className="w-4 h-4" />
          员工版
        </Link>
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-white/40 text-white text-sm hover:bg-white/10 min-w-[80px]"
        >
          <Printer className="w-4 h-4" />
          打印
        </button>
        <button
          onClick={exportCard}
          disabled={exporting}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-white/40 text-white text-sm hover:bg-white/10 disabled:opacity-50 min-w-[80px]"
        >
          <Download className="w-4 h-4" />
          {exporting ? '导出中...' : '保存JPG'}
        </button>
      </div>

      {/* 邀约卡 */}
      <div 
        ref={cardRef}
        id="invitation-card"
        className="max-w-sm mx-auto bg-[#0a0a0a]"
        style={{ 
          backgroundColor: '#0a0a0a',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="h-2 bg-[#c41e3a]"></div>
        
        <div className="p-8" style={{ backgroundColor: '#0a0a0a' }}>
          {/* Logo */}
          <div className="text-center mb-8" style={{ backgroundColor: '#0a0a0a' }}>
            <h1 className="text-6xl text-white mb-4 tracking-widest" style={{ fontFamily: 'serif', fontWeight: 700 }}>
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

          {/* 品牌关键词 */}
          <div className="flex justify-center gap-4 mb-8 py-4 border-y border-white/10">
            {BRAND_KEYWORDS.map((keyword, i) => (
              <div key={i} className="text-center">
                <div className="text-white/80 text-xs tracking-widest" style={{ fontFamily: 'serif' }}>
                  {keyword.text}
                </div>
                <div className="text-white/30 text-[8px] mt-1 tracking-wider">
                  {keyword.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 日期 */}
          <div className="text-center mb-8 py-6 border-y border-white/20">
            <div className="text-5xl text-white mb-2 tracking-wider" style={{ fontFamily: 'serif', fontWeight: 700 }}>
              {dateInfo.month}月{dateInfo.day}日
            </div>
            <div className="text-lg text-white/50 tracking-widest">
              {data.time} · {data.roomName}
            </div>
          </div>

          {/* 信息 */}
          <div className="space-y-3 mb-8 text-base" style={{ fontFamily: 'serif' }}>
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

          {/* 今日推荐 */}
          <div className="mb-8">
            <h2 className="text-lg text-white mb-4 text-center tracking-[0.15em]" style={{ fontFamily: 'serif' }}>
              今日炭火料理推荐
            </h2>
            <div className="space-y-3" style={{ fontFamily: 'serif' }}>
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm w-24">主厨限定串</span>
                <span className="text-white/40 text-sm flex-1 border-b border-white/10 pb-1">
                  {(data.menu && data.menu[0]?.name) || ''}
                </span>
                <span className="text-white/20 text-sm w-12 text-right">____</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm w-24">当季时令烧鸟</span>
                <span className="text-white/40 text-sm flex-1 border-b border-white/10 pb-1">
                  {(data.menu && data.menu[1]?.name) || ''}
                </span>
                <span className="text-white/20 text-sm w-12 text-right">____</span>
              </div>
            </div>
          </div>

          {/* 地址 */}
          <div className="pt-6 border-t border-white/20 mb-6">
            <div className="flex items-start gap-2 text-xs text-white/50 mb-3" style={{ fontFamily: 'serif' }}>
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="mb-1">双塔街道竹辉路168号环宇荟·L133</p>
                <p className="text-white/30 leading-relaxed">
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
            <h2 className="text-lg text-white mb-4 text-center tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
              关于烧师富
            </h2>
            <div className="text-sm text-white/50 leading-relaxed text-center space-y-2" style={{ fontFamily: 'serif' }}>
              <p>在很多城市里，烧鸟是一种很有烟火气的料理。</p>
              <p>下班以后，坐在吧台前，点几串烧鸟，喝一点酒，聊一会天。</p>
              <p>这种简单的快乐，一直存在。</p>
              <p>但大多数烧鸟店的菜单，十几年几乎没有变化。</p>
              <p>烧师富想做的事情，是让烧鸟重新变成一种可以创作的料理。</p>
              <p>所以我们把自己定义为「板前创作」。</p>
            </div>
          </div>

          {/* 氛围文案 */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'serif' }}>
              不只是一家烧鸟店
            </p>
            <p className="text-white/40 text-xs mt-2 italic" style={{ fontFamily: 'serif' }}>
              更是"烧鸟料理的创作道场"
            </p>
          </div>
        </div>

        <div className="h-2 bg-[#c41e3a]"></div>
      </div>

      <p className="text-center text-xs text-white/20 mt-8 no-print" style={{ fontFamily: 'serif' }}>
        长按保存图片或点击上方按钮
      </p>
    </div>
  )
}
