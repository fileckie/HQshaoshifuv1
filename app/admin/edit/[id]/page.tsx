'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, Save, Loader2, CheckCircle,
  Plus, Trash2, Users, Calendar, Clock
} from 'lucide-react'

interface Dish {
  name: string
  description?: string
  isSignature?: boolean
}

interface BanquetData {
  id: string
  title: string
  date: string
  time: string
  guestCount: number
  roomName: string
  hostName: string
  hostPhone: string
  notes?: string
  status: string
  menu: Dish[]
  restaurant: {
    name: string
    address: string
    phone: string
    description?: string
    chefName?: string
    chefIntro?: string
  }
}

export default function EditBanquetPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('info')

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    guestCount: '',
    roomName: '',
    hostName: '',
    hostPhone: '',
    notes: '',
    status: 'active',
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantDesc: '',
    chefName: '',
    chefIntro: '',
  })
  const [dishes, setDishes] = useState<Dish[]>([])

  useEffect(() => {
    fetchBanquet()
  }, [params.id])

  const fetchBanquet = async () => {
    try {
      const response = await fetch(`/api/banquet/${params.id}`)
      if (!response.ok) throw new Error('Not found')
      const data: BanquetData = await response.json()
      
      setFormData({
        title: data.title,
        date: data.date,
        time: data.time,
        guestCount: String(data.guestCount),
        roomName: data.roomName,
        hostName: data.hostName,
        hostPhone: data.hostPhone,
        notes: data.notes || '',
        status: data.status,
        restaurantName: data.restaurant.name,
        restaurantAddress: data.restaurant.address,
        restaurantPhone: data.restaurant.phone,
        restaurantDesc: data.restaurant.description || '',
        chefName: data.restaurant.chefName || '',
        chefIntro: data.restaurant.chefIntro || '',
      })
      setDishes(data.menu || [])
    } catch (error) {
      alert('加载失败')
      router.push('/admin/list')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const validDishes = dishes.filter(d => d.name.trim())
      
      const response = await fetch(`/api/banquet/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          menu: validDishes
        })
      })

      if (!response.ok) throw new Error('更新失败')
      
      alert('更新成功')
      router.push('/admin/list')
    } catch (error) {
      alert('更新失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const addDish = () => {
    setDishes([...dishes, { name: '', description: '', isSignature: false }])
  }

  const removeDish = (index: number) => {
    if (dishes.length > 1) {
      setDishes(dishes.filter((_, i) => i !== index))
    }
  }

  const updateDish = (index: number, field: keyof Dish, value: string | boolean) => {
    const newDishes = [...dishes]
    newDishes[index] = { ...newDishes[index], [field]: value }
    setDishes(newDishes)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b6560]">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e4de] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/list" className="text-[#6b6560] hover:text-[#0a0a0a]">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-brand text-lg font-bold text-[#0a0a0a]">编辑宴请</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/invitation/${params.id}`}
              target="_blank"
              className="px-4 py-2 text-sm text-[#6b6560] hover:text-[#0a0a0a] transition-colors"
            >
              预览
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-[#0a0a0a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-[#e8e4de]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-6">
            {[
              { id: 'info', label: '宴请信息', icon: Calendar },
              { id: 'menu', label: '菜单', icon: Users },
              { id: 'restaurant', label: '餐厅信息', icon: CheckCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-[#c9a962] text-[#0a0a0a]'
                    : 'border-transparent text-[#6b6560] hover:text-[#0a0a0a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          {/* 宴请信息 */}
          {activeTab === 'info' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 border border-[#e8e4de]">
                <h2 className="font-brand text-lg font-bold text-[#0a0a0a] mb-6">基本信息</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#6b6560] mb-2">宴请主题 *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="如：王总家宴、商务宴请"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">宴请日期 *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">宴请时间 *</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">宾客人数 *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">包厢名称 *</label>
                    <input
                      type="text"
                      required
                      value={formData.roomName}
                      onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="如：牡丹厅"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">宴请主人 *</label>
                    <input
                      type="text"
                      required
                      value={formData.hostName}
                      onChange={(e) => setFormData({...formData, hostName: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="主人姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">主人电话 *</label>
                    <input
                      type="tel"
                      required
                      value={formData.hostPhone}
                      onChange={(e) => setFormData({...formData, hostPhone: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="138****8888"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">宴请状态</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                    >
                      <option value="active">进行中</option>
                      <option value="completed">已结束</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#6b6560] mb-2">备注/忌口</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                      placeholder="宾客忌口、特殊要求等"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 菜单 */}
          {activeTab === 'menu' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 border border-[#e8e4de]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-brand text-lg font-bold text-[#0a0a0a]">今日菜单</h2>
                  <button
                    type="button"
                    onClick={addDish}
                    className="flex items-center gap-2 px-4 py-2 bg-[#c9a962] text-white rounded-lg hover:bg-[#a0854a] transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    添加菜品
                  </button>
                </div>
                <div className="space-y-3">
                  {dishes.map((dish, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 bg-[#f7f5f0] rounded-xl">
                      <div className="flex-1 grid md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={dish.name}
                          onChange={(e) => updateDish(index, 'name', e.target.value)}
                          className="px-4 py-2.5 border border-[#e8e4de] rounded-lg focus:outline-none focus:border-[#c9a962] bg-white"
                          placeholder="菜品名称"
                        />
                        <input
                          type="text"
                          value={dish.description}
                          onChange={(e) => updateDish(index, 'description', e.target.value)}
                          className="px-4 py-2.5 border border-[#e8e4de] rounded-lg focus:outline-none focus:border-[#c9a962] bg-white"
                          placeholder="菜品简介（可选）"
                        />
                        <label className="flex items-center gap-2 px-4 py-2.5">
                          <input
                            type="checkbox"
                            checked={dish.isSignature}
                            onChange={(e) => updateDish(index, 'isSignature', e.target.checked)}
                            className="w-4 h-4 text-[#c9a962] rounded focus:ring-[#c9a962]"
                          />
                          <span className="text-sm text-[#6b6560]">招牌菜</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDish(index)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                {dishes.length === 0 && (
                  <div className="text-center py-12 bg-[#f7f5f0] rounded-xl">
                    <p className="text-[#6b6560] mb-4">还没有添加菜品</p>
                    <button
                      type="button"
                      onClick={addDish}
                      className="px-5 py-2.5 bg-[#0a0a0a] text-white rounded-lg text-sm"
                    >
                      添加第一道菜
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 餐厅信息 */}
          {activeTab === 'restaurant' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 border border-[#e8e4de]">
                <h2 className="font-brand text-lg font-bold text-[#0a0a0a] mb-6">餐厅信息</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#6b6560] mb-2">餐厅名称 *</label>
                    <input
                      type="text"
                      required
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="如：得月楼私宴"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#6b6560] mb-2">餐厅地址 *</label>
                    <input
                      type="text"
                      required
                      value={formData.restaurantAddress}
                      onChange={(e) => setFormData({...formData, restaurantAddress: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="详细地址"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">联系电话 *</label>
                    <input
                      type="tel"
                      required
                      value={formData.restaurantPhone}
                      onChange={(e) => setFormData({...formData, restaurantPhone: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="021-88888888"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2">主厨姓名</label>
                    <input
                      type="text"
                      value={formData.chefName}
                      onChange={(e) => setFormData({...formData, chefName: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962]"
                      placeholder="主厨名字"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#6b6560] mb-2">品牌介绍</label>
                    <textarea
                      rows={3}
                      value={formData.restaurantDesc}
                      onChange={(e) => setFormData({...formData, restaurantDesc: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                      placeholder="餐厅品牌故事、特色等"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#6b6560] mb-2">主厨介绍</label>
                    <textarea
                      rows={2}
                      value={formData.chefIntro}
                      onChange={(e) => setFormData({...formData, chefIntro: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e8e4de] rounded-xl focus:outline-none focus:border-[#c9a962] resize-none"
                      placeholder="主厨履历、擅长菜系等"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-[#e8e4de]">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 bg-[#0a0a0a] text-white rounded-xl font-medium hover:bg-[#1a1a1a] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存修改
                </>
              )}
            </button>
            <Link
              href="/admin/list"
              className="px-8 py-3.5 border border-[#e8e4de] text-[#6b6560] rounded-xl font-medium hover:border-[#c9a962] hover:text-[#c9a962] transition-all"
            >
              取消
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
