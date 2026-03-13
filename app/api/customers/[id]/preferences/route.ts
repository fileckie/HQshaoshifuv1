// 客户偏好 API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const preferences = await prisma.customerPreference.findMany({
      where: { customerId: params.id },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    })
    
    return NextResponse.json({ success: true, preferences })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const preference = await prisma.customerPreference.create({
      data: {
        customerId: params.id,
        type: data.type,
        content: data.content,
        priority: data.priority || 1,
        sourceBanquetId: data.sourceBanquetId,
      }
    })
    
    return NextResponse.json({ success: true, preference })
  } catch (error) {
    return NextResponse.json({ success: false, error: '添加失败' }, { status: 500 })
  }
}
