'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Search, Phone, Star, Calendar, ChevronRight } from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone: string
  level: string
  totalVisits: number
  lastVisit: string | null
  tags: string
  _count: { banquets: number }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [search, levelFilter])

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (levelFilter) params.set('level', levelFilter)
      
      const res = await fetch(`/api/customers?${params}`)
      const data = await res.json()
      if (data.success) {
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      vvip: 'bg-purple-100 text-purple-700',
      vip: 'bg-amber-100 text-amber-700',
      regular: 'bg-gray-100 text-gray-700',
      blacklist: 'bg-red-100 text-red-700',
    }
    return colors[level] || colors.regular
  }

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      vvip: 'VVIP',
      vip: 'VIP',
      regular: '普通',
      blacklist: '黑名单',
    }
    return labels[level] || level
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E0D8] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/list" className="text-[#8A8A8A] hover:text-[#1A1A1A]">
                ← 返回
              </Link>
              <h1 className="text-xl font-medium text-[#1A1A1A]">客户管理</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#8A8A8A]">
              <Users className="w-4 h-4" />
              {customers.length} 位客户
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* 筛选栏 */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="搜索姓名/手机号..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="">全部等级</option>
            <option value="vvip">VVIP</option>
            <option value="vip">VIP</option>
            <option value="regular">普通</option>
          </select>
        </div>

        {/* 客户列表 */}
        {loading ? (
          <div className="text-center py-12 text-[#8A8A8A]">加载中...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-[#8A8A8A]">暂无客户</div>
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="bg-white rounded-lg border border-[#E5E0D8] p-4 hover:border-[#C9A962] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5F0E8] rounded-full flex items-center justify-center text-lg">
                      {customer.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1A1A1A]">{customer.name}</span>
                        <span className={`px-2 py-0.5 text-xs rounded ${getLevelColor(customer.level)}`}>
                          {getLevelLabel(customer.level)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#8A8A8A] mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {customer.totalVisits} 次到店
                        </span>
                        {customer.lastVisit && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            最近 {customer.lastVisit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8A8A8A]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
