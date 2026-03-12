# Vercel 部署问题解决指南

## ❌ 问题：SQLite 无法在 Vercel 使用

Vercel 是无服务器环境，文件系统只读，SQLite 无法写入数据。

## ✅ 解决方案：Vercel Postgres

### 步骤 1：创建 Postgres 数据库

1. 访问 https://vercel.com/dashboard
2. 点击你的项目 `hqinvitation`
3. 点击 **"Storage"** 标签
4. 点击 **"Create Database"**
5. 选择 **"Postgres"** → **"Continue"**
6. Region 选择 **"Singapore"**（离你最近）
7. 点击 **"Create"**

### 步骤 2：连接数据库

1. 创建完成后点击 **"Connect Project"**
2. 选择 `hqinvitation` 项目
3. 点击 **"Connect"**

✅ 环境变量会自动添加到你的项目！

### 步骤 3：重新部署

1. 在 Vercel Dashboard 找到你的项目
2. 点击 **"Deployments"**
3. 找到最新部署，点击 **"Redeploy"**

或者推送新代码触发部署。

---

## 🔧 本地开发怎么办？

本地可以继续用 SQLite，生产用 PostgreSQL。

### 方案 1：简单切换（推荐）

本地开发时：
```bash
# 使用 SQLite 配置
./switch-db.sh sqlite

# 启动开发服务器
npm run dev
```

生产环境（Vercel）自动使用 PostgreSQL，无需操作。

### 方案 2：本地也安装 PostgreSQL（可选）

如果你想本地也用 PostgreSQL：

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# 创建数据库
createdb hqinvitation

# 更新 .env.local
DATABASE_URL="postgresql://localhost:5432/hqinvitation"
```

---

## 📝 总结

| 环境 | 数据库 | 说明 |
|------|--------|------|
| 本地开发 | SQLite | 简单方便，./switch-db.sh sqlite |
| Vercel 生产 | PostgreSQL | Vercel Postgres，自动配置 |

---

## ⚠️ 重要提醒

部署到 Vercel 后，**数据库是空的**，需要重新创建第一个宴请。

如果想迁移数据，需要导出导入。
