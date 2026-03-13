'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClipboardList, CheckCircle, Clock, User } from 'lucide-react'

interface Task {
  id: string
  banquetId: string
  type: string
  title: string
  description: string
  scheduledAt: string
  status: string
  assignedTo: string | null
}

export default function ServicePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      // 这里简化处理，实际应该查询今日所有任务
      setTasks([])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-600',
      doing: 'bg-amber-100 text-amber-700',
      done: 'bg-green-100 text-green-700',
      skipped: 'bg-gray-100 text-gray-400',
    }
    return colors[status] || colors.pending
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      prep: '备餐',
      serve: '上菜',
      check: '检查',
      reminder: '提醒',
      handover: '交接',
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E0D8]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/list" className="text-[#8A8A8A] hover:text-[#1A1A1A]">
                ← 返回
              </Link>
              <h1 className="text-xl font-medium">服务流程管理</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-[#E5E0D8] p-6">
          <div className="flex items-center gap-2 text-[#8A8A8A] mb-6">
            <ClipboardList className="w-5 h-5" />
            <span>服务任务在创建宴请时自动生成，可在各宴请详情中查看</span>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-[#8A8A8A]">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>请在具体宴请页面查看服务任务</p>
              <Link href="/admin/dashboard" className="text-[#C9A962] hover:underline mt-2 inline-block">
                查看今日预订 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 border border-[#E5E0D8] rounded-lg">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                    {task.status === 'pending' ? '待办' : task.status === 'doing' ? '进行中' : task.status === 'done' ? '已完成' : '已跳过'}
                  </span>
                  <span className="text-sm text-[#8A8A8A] w-12">{task.scheduledAt}分</span>
                  <span className="px-2 py-0.5 bg-[#F5F0E8] rounded text-xs">{getTypeLabel(task.type)}</span>
                  <span className="flex-1 font-medium">{task.title}</span>
                  {task.assignedTo && (
                    <span className="flex items-center gap-1 text-sm text-[#8A8A8A]">
                      <User className="w-3 h-3" />
                      {task.assignedTo}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
