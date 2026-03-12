#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 运行: node scripts/setup-db.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL || '';

console.log('🍢 烧师富预约系统 - 数据库初始化\n');

// 检查环境
if (isProduction || databaseUrl.includes('postgresql')) {
  console.log('📦 生产环境 detected (PostgreSQL)');
  
  // 使用 PostgreSQL schema
  const pgSchema = path.join(__dirname, '../prisma/schema.postgresql.prisma');
  const targetSchema = path.join(__dirname, '../prisma/schema.prisma');
  
  if (fs.existsSync(pgSchema)) {
    console.log('📝 切换到 PostgreSQL schema...');
    fs.copyFileSync(pgSchema, targetSchema);
  }
} else {
  console.log('💻 开发环境 detected (SQLite)');
}

// 生成 Prisma Client
console.log('🔧 生成 Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Prisma generate 失败');
  process.exit(1);
}

// 推送数据库结构
console.log('📤 推送数据库结构...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ 数据库初始化完成！');
} catch (e) {
  console.error('❌ 数据库推送失败');
  console.log('💡 提示：请检查 DATABASE_URL 环境变量是否正确设置');
  process.exit(1);
}

console.log('\n🎉 准备就绪，可以开始使用了！');
