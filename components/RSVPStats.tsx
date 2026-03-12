'use client'

import { useEffect, useState } from 'react'
import { Users, CheckCircle, XCircle, Clock, Utensils } from 'lucide-react'

interface RSVP {
  id: string
  guestName: string
  status: 'pending' | 'confirmed' | 'declined'
  attendeeCount: number
  dietaryRestrictions?: string
  message?: string
  createdAt: string
}

interface RSVPStatsProps {
  banquetId: string
}

export default function RSVPStats({ banquetId }: RSVPStatsProps) {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRSVPs()
  }, [banquetId])

  const fetchRSVPs = async () => {
    try {
      const response = await fetch(`/api/banquet/${banquetId}/rsvp`)
      if (response.ok) {
        const data = await response.json()
        setRsvps(data)
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter(r => r.status === 'confirmed').length,
    declined: rsvps.filter(r => r.status === 'declined').length,
    pending: rsvps.filter(r => r.status === 'pending').length,
    totalAttendees: rsvps
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + r.attendeeCount, 0)
  }

  if (loading) {
    return (
      <div className="bg-[#F5F3F0] p-6 text-center">
        <div className="w-8 h-8 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  if (rsvps.length === 0) {
    return null
  }

  return (
    <div className="bg-[#F5F3F0] p-6">
      <h3 className="font-brand text-lg text-[#1A1A1A] mb-4 text-center">出席统计</h3>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-4 rounded text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-[#C41E3A]" />
            <span className="text-xs text-[#6b6560] font-jp-sans">确认出席</span>
          </div>
          <p className="text-2xl font-bold text-[#C41E3A]">{stats.confirmed}</p>
          <p className="text-xs text-[#8A8A8A] font-jp-sans">{stats.totalAttendees} 人</p>
        </div>
        <div className="bg-white p-4 rounded text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-[#8A8A8A]" />
            <span className="text-xs text-[#6b6560] font-jp-sans">无法出席</span>
          </div>
          <p className="text-2xl font-bold text-[#8A8A8A]">{stats.declined}</p>
        </div>
      </div>

      {/* 宾客列表 */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {rsvps.map((rsvp) => (
          <div key={rsvp.id} className="bg-white p-3 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                rsvp.status === 'confirmed' ? 'bg-[#C41E3A]/10' : 
                rsvp.status === 'declined' ? 'bg-[#8A8A8A]/10' : 'bg-gray-100'
              }`}>
                {rsvp.status === 'confirmed' ? (
                  <CheckCircle className="w-4 h-4 text-[#C41E3A]" />
                ) : rsvp.status === 'declined' ? (
                  <XCircle className="w-4 h-4 text-[#8A8A8A]" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm text-[#1A1A1A] font-jp-sans">{rsvp.guestName}</p>
                {rsvp.status === 'confirmed' && rsvp.attendeeCount > 1 && (
                  <p className="text-xs text-[#8A8A8A] font-jp-sans">{rsvp.attendeeCount} 人出席</p>
                )}
              </div>
            </div>
            {rsvp.dietaryRestrictions && (
              <div className="flex items-center gap-1 text-xs text-[#C41E3A] bg-[#C41E3A]/5 px-2 py-1 rounded font-jp-sans">
                <Utensils className="w-3 h-3" />
                <span className="max-w-[80px] truncate">{rsvp.dietaryRestrictions}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {rsvps.some(r => r.dietaryRestrictions) && (
        <div className="mt-4 pt-4 border-t border-[#E5E2DE]">
          <p className="text-xs text-[#8A8A8A] mb-2 font-jp-sans">饮食注意事项：</p>
          <div className="space-y-1">
            {rsvps
              .filter(r => r.dietaryRestrictions)
              .map((rsvp, i) => (
                <p key={i} className="text-xs text-[#C41E3A] font-jp-sans">
                  • {rsvp.guestName}: {rsvp.dietaryRestrictions}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
