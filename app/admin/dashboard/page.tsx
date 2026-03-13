'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Users, Clock, TrendingUp, Bell, ChevronRight } from 'lucide-react'

interface TodayData {
  today: {
    date: string
    totalBanquets: number
    totalGuests: number
    occupancyRate: number
  }
  banquets: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<TodayData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/today')
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  if (!data) return <div className="min-h-screen flex items-center justify-center">加载失败</div>

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium">今日运营看板</h1>
              <p className="text-sm text-[#8A8A8A]">{data.today.date}</p>
            </div>
            <Link href="/admin/list" className="text-sm text-[#C9A962] hover:text-[#B87333]">
              查看全部 →
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* 数据卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#E5E0D8] p-4">
            <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">今日预订</span>
            </div>
            <div className="text-2xl font-medium">{data.today.totalBanquets} <span className="text-sm text-[#8A8A8A]">场</span></div>
          </div>
          
          <div className="bg-white rounded-lg border border-[#E5E0D8] p-4">
            <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">预计宾客</span>
            </div>
            <div className="text-2xl font-medium">{data.today.totalGuests} <span className="text-sm text-[#8A8A8A]">人</span></div>
          </div>
          
          <div className="bg-white rounded-lg border border-[#E5E0D8] p-4">
            <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">上座率</span>
            </div>
            <div className="text-2xl font-medium">{data.today.occupancyRate}%</div>
          </div>
          
          <div className="bg-white rounded-lg border border-[#E5E0D8] p-4">
            <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
              <Bell className="w-4 h-4" />
              <span className="text-sm">待办提醒</span>
            </div>
            <div className="text-2xl font-medium">0 <span className="text-sm text-[#8A8A8A]">条</span></div>
          </div>
        </div>

        {/* 今日预订时间轴 */}
        <div className="bg-white rounded-lg border border-[#E5E0D8] p-6">
          <h2 className="font-medium mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C9A962]" />
            今日预订时间轴
          </h2>
          
          {data.banquets.length === 0 ? (
            <div className="text-center py-12 text-[#8A8A8A]">
              今日暂无预订
            </div>
          ) : (
            <div className="space-y-4">
              {data.banquets.map((banquet, index) => (
                <Link
                  key={banquet.id}
                  href={`/admin/list?highlight=${banquet.id}`}
                  className="flex items-center gap-4 p-4 border border-[#E5E0D8] rounded-lg hover:border-[#C9A962] transition-colors"
                >
                  <div className="w-16 text-center">
                    <div className="text-lg font-medium">{banquet.time}</div>
                  </div>
                  <div className="w-px h-10 bg-[#E5E0D8]" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{banquet.title}</span>
                      {banquet.customer?.totalVisits >= 2 && (
                        <span className="px-2 py-0.5 bg-[#C9A962] text-white text-xs rounded">
                          回头客
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#8A8A8A]">
                      {banquet.hostName} · {banquet.roomName} · {banquet.guestCount}人
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8A8A8A]" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
