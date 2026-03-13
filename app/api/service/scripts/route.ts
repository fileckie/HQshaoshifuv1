// 标准话术库 API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''
    
    const where: any = { status: 'active' }
    if (category) where.category = category
    
    const scripts = await prisma.serviceScript.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { useCount: 'desc' }
      ]
    })
    
    return NextResponse.json({ success: true, scripts })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const script = await prisma.serviceScript.create({
      data: {
        category: data.category,
        triggerType: data.triggerType,
        triggerDish: data.triggerDish,
        title: data.title,
        content: data.content,
      }
    })
    
    return NextResponse.json({ success: true, script })
  } catch (error) {
    return NextResponse.json({ success: false, error: '创建失败' }, { status: 500 })
  }
}

// 增加使用次数
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少ID' }, { status: 400 })
    }
    
    const script = await prisma.serviceScript.update({
      where: { id },
      data: { useCount: { increment: 1 } }
    })
    
    return NextResponse.json({ success: true, script })
  } catch (error) {
    return NextResponse.json({ success: false, error: '更新失败' }, { status: 500 })
  }
}
