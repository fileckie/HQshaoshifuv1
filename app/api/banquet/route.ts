import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取或创建默认餐厅
async function getOrCreateRestaurant() {
  // 先尝试找烧师富
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: '烧师富' }
  })
  
  if (!restaurant) {
    // 创建默认餐厅
    restaurant = await prisma.restaurant.create({
      data: {
        name: '烧师富',
        address: '双塔街道竹辉路168号环宇荟·L133',
        phone: '17715549313',
        description: '板前创作烧鸟',
      }
    })
    
    // 初始化座位
    const tables = [
      // 板前 - 10个位置
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `板前${i + 1}号`,
        type: 'counter',
        x: 8 + (i % 5) * 17,
        y: 12 + Math.floor(i / 5) * 10,
        width: 13,
        height: 7,
        capacity: 1,
        restaurantId: restaurant!.id,
        sortOrder: i,
      })),
      // 卡座 - 4个
      { name: '卡座A', type: 'booth', x: 8, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant!.id, sortOrder: 10 },
      { name: '卡座B', type: 'booth', x: 30, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant!.id, sortOrder: 11 },
      { name: '卡座C', type: 'booth', x: 52, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant!.id, sortOrder: 12 },
      { name: '卡座D', type: 'booth', x: 74, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant!.id, sortOrder: 13 },
      // 小包厢 - 1个
      { name: '小包厢', type: 'private_small', x: 8, y: 62, width: 38, height: 28, capacity: 6, restaurantId: restaurant!.id, sortOrder: 14 },
      // 大包厢 - 1个
      { name: '大包厢', type: 'private_large', x: 54, y: 62, width: 38, height: 28, capacity: 12, restaurantId: restaurant!.id, sortOrder: 15 },
    ]
    
    for (const table of tables) {
      await prisma.table.create({ data: table })
    }
  }
  
  if (!restaurant) {
    throw new Error('无法创建或找到餐厅')
  }
  
  return restaurant
}

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
    
    // 1. 获取或创建餐厅
    const restaurant = await getOrCreateRestaurant()
    
    // 2. 查找或创建客户
    let customer = null
    if (data.hostPhone) {
      customer = await prisma.customer.findUnique({
        where: { phone: data.hostPhone }
      })
    }
    
    if (customer) {
      // 更新回头客数据
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          totalVisits: { increment: 1 },
          lastVisit: data.date,
        }
      })
    } else if (data.hostPhone) {
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
    
    // 3. 创建宴请
    const banquet = await prisma.banquet.create({
      data: {
        title: data.title || '邀请函',
        date: data.date,
        time: data.time,
        guestCount: parseInt(data.guestCount) || 2,
        roomName: data.roomName || '',
        hostName: data.hostName,
        hostPhone: data.hostPhone || '',
        customerId: customer?.id,
        menu: JSON.stringify(data.menu || []),
        specialDishes: JSON.stringify(data.specialDishes || []),
        notes: data.notes,
        restaurantId: restaurant.id,
        bookingChannel: data.bookingChannel || 'phone',
        serviceStatus: 'booked',
      }
    })
    
    // 4. 自动生成服务任务
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
    
    // 5. 检查是否需要创建生日提醒
    if (customer?.birthday) {
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
    
    // 6. 生成链接
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://h-qshaoshifuv1.vercel.app'
    
    return NextResponse.json({
      success: true,
      banquet,
      customer: customer ? {
        id: customer.id,
        isReturnCustomer: customer.totalVisits > 1,
        totalVisits: customer.totalVisits,
      } : null,
      invitationId: banquet.id,
      invitationUrl: `${baseUrl}/invitation/${banquet.id}`,
      printUrl: `${baseUrl}/print/${banquet.id}`,
    })
  } catch (error: any) {
    console.error('Create banquet error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '创建失败',
      details: error?.message || '未知错误'
    }, { status: 500 })
  }
}
