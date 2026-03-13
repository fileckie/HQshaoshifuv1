// 服务任务 API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/service/tasks?banquetId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const banquetId = searchParams.get('banquetId')
    
    if (!banquetId) {
      return NextResponse.json({ success: false, error: '缺少宴请ID' }, { status: 400 })
    }
    
    const tasks = await prisma.serviceTask.findMany({
      where: { banquetId },
      orderBy: { scheduledAt: 'asc' }
    })
    
    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    return NextResponse.json({ success: false, error: '获取失败' }, { status: 500 })
  }
}

// POST /api/service/tasks - 创建任务
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const task = await prisma.serviceTask.create({
      data: {
        banquetId: data.banquetId,
        type: data.type,
        title: data.title,
        description: data.description,
        scheduledAt: data.scheduledAt,
        scriptId: data.scriptId,
        assignedTo: data.assignedTo,
      }
    })
    
    return NextResponse.json({ success: true, task })
  } catch (error) {
    return NextResponse.json({ success: false, error: '创建失败' }, { status: 500 })
  }
}

// PATCH /api/service/tasks?id=xxx - 更新任务状态
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: '缺少任务ID' }, { status: 400 })
    }
    
    const data = await request.json()
    
    const task = await prisma.serviceTask.update({
      where: { id },
      data: {
        status: data.status,
        actualAt: data.status === 'done' ? new Date() : undefined,
        completedBy: data.completedBy,
        notes: data.notes,
      }
    })
    
    return NextResponse.json({ success: true, task })
  } catch (error) {
    return NextResponse.json({ success: false, error: '更新失败' }, { status: 500 })
  }
}
