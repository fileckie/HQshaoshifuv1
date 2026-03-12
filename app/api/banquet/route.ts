import { NextResponse } from 'next/server'
import { prisma, initDatabase } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    // 自动初始化数据库（首次运行时）
    await initDatabase()
    
    const data = await request.json()
    
    // 创建餐厅（如果不存在）
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: '烧师富' }
    })
    
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
          name: '烧师富',
          address: '双塔街道竹辉路168号环宇荟·L133',
          phone: '17715549313',
          description: '板前创作烧鸟',
        }
      })
    }
    
    // 根据roomName找到对应的tableId
    let tableId = null
    if (data.roomName) {
      // 查找匹配的座位
      const table = await prisma.table.findFirst({
        where: {
          restaurantId: restaurant.id,
          type: data.roomName === '板前' ? 'counter' : 
                data.roomName === '卡座' ? 'booth' :
                data.roomName === '小包厢' ? 'private_small' :
                data.roomName === '大包厢' ? 'private_large' : undefined
        },
        orderBy: { sortOrder: 'asc' }
      })
      
      // 如果没有找到座位，创建一个
      if (!table && data.roomName) {
        const typeMap: Record<string, string> = {
          '板前': 'counter',
          '卡座': 'booth', 
          '小包厢': 'private_small',
          '大包厢': 'private_large'
        }
        const capacityMap: Record<string, number> = {
          '板前': 1,
          '卡座': 4,
          '小包厢': 6,
          '大包厢': 12
        }
        
        const newTable = await prisma.table.create({
          data: {
            name: data.roomName,
            type: typeMap[data.roomName] || 'counter',
            restaurantId: restaurant.id,
            x: 50,
            y: 50,
            width: 10,
            height: 10,
            capacity: capacityMap[data.roomName] || 4,
            sortOrder: 0
          }
        })
        tableId = newTable.id
      } else if (table) {
        tableId = table.id
      }
    }
    
    // 创建宴请活动
    const banquet = await prisma.banquet.create({
      data: {
        title: data.title || '邀请函',
        date: data.date,
        time: data.time,
        guestCount: parseInt(data.guestCount) || 2,
        roomName: data.roomName,
        tableId: tableId,
        hostName: data.hostName,
        hostPhone: data.hostPhone || '',
        notes: data.note || data.notes,
        menu: JSON.stringify(data.menu || []),
        specialDishes: JSON.stringify((data.menu || []).filter((d: any) => d.isSignature)),
        restaurantId: restaurant.id,
        // 内部管理字段
        bookingChannel: data.bookingChannel,
        paymentStatus: data.paymentStatus,
        dietaryRestrictions: data.dietaryRestrictions,
        prepReminder: data.prepReminder,
        handoverNotes: data.handoverNotes,
      }
    })
    
    return NextResponse.json({ id: banquet.id })
  } catch (error) {
    console.error('Error creating banquet:', error)
    return NextResponse.json(
      { error: 'Failed to create banquet' },
      { status: 500 }
    )
  }
}
