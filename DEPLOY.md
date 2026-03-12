# 烧师富预约系统 - 一键部署指南

支持一键部署到 Vercel，自动配置 PostgreSQL 数据库。

## 方案一：一键部署（推荐）

### 1. 准备工作

需要准备：
- GitHub 账号
- Vercel 账号（可用 GitHub 登录）

### 2. 创建 PostgreSQL 数据库

**方法一：使用 Vercel Postgres（最简单）**

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击顶部 "Storage" 标签
3. 点击 "Create Database" → 选择 "Postgres"
4. 选择 Region（推荐：Singapore 或 Tokyo，离中国近）
5. 创建成功后，点击 "Connect" → 选择你的项目

**方法二：使用 Neon（免费额度更大）**

1. 访问 [Neon](https://neon.tech) 注册账号
2. 创建新项目
3. 复制连接字符串（Connection String）

### 3. 部署项目

#### 方式 A：Vercel 按钮一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fileckie/HQshaoshifuv1)

点击后按步骤操作即可。

#### 方式 B：命令行部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 进入项目目录
cd shaoshifu-invitation

# 部署
vercel --prod
```

### 4. 配置环境变量

部署后需要设置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | 数据库连接字符串 |
| `NEXT_PUBLIC_APP_URL` | `https://你的域名.vercel.app` | 应用URL |

**设置方法：**
1. 进入 Vercel Dashboard → 你的项目 → Settings → Environment Variables
2. 添加上述变量
3. 点击 "Save" 后重新部署

---

## 方案二：手动分步部署

### 步骤 1：Fork 仓库

1. 访问 https://github.com/fileckie/HQshaoshifuv1
2. 点击右上角 "Fork" 按钮
3. 等待 Fork 完成

### 步骤 2：创建数据库

**使用 Neon（推荐免费方案）：**

```bash
# 1. 注册 https://neon.tech
# 2. 创建项目 → 复制 DATABASE_URL
```

### 步骤 3：Vercel 导入项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New Project"
3. 选择你 Fork 的仓库
4. 配置：
   - Framework: Next.js
   - Build Command: `prisma generate && prisma db push && next build`
   - Root Directory: `./`

### 步骤 4：设置环境变量

在 Vercel 项目设置中添加：

```
DATABASE_URL=postgresql://用户名:密码@主机/数据库名?sslmode=require
NEXT_PUBLIC_APP_URL=https://你的项目域名.vercel.app
```

### 步骤 5：部署

点击 "Deploy"，等待部署完成即可。

---

## 数据库初始化

首次部署后，系统会自动：
1. 创建数据库表结构
2. 初始化餐厅数据（烧师富）
3. 初始化座位数据（板前10席 + 卡座4桌 + 包厢2间）

---

## 本地开发 vs 生产环境

### 本地开发

使用 SQLite：
```bash
# .env.local
DATABASE_URL="file:./dev.db"
```

### 生产环境

使用 PostgreSQL：
```bash
# Vercel Environment Variables
DATABASE_URL="postgresql://..."
```

---

## 常见问题

### Q1: 部署后页面显示错误？

检查环境变量 `DATABASE_URL` 是否设置正确。

### Q2: 数据库连接失败？

确保数据库连接字符串包含 `?sslmode=require`。

### Q3: 如何重新初始化数据库？

在 Vercel 中重新部署即可，`prisma db push` 会自动更新表结构。

### Q4: 免费额度够用吗？

- Vercel Hobby: 每月 100GB 带宽，足够使用
- Neon Free: 每月 500MB 存储 + 100 小时计算时间，足够使用

---

## 部署后访问

部署完成后，你将获得：
- 首页：`https://你的域名.vercel.app`
- 预约管理：`https://你的域名.vercel.app/admin`
- 座位平面图：`https://你的域名.vercel.app/admin/map`

直接分享给同事即可使用！
