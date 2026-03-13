import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/banquet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }
    
    const banquet = await prisma.banquet.findUnique({
      where: { id },
      include: {
        restaurant: true,
        customer: {
          include: { preferences: true }
        },
        rsvps: true,
        serviceTasks: true,
      }
    })
    
    if (!banquet) {
      return NextResponse.json({ error: '宴请不存在' }, { status: 404 })
    }
    
    return NextResponse.json(banquet)
  } catch (error) {
    console.error('Get banquet error:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

// POST /api/banquet - 创建宴请（支持客户识别）
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // 1. 查找或创建客户
    let customer = await prisma.customer.findUnique({
      where: { phone: data.hostPhone }
    })
    
    if (customer) {
      // 更新回头客数据
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          totalVisits: { increment: 1 },
          lastVisit: data.date,
        }
      })
    } else {
      // 创建新客户
      customer = await prisma.customer.create({
        data: {
          name: data.hostName,
          phone: data.hostPhone,
          firstVisit: data.date,
          lastVisit: data.date,
          totalVisits: 1,
          level: 'regular',
          tags: '[]',
        }
      })
    }
    
    // 2. 创建宴请
    const banquet = await prisma.banquet.create({
      data: {
        title: data.title,
        date: data.date,
        time: data.time,
        guestCount: parseInt(data.guestCount),
        roomName: data.roomName,
        hostName: data.hostName,
        hostPhone: data.hostPhone,
        customerId: customer.id,
        menu: JSON.stringify(data.menu || []),
        specialDishes: JSON.stringify(data.specialDishes || []),
        notes: data.notes,
        restaurantId: data.restaurantId || 'default',
        bookingChannel: data.bookingChannel || 'phone',
        serviceStatus: 'booked',
      }
    })
    
    // 3. 自动生成服务任务
    const defaultTasks = [
      { type: 'prep', title: '备餐提醒', scheduledAt: '-30', description: '提醒厨房开始备餐' },
      { type: 'check', title: '包厢检查', scheduledAt: '-15', description: '检查包厢布置' },
      { type: 'welcome', title: '迎客准备', scheduledAt: '0', description: '到门口迎接宾客' },
      { type: 'serve', title: '上第一道菜', scheduledAt: '15', description: '上开胃菜/冷盘' },
      { type: 'check', title: '巡台检查', scheduledAt: '30', description: '询问菜品满意度' },
      { type: 'handover', title: '交接班', scheduledAt: '45', description: '交接注意事项' },
    ]
    
    await prisma.serviceTask.createMany({
      data: defaultTasks.map(task => ({
        banquetId: banquet.id,
        type: task.type,
        title: task.title,
        description: task.description,
        scheduledAt: task.scheduledAt,
        status: 'pending',
      }))
    })
    
    // 4. 检查是否需要创建生日提醒
    if (customer.birthday) {
      const today = new Date()
      const birthDate = new Date(`${today.getFullYear()}-${customer.birthday}`)
      const daysUntil = Math.ceil((birthDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntil > 0 && daysUntil <= 7) {
        await prisma.reminder.create({
          data: {
            customerId: customer.id,
            type: 'birthday',
            title: `${customer.name} 生日快到了`,
            content: `还有${daysUntil}天就是${customer.name}的生日（${customer.birthday}），建议准备生日祝福`,
            remindDate: new Date(today.getTime() + (daysUntil - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            banquetId: banquet.id,
          }
        })
      }
    }
    
    // 5. 生成链接
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    return NextResponse.json({
      success: true,
      banquet,
      customer: {
        id: customer.id,
        isReturnCustomer: customer.totalVisits > 1,
        totalVisits: customer.totalVisits,
      },
      invitationId: banquet.id,
      invitationUrl: `${baseUrl}/invitation/${banquet.id}`,
      printUrl: `${baseUrl}/print/${banquet.id}`,
    })
  } catch (error) {
    console.error('Create banquet error:', error)
    return NextResponse.json({ success: false, error: '创建失败' }, { status: 500 })
  }
}
