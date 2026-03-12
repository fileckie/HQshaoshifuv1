import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    // 构建查询条件
    const where: any = {}
    
    // 如果指定了日期，按日期筛选
    if (date) {
      where.date = date
    }
    
    const banquets = await prisma.banquet.findMany({
      where,
      include: {
        restaurant: {
          select: {
            name: true
          }
        },
        table: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        rsvps: {
          select: {
            status: true,
            attendeeCount: true
          }
        },
        _count: {
          select: {
            rsvps: true
          }
        }
      },
      orderBy: {
        time: 'asc'
      }
    })

    // 如果按日期查询，返回简化格式
    if (date) {
      return NextResponse.json({ 
        banquets: banquets.map(b => ({
          id: b.id,
          hostName: b.hostName,
          guestCount: b.guestCount,
          time: b.time,
          tableId: b.table?.id || b.roomName,
          status: b.status
        }))
      })
    }

    // 计算统计数据（完整列表时）
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const stats = {
      total: banquets.length,
      thisMonth: banquets.filter(b => {
        const date = new Date(b.createdAt)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      }).length,
      pending: banquets.filter(b => b.status === 'active').length,
      confirmed: banquets.reduce((sum, b) => {
        return sum + b.rsvps.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.attendeeCount, 0)
      }, 0)
    }

    return NextResponse.json({ banquets, stats })
  } catch (error) {
    console.error('Error fetching banquets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banquets' },
      { status: 500 }
    )
  }
}
