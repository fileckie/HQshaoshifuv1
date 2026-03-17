'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Loader2, MapPin, LayoutGrid, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  title: string
  hostName: string
  hostPhone: string
  date: string
  time: string
  roomName: string
  guestCount: number
  menu: { name: string; desc: string }[]
  note: string
  // 新增员工版字段
  bookingChannel: string
  paymentStatus: string
  dietaryRestrictions: string
  prepReminder: string
  handoverNotes: string
}

const TIME_OPTIONS = ['18:00', '19:00', '19:30', '20:00', '20:30', '21:00']

const ROOM_OPTIONS = [
  { value: '板前', label: '板前', capacity: '10席', desc: '近距离观看炭火料理' },
  { value: '卡座', label: '卡座', capacity: '4桌', desc: '适合2-4人小聚' },
  { value: '小包厢', label: '小包厢', capacity: '1间', desc: '私密空间，可容纳6人' },
  { value: '大包厢', label: '大包厢', capacity: '1间', desc: '宽敞舒适，可容纳12人' },
]

const BOOKING_CHANNELS = [
  { value: 'wechat', label: '微信' },
  { value: 'phone', label: '电话' },
  { value: 'dianping', label: '大众点评' },
  { value: 'other', label: '其他' },
]

// 生成最近14天
const generateDates = () => {
  const dates = []
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date()
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    dates.push({
      value: `${year}-${month}-${day}`,
      label: `${date.getMonth() + 1}月${date.getDate()}日`,
      week: weeks[date.getDay()],
      isToday: i === 0
    })
  }
  return dates
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'guest' | 'booking' | 'internal'>('guest')
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      bookingChannel: 'wechat',
      paymentStatus: 'pay_on_arrival',
      menu: [
        { name: '', desc: '主厨限定串' },
        { name: '', desc: '当季时令烧鸟' },
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'menu' })
  const selectedTime = watch('time')
  const selectedDate = watch('date')
  const selectedRoom = watch('roomName')
  const selectedChannel = watch('bookingChannel')
  const selectedPayment = watch('paymentStatus')
  const guestCount = watch('guestCount')
  const dates = generateDates()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    
    try {
      // 处理菜单数据，添加店长填写栏位
      const processedMenu = data.menu.map((item, index) => ({
        ...item,
        name: item.name || (index === 0 ? '主厨限定串' : index === 1 ? '当季时令烧鸟' : ''),
        desc: item.desc || ''
      }))
      
      const res = await fetch('/api/banquet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          menu: processedMenu
        })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '创建失败')
      }
      
      const result = await res.json()
      router.push(`/invitation/${result.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    setActiveTab('guest')
  }

  // 快速设置人数
  const quickSetGuestCount = (count: number) => {
    setValue('guestCount', count)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 返回首页按钮 */}
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: 'serif' }}>返回首页</span>
          </Link>
        </div>

        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white mb-2 tracking-wider" style={{ fontFamily: 'serif' }}>
            预约管理
          </h1>
          <p className="text-white/50" style={{ fontFamily: 'serif' }}>
            烧师富 · 板前创作
          </p>
        </div>

        {/* 顶部操作栏 */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/map" className="flex items-center gap-2 text-white/60 hover:text-white text-sm">
            <LayoutGrid className="w-4 h-4" />
            座位平面图
          </Link>
          <button 
            onClick={handleReset}
            className="text-white/40 hover:text-white/60 text-sm"
          >
            重置表单
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[#c41e3a]/30 bg-[#c41e3a]/5 text-[#c41e3a]" style={{ fontFamily: 'serif' }}>
            {error}
          </div>
        )}

        {/* 标签导航 */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-3 text-sm tracking-wider ${
              activeTab === 'guest' 
                ? 'text-white border-b-2 border-white' 
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{ fontFamily: 'serif' }}
          >
            客人信息
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex-1 py-3 text-sm tracking-wider ${
              activeTab === 'booking' 
                ? 'text-white border-b-2 border-white' 
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{ fontFamily: 'serif' }}
          >
            预订详情
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 py-3 text-sm tracking-wider ${
              activeTab === 'internal' 
                ? 'text-white border-b-2 border-white' 
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{ fontFamily: 'serif' }}
          >
            内部管理
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 客人信息 */}
          {activeTab === 'guest' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 主题 */}
              <div>
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  主题（选填）
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="如：朋友聚餐、商务宴请..."
                  className="w-full bg-transparent border-b border-white/20 focus:border-white px-0 py-3 text-white outline-none placeholder:text-white/30"
                  style={{ fontFamily: 'serif' }}
                />
              </div>

              {/* 组局人姓名 */}
              <div>
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  组局人姓名 <span className="text-[#c41e3a]">*</span>
                </label>
                <input
                  type="text"
                  {...register('hostName', { required: '请输入组局人姓名' })}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white px-0 py-3 text-white outline-none"
                  style={{ fontFamily: 'serif' }}
                />
                {errors.hostName && <p className="mt-2 text-[#c41e3a] text-sm">{errors.hostName.message}</p>}
              </div>

              {/* 联系电话 */}
              <div>
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  联系电话
                </label>
                <input
                  type="tel"
                  {...register('hostPhone')}
                  placeholder="177 1554 9313"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white px-0 py-3 text-white outline-none placeholder:text-white/30"
                  style={{ fontFamily: 'serif' }}
                />
              </div>

              {/* 下一步按钮 */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className="w-full py-4 bg-white text-black text-lg tracking-widest hover:bg-white/90"
                  style={{ fontFamily: 'serif' }}
                >
                  下一步：预订详情
                </button>
              </div>
            </div>
          )}

          {/* 预订详情 */}
          {activeTab === 'booking' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 日期 */}
              <div>
                <label className="block text-white/60 text-sm mb-3" style={{ fontFamily: 'serif' }}>
                  日期 <span className="text-[#c41e3a]">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {dates.map((date) => (
                    <button
                      key={date.value}
                      type="button"
                      onClick={() => setValue('date', date.value)}
                      className={`py-3 border ${
                        selectedDate === date.value 
                          ? 'bg-white border-white text-black' 
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      } ${date.isToday ? 'ring-1 ring-[#c41e3a]/50' : ''}`}
                      style={{ fontFamily: 'serif' }}
                    >
                      <div className="text-sm">{date.label}</div>
                      <div className="text-xs mt-1 opacity-70">{date.week}{date.isToday ? '·今天' : ''}</div>
                    </button>
                  ))}
                </div>
                {errors.date && <p className="mt-2 text-[#c41e3a] text-sm">{errors.date.message}</p>}
              </div>

              {/* 时间 */}
              <div>
                <label className="block text-white/60 text-sm mb-3" style={{ fontFamily: 'serif' }}>
                  时间 <span className="text-[#c41e3a]">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {TIME_OPTIONS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setValue('time', time)}
                      className={`px-4 py-3 border ${
                        selectedTime === time 
                          ? 'bg-white border-white text-black' 
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                      style={{ fontFamily: 'serif' }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.time && <p className="mt-2 text-[#c41e3a] text-sm">{errors.time.message}</p>}
              </div>

              {/* 席位类型 */}
              <div>
                <label className="block text-white/60 text-sm mb-3" style={{ fontFamily: 'serif' }}>
                  席位类型 <span className="text-[#c41e3a]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROOM_OPTIONS.map((room) => (
                    <button
                      key={room.value}
                      type="button"
                      onClick={() => setValue('roomName', room.value)}
                      className={`p-4 border text-left ${
                        selectedRoom === room.value 
                          ? 'bg-white border-white text-black' 
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                      style={{ fontFamily: 'serif' }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-base">{room.label}</span>
                        <span className={`text-xs ${selectedRoom === room.value ? 'text-black/50' : 'text-white/40'}`}>
                          {room.capacity}
                        </span>
                      </div>
                      <div className={`text-xs ${selectedRoom === room.value ? 'text-black/40' : 'text-white/30'}`}>
                        {room.desc}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.roomName && <p className="mt-2 text-[#c41e3a] text-sm">{errors.roomName.message}</p>}
              </div>

              {/* 人数 */}
              <div>
                <label className="block text-white/60 text-sm mb-3" style={{ fontFamily: 'serif' }}>
                  人数 <span className="text-[#c41e3a]">*</span>
                </label>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 4, 6, 8, 12].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => quickSetGuestCount(count)}
                      className={`px-4 py-2 border ${
                        Number(guestCount) === count 
                          ? 'bg-white border-white text-black' 
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                      style={{ fontFamily: 'serif' }}
                    >
                      {count}人
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  max={20}
                  {...register('guestCount', { 
                    required: '请输入人数',
                    valueAsNumber: true,
                    min: { value: 1, message: '至少1人' }
                  })}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white px-0 py-3 text-white outline-none"
                  style={{ fontFamily: 'serif' }}
                />
                {errors.guestCount && <p className="mt-2 text-[#c41e3a] text-sm">{errors.guestCount.message}</p>}
              </div>

              {/* 今日炭火料理推荐 */}
              <div className="pt-6 border-t border-white/10">
                <label className="block text-white/60 text-sm mb-4" style={{ fontFamily: 'serif' }}>
                  今日炭火料理推荐
                </label>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-white/10 bg-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/40 text-xs">
                          {index === 0 ? '主厨限定串' : index === 1 ? '当季时令烧鸟' : `菜品 ${index + 1}`}
                        </span>
                        {index >= 2 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-white/30 hover:text-[#c41e3a]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <input
                          {...register(`menu.${index}.name` as const)}
                          placeholder={index === 0 ? '请输入主厨限定串名称' : index === 1 ? '请输入当季时令烧鸟名称' : '菜品名称'}
                          className="flex-1 bg-transparent border-b border-white/20 focus:border-white px-0 py-2 text-white text-sm outline-none placeholder:text-white/20"
                          style={{ fontFamily: 'serif' }}
                        />
                        <span className="text-white/20 text-sm pt-2">_____</span>
                      </div>
                      <p className="text-white/30 text-xs mt-2">店长填写栏位</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => append({ name: '', desc: '' })}
                  className="mt-4 flex items-center gap-2 text-white/50 text-sm hover:text-white"
                  style={{ fontFamily: 'serif' }}
                >
                  <Plus className="w-4 h-4" />
                  添加菜品
                </button>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('guest')}
                  className="flex-1 py-4 border border-white/40 text-white text-lg tracking-widest hover:bg-white/5"
                  style={{ fontFamily: 'serif' }}
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('internal')}
                  className="flex-1 py-4 bg-white text-black text-lg tracking-widest hover:bg-white/90"
                  style={{ fontFamily: 'serif' }}
                >
                  下一步：内部管理
                </button>
              </div>
            </div>
          )}

          {/* 内部管理 */}
          {activeTab === 'internal' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 border border-[#c41e3a]/20 bg-[#c41e3a]/5 mb-6">
                <p className="text-[#c41e3a] text-sm" style={{ fontFamily: 'serif' }}>
                  以下内容仅在员工版显示，客人不可见
                </p>
              </div>

              {/* 预订渠道 */}
              <div>
                <label className="block text-white/60 text-sm mb-3" style={{ fontFamily: 'serif' }}>
                  预订渠道
                </label>
                <div className="flex gap-2">
                  {BOOKING_CHANNELS.map((channel) => (
                    <button
                      key={channel.value}
                      type="button"
                      onClick={() => setValue('bookingChannel', channel.value)}
                      className={`flex-1 py-3 border ${
                        selectedChannel === channel.value 
                          ? 'bg-white border-white text-black' 
                          : 'border-white/20 text-white/60 hover:border-white/40'
                      }`}
                      style={{ fontFamily: 'serif' }}
                    >
                      {channel.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 付款状态 */}
              <div>
                <label className="block text-white/60 text-sm mb-3" style={{ fontFamily: 'serif' }}>
                  付款状态
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setValue('paymentStatus', 'prepaid')}
                    className={`flex-1 py-3 border ${
                      selectedPayment === 'prepaid' 
                        ? 'bg-white border-white text-black' 
                        : 'border-white/20 text-white/60 hover:border-white/40'
                    }`}
                    style={{ fontFamily: 'serif' }}
                  >
                    已预付
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('paymentStatus', 'pay_on_arrival')}
                    className={`flex-1 py-3 border ${
                      selectedPayment === 'pay_on_arrival' 
                        ? 'bg-white border-white text-black' 
                        : 'border-white/20 text-white/60 hover:border-white/40'
                    }`}
                    style={{ fontFamily: 'serif' }}
                  >
                    到店付款
                  </button>
                </div>
              </div>

              {/* 饮食禁忌 */}
              <div>
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  饮食禁忌 / 过敏信息
                </label>
                <textarea
                  {...register('dietaryRestrictions')}
                  rows={2}
                  placeholder="如：海鲜过敏、不吃香菜等"
                  className="w-full bg-transparent border border-white/20 focus:border-white p-3 text-white outline-none text-sm resize-none"
                  style={{ fontFamily: 'serif' }}
                />
              </div>

              {/* 备餐提醒 */}
              <div>
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  备餐提醒
                </label>
                <textarea
                  {...register('prepReminder')}
                  rows={2}
                  placeholder="需要提前准备的特殊要求..."
                  className="w-full bg-transparent border border-white/20 focus:border-white p-3 text-white outline-none text-sm resize-none"
                  style={{ fontFamily: 'serif' }}
                />
              </div>

              {/* 交接备注 */}
              <div>
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  服务员交接备注
                </label>
                <textarea
                  {...register('handoverNotes')}
                  rows={2}
                  placeholder="班次交接需要注意的事项..."
                  className="w-full bg-transparent border border-white/20 focus:border-white p-3 text-white outline-none text-sm resize-none"
                  style={{ fontFamily: 'serif' }}
                />
              </div>

              {/* 客人可见备注 */}
              <div className="pt-6 border-t border-white/10">
                <label className="block text-white/60 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  客人可见备注（会显示在邀请函上）
                </label>
                <textarea
                  {...register('note')}
                  rows={2}
                  placeholder="会显示在邀请函上的备注..."
                  className="w-full bg-transparent border border-white/20 focus:border-white p-3 text-white outline-none text-sm resize-none"
                  style={{ fontFamily: 'serif' }}
                />
              </div>

              {/* 门店信息 */}
              <div className="py-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/40 text-sm mb-2" style={{ fontFamily: 'serif' }}>
                  <MapPin className="w-4 h-4" />
                  门店信息
                </div>
                <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: 'serif' }}>
                  双塔街道竹辉路168号环宇荟·L133
                </p>
                <p className="text-white/30 text-xs mt-2 leading-relaxed" style={{ fontFamily: 'serif' }}>
                  环宇荟Manner旁下地库，到底右转到底再右转，
                  橙色B区停车，客梯到一楼左手边即达
                </p>
                <p className="text-white/50 text-base mt-3" style={{ fontFamily: 'serif' }}>
                  177 1554 9313
                </p>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className="flex-1 py-4 border border-white/40 text-white text-lg tracking-widest hover:bg-white/5"
                  style={{ fontFamily: 'serif' }}
                >
                  上一步
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-white text-black text-lg tracking-widest hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: 'serif' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    '创建邀约卡'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* 底部链接 */}
        <div className="mt-12 text-center space-y-4">
          <Link href="/admin/products" className="block text-white/50 hover:text-white text-sm" style={{ fontFamily: 'serif' }}>
            管理今日推荐产品 →
          </Link>
          <Link href="/admin/map" className="block text-white/50 hover:text-white text-sm" style={{ fontFamily: 'serif' }}>
            查看座位平面图 →
          </Link>
          <Link href="/" className="block text-white/30 hover:text-white/50 text-sm" style={{ fontFamily: 'serif' }}>
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
