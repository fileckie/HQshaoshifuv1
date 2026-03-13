// 提醒系统 API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reminders - 获取提醒列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const status = searchParams.get('status') || ''
    
    const where: any = { remindDate: date }
    if (status) where.status = status
    
    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            level: true,
            totalVisits: true,
          }
        }
      },
      orderBy: { remindTime: 'asc' }
    })
    
    return NextResponse.json({ success: true, reminders })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 })
  }
}

// POST /api/reminders - 创建提醒
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const reminder = await prisma.reminder.create({
      data: {
        customerId: data.customerId,
        type: data.type,
        title: data.title,
        content: data.content,
        remindDate: data.remindDate,
        remindTime: data.remindTime,
        banquetId: data.banquetId,
      }
    })
    
    return NextResponse.json({ success: true, reminder })
  } catch (error) {
    return NextResponse.json({ success: false, error: '创建失败' }, { status: 500 })
  }
}

// PATCH - 标记已发送
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少ID' }, { status: 400 })
    }
    
    const reminder = await prisma.reminder.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      }
    })
    
    return NextResponse.json({ success: true, reminder })
  } catch (error) {
    return NextResponse.json({ success: false, error: '更新失败' }, { status: 500 })
  }
}
