import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取单个宴请详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banquet = await prisma.banquet.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
        customer: {
          include: { preferences: true }
        },
        table: true,
        rsvps: true,
        serviceTasks: true,
      }
    })
    
    if (!banquet) {
      return NextResponse.json({ error: '宴请不存在' }, { status: 404 })
    }
    
    return NextResponse.json(banquet)
  } catch (error) {
    console.error('Error fetching banquet:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

// PUT - 更新宴请
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
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
        notes: data.notes,
        status: data.status,
        menu: JSON.stringify(data.menu),
        specialDishes: JSON.stringify(data.menu?.filter((d: any) => d.isSignature) || []),
        bookingChannel: data.bookingChannel,
        paymentStatus: data.paymentStatus,
        dietaryRestrictions: data.dietaryRestrictions,
        handoverNotes: data.handoverNotes,
      }
    })
    
    return NextResponse.json(updatedBanquet)
  } catch (error) {
    console.error('Error updating banquet:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// DELETE - 删除宴请
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.banquet.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting banquet:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
