#!/bin/bash

# 数据库配置切换脚本
# 用法: ./switch-db.sh [sqlite|postgres]

MODE=${1:-sqlite}

if [ "$MODE" = "sqlite" ]; then
    echo "🔄 切换到 SQLite 配置（本地开发）..."
    cp prisma/schema.sqlite.prisma prisma/schema.prisma
    echo "✅ 已切换到 SQLite"
    echo ""
    echo "请确保 .env.local 中有:"
    echo 'DATABASE_URL="file:./dev.db"'
elif [ "$MODE" = "postgres" ]; then
    echo "🔄 切换到 PostgreSQL 配置（生产环境）..."
    cp prisma/schema.postgres.prisma prisma/schema.prisma 2>/dev/null || echo "⚠️ schema.postgres.prisma 不存在，使用当前配置"
    echo "✅ 已切换到 PostgreSQL"
    echo ""
    echo "请确保环境变量中有 POSTGRES_URL"
else
    echo "用法: ./switch-db.sh [sqlite|postgres]"
    exit 1
fi

echo ""
echo "运行 prisma generate 更新客户端..."
npx prisma generate

echo ""
echo "完成！"
