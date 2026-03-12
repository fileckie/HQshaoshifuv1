// 测试数据库连接脚本
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    // 测试连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    // 测试查询
    const count = await prisma.restaurant.count();
    console.log(`📊 餐厅数量: ${count}`);
    
    await prisma.$disconnect();
    console.log('✅ 测试完成');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

test();
