import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - 创建 RSVP
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // 验证宴请是否存在
    const banquet = await prisma.banquet.findUnique({
      where: { id: params.id }
    })
    
    if (!banquet) {
      return NextResponse.json(
        { error: 'Banquet not found' },
        { status: 404 }
      )
    }
    
    // 创建 RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        banquetId: params.id,
        guestName: data.guestName,
        guestPhone: data.guestPhone,
        status: data.status,
        attendeeCount: data.status === 'confirmed' ? parseInt(data.attendeeCount) || 1 : 0,
        dietaryRestrictions: data.dietaryRestrictions,
        message: data.message,
      }
    })
    
    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('Error creating RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to create RSVP' },
      { status: 500 }
    )
  }
}

// GET - 获取宴请的所有 RSVP
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { banquetId: params.id },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}
