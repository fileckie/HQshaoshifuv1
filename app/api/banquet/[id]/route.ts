import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取单个宴请详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const banquet = await prisma.banquet.findUnique({
      where: { id: params.id },
      include: { 
        restaurant: true,
        table: true,
        rsvps: {
          select: {
            id: true,
            guestName: true,
            status: true,
            attendeeCount: true
          }
        }
      }
    })
    
    if (!banquet) {
      return NextResponse.json(
        { error: 'Banquet not found' },
        { status: 404 }
      )
    }
    
    // 解析 JSON 字段
    const menu = JSON.parse(banquet.menu || '[]')
    const specialDishes = JSON.parse(banquet.specialDishes || '[]')
    
    return NextResponse.json({
      ...banquet,
      menu,
      specialDishes
    })
  } catch (error) {
    console.error('Error fetching banquet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banquet' },
      { status: 500 }
    )
  }
}

// PUT - 更新宴请
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // 查找现有宴请
    const existingBanquet = await prisma.banquet.findUnique({
      where: { id: params.id },
      include: { restaurant: true }
    })
    
    if (!existingBanquet) {
      return NextResponse.json(
        { error: 'Banquet not found' },
        { status: 404 }
      )
    }
    
    // 更新餐厅信息
    await prisma.restaurant.update({
      where: { id: existingBanquet.restaurantId },
      data: {
        name: data.restaurantName || existingBanquet.restaurant.name,
        address: data.restaurantAddress || existingBanquet.restaurant.address,
        phone: data.restaurantPhone || existingBanquet.restaurant.phone,
        description: data.restaurantDesc || existingBanquet.restaurant.description,
        chefName: data.chefName,
        chefIntro: data.chefIntro,
      }
    })
    
    // 更新宴请信息
    const updatedBanquet = await prisma.banquet.update({
      where: { id: params.id },
      data: {
        title: data.title,
        date: data.date,
        time: data.time,
        guestCount: parseInt(data.guestCount),
        roomName: data.roomName,
        hostName: data.hostName,
        hostPhone: data.hostPhone,
        notes: data.notes || data.note,
        status: data.status,
        menu: JSON.stringify(data.menu || []),
        specialDishes: JSON.stringify((data.menu || []).filter((d: any) => d.isSignature)),
        // 内部管理字段
        bookingChannel: data.bookingChannel,
        paymentStatus: data.paymentStatus,
        dietaryRestrictions: data.dietaryRestrictions,
        prepReminder: data.prepReminder,
        handoverNotes: data.handoverNotes,
      }
    })
    
    return NextResponse.json(updatedBanquet)
  } catch (error) {
    console.error('Error updating banquet:', error)
    return NextResponse.json(
      { error: 'Failed to update banquet' },
      { status: 500 }
    )
  }
}

// DELETE - 删除宴请
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banquet.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting banquet:', error)
    return NextResponse.json(
      { error: 'Failed to delete banquet' },
      { status: 500 }
    )
  }
}
