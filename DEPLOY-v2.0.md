# v2.0 部署指南

## ✅ 代码已提交

GitHub 仓库: https://github.com/fileckie/HQshaoshifuv1

如果推送卡住，请稍后手动执行：
```bash
cd ~/kimi-projects/banquet-invitation/shaoshifu-invitation
git push origin main
```

---

## 🚀 Vercel 部署步骤

### 步骤 1: 准备 PostgreSQL 数据库

Vercel 不支持 SQLite，需要 PostgreSQL。推荐使用 Neon (免费)：

1. 访问 https://neon.tech
2. 用 GitHub 账号登录
3. 创建新项目
4. 复制连接字符串：
   ```
   postgresql://user:password@host/db?sslmode=require
   ```

### 步骤 2: Vercel 项目设置

1. 访问 https://vercel.com
2. 导入 GitHub 仓库 `HQshaoshifuv1`
3. 环境变量设置：
   ```
   DATABASE_URL = postgresql://user:password@host/db?sslmode=require
   NEXT_PUBLIC_BASE_URL = https://你的域名.vercel.app
   ```

### 步骤 3: 部署

点击 Deploy，等待构建完成。

首次部署会自动运行：
- `prisma generate` - 生成客户端
- `next build` - 构建 Next.js

---

## 🔧 部署后配置

### 初始化数据

部署完成后，首次访问时需要初始化数据库。

访问以下 API 初始化基础数据：
```
https://你的域名.vercel.app/api/init
```

或者手动创建第一个餐厅数据。

### 验证部署

访问以下页面验证功能：
- 首页: `/`
- 创建预约: `/admin`
- 预约列表: `/admin/list`
- 客户管理: `/admin/customers`
- 今日看板: `/admin/dashboard`

---

## 🐛 常见问题

### 构建失败

检查 Vercel 构建日志，常见问题：
1. **DATABASE_URL 未设置** - 添加环境变量
2. **Prisma 生成失败** - 确保 postinstall 脚本正常

### 数据库连接失败

1. 检查 Neon 数据库是否允许 Vercel IP
2. 确认 SSL 模式：`sslmode=require`

### 图片导出问题

生产环境已使用 dom-to-image-more，比 html-to-image 更稳定。

---

## 📋 功能清单

| 功能 | 状态 | 备注 |
|------|------|------|
| 基础预约系统 | ✅ | 创建/编辑/删除/列表 |
| 邀请函页面 | ✅ | 多主题 + RSVP |
| 打印页面 | ✅ | 宾客版 + 员工版 |
| 客户管理 | ✅ | v2.0 新增 |
| 服务流程 | ✅ | v2.0 新增 |
| 数据看板 | ✅ | v2.0 新增 |
| 自动提醒 | ✅ | v2.0 新增 |

---

**部署状态**: 代码已提交 GitHub，等待 Vercel 部署
**版本**: v2.0
**最后更新**: 2026-03-13
