'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Plus, MapPin, Users, ChevronLeft } from 'lucide-react'

// 座位类型定义
interface Table {
  id: string
  name: string
  type: 'counter' | 'booth' | 'private_small' | 'private_large'
  x: number
  y: number
  width: number
  height: number
  capacity: number
  banquet?: {
    id: string
    hostName: string
    guestCount: number
    time: string
  }
}

interface Banquet {
  id: string
  hostName: string
  guestCount: number
  time: string
  tableId: string
  status: string
}

// 座位类型样式
const TABLE_STYLES = {
  counter: {
    bg: 'bg-white/10',
    border: 'border-white/30',
    label: '板前',
    shape: 'rounded-none'
  },
  booth: {
    bg: 'bg-white/10',
    border: 'border-white/30',
    label: '卡座',
    shape: 'rounded-md'
  },
  private_small: {
    bg: 'bg-white/5',
    border: 'border-white/20',
    label: '小包厢',
    shape: 'rounded-lg'
  },
  private_large: {
    bg: 'bg-white/5',
    border: 'border-white/20',
    label: '大包厢',
    shape: 'rounded-xl'
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return {
    value: dateStr,
    label: `${month}月${day}日`,
    week: weeks[date.getDay()]
  }
}

export default function TableMapPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  
  const [tables, setTables] = useState<Table[]>([])
  const [banquets, setBanquets] = useState<Banquet[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 16, reserved: 0, available: 16 })

  // 初始化座位数据
  useEffect(() => {
    const initTables: Table[] = [
      // 板前 - 10个位置（长条排列，分两排）
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `counter-${i + 1}`,
        name: `板前${i + 1}号`,
        type: 'counter' as const,
        x: 8 + (i % 5) * 17,
        y: 12 + Math.floor(i / 5) * 10,
        width: 13,
        height: 7,
        capacity: 1
      })),
      // 卡座 - 4个
      { id: 'booth-1', name: '卡座A', type: 'booth' as const, x: 8, y: 42, width: 18, height: 14, capacity: 4 },
      { id: 'booth-2', name: '卡座B', type: 'booth' as const, x: 30, y: 42, width: 18, height: 14, capacity: 4 },
      { id: 'booth-3', name: '卡座C', type: 'booth' as const, x: 52, y: 42, width: 18, height: 14, capacity: 4 },
      { id: 'booth-4', name: '卡座D', type: 'booth' as const, x: 74, y: 42, width: 18, height: 14, capacity: 4 },
      // 小包厢 - 1个
      { id: 'private-small-1', name: '小包厢', type: 'private_small' as const, x: 8, y: 62, width: 38, height: 28, capacity: 6 },
      // 大包厢 - 1个
      { id: 'private-large-1', name: '大包厢', type: 'private_large' as const, x: 54, y: 62, width: 38, height: 28, capacity: 12 }
    ]
    setTables(initTables)
  }, [])

  // 生成日期选择（前后3天+未来7天）
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = -3; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        label: `${date.getMonth() + 1}月${date.getDate()}日`,
        week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
        isToday: i === 0
      })
    }
    return dates
  }
  const dates = generateDates()

  // 加载预订数据
  useEffect(() => {
    const fetchBanquets = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/banquets?date=${currentDate}`)
        const data = await res.json()
        setBanquets(data.banquets || [])
        
        // 计算统计
        const reservedCount = data.banquets?.length || 0
        setStats({
          total: 16,
          reserved: reservedCount,
          available: 16 - reservedCount
        })
      } catch (error) {
        console.error('Failed to fetch banquets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanquets()
  }, [currentDate])

  // 合并座位和预订数据
  const tablesWithBookings = tables.map(table => {
    const banquet = banquets.find(b => b.tableId === table.id)
    return { ...table, banquet }
  })

  const getTableStatus = (table: Table) => {
    if (table.banquet) return 'reserved'
    return 'available'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 头部 */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span style={{ fontFamily: 'serif' }}>首页</span>
              </Link>
              <div className="w-px h-6 bg-white/20"></div>
              <Link href="/admin" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                <span style={{ fontFamily: 'serif' }}>预约管理</span>
              </Link>
              <h1 className="text-2xl text-white tracking-wider ml-2" style={{ fontFamily: 'serif' }}>
                座位平面图
              </h1>
            </div>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm hover:bg-white/90"
              style={{ fontFamily: 'serif' }}
            >
              <Plus className="w-4 h-4" />
              新建预订
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 日期选择器 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-white/50" />
            <span className="text-white/50 text-sm" style={{ fontFamily: 'serif' }}>选择日期</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map((date) => (
              <button
                key={date.value}
                onClick={() => setCurrentDate(date.value)}
                className={`flex-shrink-0 px-4 py-3 border ${
                  currentDate === date.value
                    ? 'bg-white border-white text-black'
                    : 'border-white/20 text-white/60 hover:border-white/40'
                } ${date.isToday ? 'ring-1 ring-white/20' : ''}`}
                style={{ fontFamily: 'serif' }}
              >
                <div className="text-sm">{date.label}</div>
                <div className="text-xs mt-1 opacity-70">{date.week}{date.isToday ? ' · 今天' : ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 border border-white/10 bg-white/5">
            <div className="text-white/50 text-sm mb-1" style={{ fontFamily: 'serif' }}>总座位</div>
            <div className="text-3xl text-white" style={{ fontFamily: 'serif' }}>{stats.total}</div>
            <div className="text-white/30 text-xs mt-1">板前10 + 卡座4 + 包厢2</div>
          </div>
          <div className="p-4 border border-[#c41e3a]/30 bg-[#c41e3a]/5">
            <div className="text-[#c41e3a]/70 text-sm mb-1" style={{ fontFamily: 'serif' }}>已预订</div>
            <div className="text-3xl text-[#c41e3a]" style={{ fontFamily: 'serif' }}>{stats.reserved}</div>
          </div>
          <div className="p-4 border border-white/10 bg-white/5">
            <div className="text-white/50 text-sm mb-1" style={{ fontFamily: 'serif' }}>空闲</div>
            <div className="text-3xl text-white" style={{ fontFamily: 'serif' }}>{stats.available}</div>
          </div>
        </div>

        {/* 图例 */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/10 border border-white/30"></div>
            <span className="text-white/50 text-sm" style={{ fontFamily: 'serif' }}>空闲</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#c41e3a]/20 border border-[#c41e3a]"></div>
            <span className="text-[#c41e3a] text-sm" style={{ fontFamily: 'serif' }}>已预订</span>
          </div>
        </div>

        {/* 平面图区域 */}
        <div className="relative bg-white/5 border border-white/10 rounded-lg p-8" style={{ minHeight: '500px' }}>
          {/* 餐厅布局 */}
          <div className="relative w-full" style={{ paddingBottom: '60%' }}>
            <div className="absolute inset-0">
              {/* 标题 */}
              <div className="absolute top-0 left-0 right-0 text-center">
                <span className="text-white/30 text-sm tracking-widest" style={{ fontFamily: 'serif' }}>
                  烧师富 · 板前创作烧鸟
                </span>
              </div>

              {/* 座位 */}
              {tablesWithBookings.map((table) => {
                const status = getTableStatus(table)
                const style = TABLE_STYLES[table.type]
                const isReserved = status === 'reserved'
                
                return (
                  <div
                    key={table.id}
                    className={`absolute border ${
                      isReserved 
                        ? 'bg-[#c41e3a]/20 border-[#c41e3a]' 
                        : 'bg-white/10 border-white/30 hover:border-white/50'
                    } ${style.shape} cursor-pointer transition-all hover:scale-105`}
                    style={{
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      width: `${table.width}%`,
                      height: `${table.height}%`,
                    }}
                    onClick={() => {
                      if (isReserved && table.banquet) {
                        window.open(`/invitation/${table.banquet.id}`, '_blank')
                      } else {
                        window.location.href = `/admin?date=${currentDate}&table=${table.id}`
                      }
                    }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center p-2">
                      <span className={`text-xs font-medium ${isReserved ? 'text-[#c41e3a]' : 'text-white/70'}`} style={{ fontFamily: 'serif' }}>
                        {table.name}
                      </span>
                      <span className={`text-xs mt-1 ${isReserved ? 'text-[#c41e3a]/70' : 'text-white/40'}`} style={{ fontFamily: 'serif' }}>
                        {table.capacity}人
                      </span>
                      {isReserved && table.banquet && (
                        <div className="mt-1 text-center">
                          <span className="text-[10px] text-[#c41e3a] block truncate max-w-full" style={{ fontFamily: 'serif' }}>
                            {table.banquet.hostName}
                          </span>
                          <span className="text-[10px] text-[#c41e3a]/70" style={{ fontFamily: 'serif' }}>
                            {table.banquet.time}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* 入口标识 */}
              <div 
                className="absolute flex items-center gap-1 text-white/30 text-xs"
                style={{ left: '48%', top: '92%' }}
              >
                <MapPin className="w-3 h-3" />
                <span style={{ fontFamily: 'serif' }}>入口</span>
              </div>

              {/* 厨房/板前区域标识 */}
              <div 
                className="absolute text-white/20 text-xs tracking-widest"
                style={{ left: '35%', top: '5%' }}
              >
                <span style={{ fontFamily: 'serif' }}>— 板前炭火区 —</span>
              </div>
            </div>
          </div>
        </div>

        {/* 今日预订列表 */}
        <div className="mt-8">
          <h3 className="text-white text-lg mb-4" style={{ fontFamily: 'serif' }}>
            当日预订 ({banquets.length})
          </h3>
          
          {banquets.length === 0 ? (
            <div className="text-white/30 text-center py-12 border border-white/10" style={{ fontFamily: 'serif' }}>
              暂无预订
            </div>
          ) : (
            <div className="space-y-3">
              {banquets.map((banquet) => (
                <Link
                  key={banquet.id}
                  href={`/invitation/${banquet.id}`}
                  className="flex items-center justify-between p-4 border border-white/10 bg-white/5 hover:border-white/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c41e3a]/10 border border-[#c41e3a]/30 flex items-center justify-center">
                      <span className="text-[#c41e3a] text-sm" style={{ fontFamily: 'serif' }}>
                        {banquet.time}
                      </span>
                    </div>
                    <div>
                      <div className="text-white" style={{ fontFamily: 'serif' }}>
                        {banquet.hostName}
                      </div>
                      <div className="text-white/50 text-sm" style={{ fontFamily: 'serif' }}>
                        {tables.find(t => t.id === banquet.tableId)?.name || banquet.tableId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <Users className="w-4 h-4" />
                    <span style={{ fontFamily: 'serif' }}>{banquet.guestCount}人</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
