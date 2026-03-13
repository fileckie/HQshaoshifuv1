// 根据手机号查询客户
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    if (!phone) {
      return NextResponse.json({ success: false, error: '缺少手机号' }, { status: 400 })
    }
    
    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: {
        preferences: { orderBy: { priority: 'desc' } },
        banquets: { orderBy: { date: 'desc' }, take: 5 }
      }
    })
    
    if (!customer) {
      return NextResponse.json({ success: true, exists: false, message: '新客户' })
    }
    
    const tags = JSON.parse(customer.tags || '[]')
    const isReturnCustomer = customer.totalVisits >= 2
    
    return NextResponse.json({ 
      success: true, 
      exists: true,
      isReturnCustomer,
      customer: { ...customer, tags }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: '查询失败' }, { status: 500 })
  }
}
