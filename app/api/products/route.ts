import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取产品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    
    const where: any = {}
    if (category) where.category = category
    if (isActive !== null) where.isActive = isActive === 'true'
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

// POST - 创建产品
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category || '其他',
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true,
      }
    })
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}

// PUT - 批量更新产品
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // 批量更新或创建
    if (data.products && Array.isArray(data.products)) {
      const results = []
      
      for (const item of data.products) {
        if (item.id) {
          // 更新
          const updated = await prisma.product.update({
            where: { id: item.id },
            data: {
              name: item.name,
              description: item.description,
              category: item.category,
              sortOrder: item.sortOrder,
              isActive: item.isActive,
            }
          })
          results.push(updated)
        } else {
          // 创建
          const created = await prisma.product.create({
            data: {
              name: item.name,
              description: item.description,
              category: item.category,
              sortOrder: item.sortOrder,
              isActive: item.isActive ?? true,
            }
          })
          results.push(created)
        }
      }
      
      return NextResponse.json({ products: results })
    }
    
    return NextResponse.json({ error: '无效的数据格式' }, { status: 400 })
  } catch (error) {
    console.error('Error updating products:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
