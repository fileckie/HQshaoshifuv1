// 单个客户 API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        preferences: { orderBy: { priority: 'desc' } },
        banquets: {
          orderBy: { date: 'desc' },
          take: 10,
          include: { restaurant: true }
        },
        _count: { select: { banquets: true, reminders: true } }
      }
    })
    
    if (!customer) {
      return NextResponse.json({ success: false, error: '客户不存在' }, { status: 404 })
    }
    
    const tags = JSON.parse(customer.tags || '[]')
    
    return NextResponse.json({ success: true, customer: { ...customer, tags } })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        name: data.name,
        phone: data.phone,
        birthday: data.birthday,
        anniversary: data.anniversary,
        company: data.company,
        level: data.level,
        tags: JSON.stringify(data.tags || []),
        notes: data.notes,
      }
    })
    
    return NextResponse.json({ success: true, customer })
  } catch (error) {
    return NextResponse.json({ success: false, error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customer.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: '删除失败' }, { status: 500 })
  }
}
