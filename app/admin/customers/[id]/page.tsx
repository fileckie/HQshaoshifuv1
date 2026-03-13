'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Calendar, Star, Briefcase, Tag, Plus, X } from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  birthday: string | null
  anniversary: string | null
  company: string | null
  position: string | null
  level: string
  tags: string[]
  notes: string | null
  totalVisits: number
  totalSpend: number
  avgSpend: number
  firstVisit: string | null
  lastVisit: string | null
  preferences: Preference[]
  banquets: any[]
}

interface Preference {
  id: string
  type: string
  content: string
  priority: number
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddPref, setShowAddPref] = useState(false)
  const [newPref, setNewPref] = useState({ type: 'dietary', content: '', priority: 1 })

  useEffect(() => {
    fetchCustomer()
  }, [params.id])

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/customers/${params.id}`)
      const data = await res.json()
      if (data.success) {
        setCustomer(data.customer)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPreference = async () => {
    if (!newPref.content) return
    
    try {
      const res = await fetch(`/api/customers/${params.id}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPref),
      })
      
      if (res.ok) {
        setNewPref({ type: 'dietary', content: '', priority: 1 })
        setShowAddPref(false)
        fetchCustomer()
      }
    } catch (error) {
      console.error('Add pref error:', error)
    }
  }

  const getPrefTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dietary: '忌口',
      favorite: '喜好',
      drink: '酒水',
      seat: '座位',
      other: '其他',
    }
    return labels[type] || type
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  if (!customer) return <div className="min-h-screen flex items-center justify-center">客户不存在</div>

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E0D8]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-[#8A8A8A] hover:text-[#1A1A1A]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-medium">客户详情</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg border border-[#E5E0D8] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#C9A962] rounded-full flex items-center justify-center text-white text-2xl">
                {customer.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-medium">{customer.name}</h2>
                <div className="flex items-center gap-4 text-sm text-[#8A8A8A] mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </span>
                  {customer.company && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {customer.company} {customer.position}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded text-sm ${
              customer.level === 'vip' ? 'bg-amber-100 text-amber-700' :
              customer.level === 'vvip' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {customer.level.toUpperCase()}
            </span>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E5E0D8]">
            <div className="text-center">
              <div className="text-2xl font-medium text-[#C9A962]">{customer.totalVisits}</div>
              <div className="text-sm text-[#8A8A8A]">累计到店</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-[#C9A962]">¥{(customer.avgSpend / 100).toFixed(0)}</div>
              <div className="text-sm text-[#8A8A8A]">人均消费</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-[#C9A962]">
                {customer.firstVisit ? new Date(customer.firstVisit).getFullYear() : '-'}
              </div>
              <div className="text-sm text-[#8A8A8A]">首次到店</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-[#C9A962]">{customer.banquets?.length || 0}</div>
              <div className="text-sm text-[#8A8A8A]">宴请次数</div>
            </div>
          </div>
        </div>

        {/* 偏好记忆 */}
        <div className="bg-white rounded-lg border border-[#E5E0D8] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A962]" />
              偏好记忆
            </h3>
            <button
              onClick={() => setShowAddPref(true)}
              className="text-sm text-[#C9A962] hover:text-[#B87333] flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>

          {showAddPref && (
            <div className="bg-[#F5F0E8] rounded-lg p-4 mb-4">
              <div className="flex gap-2">
                <select
                  value={newPref.type}
                  onChange={(e) => setNewPref({ ...newPref, type: e.target.value })}
                  className="px-3 py-2 border border-[#E5E0D8] rounded text-sm"
                >
                  <option value="dietary">忌口</option>
                  <option value="favorite">喜好</option>
                  <option value="drink">酒水</option>
                  <option value="seat">座位</option>
                  <option value="other">其他</option>
                </select>
                <input
                  type="text"
                  placeholder="请输入内容..."
                  value={newPref.content}
                  onChange={(e) => setNewPref({ ...newPref, content: e.target.value })}
                  className="flex-1 px-3 py-2 border border-[#E5E0D8] rounded text-sm"
                />
                <button
                  onClick={addPreference}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-sm rounded hover:bg-[#2C2C2C]"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowAddPref(false)}
                  className="p-2 text-[#8A8A8A] hover:text-[#1A1A1A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {customer.preferences?.length === 0 ? (
              <div className="text-sm text-[#8A8A8A]">暂无偏好记录</div>
            ) : (
              customer.preferences?.map((pref) => (
                <div key={pref.id} className="flex items-center gap-3 p-3 bg-[#F5F0E8] rounded">
                  <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-xs rounded">
                    {getPrefTypeLabel(pref.type)}
                  </span>
                  <span className="flex-1 text-sm">{pref.content}</span>
                  {pref.priority >= 4 && (
                    <span className="text-xs text-red-600">重要</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 历史宴请 */}
        <div className="bg-white rounded-lg border border-[#E5E0D8] p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C9A962]" />
            历史宴请
          </h3>
          <div className="space-y-3">
            {customer.banquets?.length === 0 ? (
              <div className="text-sm text-[#8A8A8A]">暂无宴请记录</div>
            ) : (
              customer.banquets?.map((banquet) => (
                <Link
                  key={banquet.id}
                  href={`/admin/list?highlight=${banquet.id}`}
                  className="block p-3 border border-[#E5E0D8] rounded hover:border-[#C9A962]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{banquet.title}</div>
                      <div className="text-sm text-[#8A8A8A]">
                        {banquet.date} {banquet.time} · {banquet.roomName} · {banquet.guestCount}人
                      </div>
                    </div>
                    <span className="text-sm text-[#C9A962]">查看 →</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
