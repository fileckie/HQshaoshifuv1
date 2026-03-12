import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 自动初始化数据库（首次运行时）
export async function initDatabase() {
  try {
    // 检查是否已有餐厅数据
    const restaurantCount = await prisma.restaurant.count()
    
    if (restaurantCount === 0) {
      console.log('🍢 初始化烧师富餐厅数据...')
      
      // 创建餐厅
      const restaurant = await prisma.restaurant.create({
        data: {
          name: '烧师富',
          address: '双塔街道竹辉路168号环宇荟·L133',
          phone: '17715549313',
          description: '板前创作烧鸟',
        }
      })
      
      // 初始化座位数据
      const tables = [
        // 板前 - 10个位置
        ...Array.from({ length: 10 }, (_, i) => ({
          name: `板前${i + 1}号`,
          type: 'counter',
          x: 8 + (i % 5) * 17,
          y: 12 + Math.floor(i / 5) * 10,
          width: 13,
          height: 7,
          capacity: 1,
          restaurantId: restaurant.id,
        })),
        // 卡座 - 4个
        { name: '卡座A', type: 'booth', x: 8, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant.id },
        { name: '卡座B', type: 'booth', x: 30, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant.id },
        { name: '卡座C', type: 'booth', x: 52, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant.id },
        { name: '卡座D', type: 'booth', x: 74, y: 42, width: 18, height: 14, capacity: 4, restaurantId: restaurant.id },
        // 小包厢 - 1个
        { name: '小包厢', type: 'private_small', x: 8, y: 62, width: 38, height: 28, capacity: 6, restaurantId: restaurant.id },
        // 大包厢 - 1个
        { name: '大包厢', type: 'private_large', x: 54, y: 62, width: 38, height: 28, capacity: 12, restaurantId: restaurant.id },
      ]
      
      for (const table of tables) {
        await prisma.table.create({ data: table })
      }
      
      console.log('✅ 数据库初始化完成！')
    }
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error)
    // 不抛出错误，让应用继续运行
  }
}
