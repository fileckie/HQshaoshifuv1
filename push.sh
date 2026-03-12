#!/bin/bash

# 平江颂邀请函项目 - 一键推送脚本
# 用法: ./push.sh "你的提交消息"

# 获取提交消息，如果没有参数则使用默认消息
MESSAGE=${1:-"更新代码"}

echo "🚀 开始推送代码到 GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查是否有更改要提交
if git diff --quiet && git diff --cached --quiet; then
    echo "⚠️  没有要提交的更改"
    exit 0
fi

# 显示当前更改
echo "📋 更改的文件:"
git status --short
echo ""

# 添加所有更改
echo "➕ 添加更改到暂存区..."
git add .

# 提交更改
echo "✅ 提交更改: $MESSAGE"
git commit -m "$MESSAGE"

# 推送到远程
echo "📤 推送到 GitHub..."
git push origin main

# 检查推送结果
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 推送成功！"
    git log --oneline -1
else
    echo ""
    echo "❌ 推送失败，请检查网络或远程仓库配置"
    exit 1
fi
