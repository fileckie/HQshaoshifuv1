// 客户管理 API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const level = searchParams.get('level') || ''
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    
    if (level) where.level = level
    
    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: { select: { banquets: true } }
      },
      orderBy: { totalVisits: 'desc' }
    })
    
    return NextResponse.json({ success: true, customers })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const existing = await prisma.customer.findUnique({
      where: { phone: data.phone }
    })
    
    if (existing) {
      return NextResponse.json({ success: false, error: '手机号已存在' }, { status: 400 })
    }
    
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        level: data.level || 'regular',
        tags: JSON.stringify(data.tags || []),
      }
    })
    
    return NextResponse.json({ success: true, customer })
  } catch (error) {
    return NextResponse.json({ success: false, error: '创建失败' }, { status: 500 })
  }
}
