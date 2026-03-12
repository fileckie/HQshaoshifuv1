# 部署问题排查指南

## 问题："An unexpected error occurred"

这是 Vercel 平台的临时错误，通常以下原因导致：
- Vercel 服务器暂时不可用
- 网络连接问题
- 区域服务中断

---

## 解决方案

### 方案 1：等待后重试（推荐）

等待 5-10 分钟后刷新页面重试。

Vercel 状态页面：https://www.vercel-status.com/

---

### 方案 2：使用 Neon 数据库（更稳定）

**步骤 1：创建 Neon 数据库**
1. 访问 https://neon.tech
2. 用 GitHub 账号登录
3. 创建新项目
4. 复制连接字符串（格式如下）

**步骤 2：部署到 Vercel**
1. 访问 https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 在 Environment Variables 中添加：
   ```
   DATABASE_URL = postgresql://用户名:密码@主机名/数据库名?sslmode=require
   NEXT_PUBLIC_APP_URL = https://你的项目名.vercel.app
   ```
4. 点击 Deploy

---

### 方案 3：手动分步部署

如果一键部署失败，尝试手动部署：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 进入项目目录
cd shaoshifu-invitation

# 4. 部署
vercel --prod
```

---

### 方案 4：使用 Railway 部署（备用）

如果 Vercel 持续不可用，可使用 Railway：

1. 访问 https://railway.app
2. 从 GitHub 导入项目
3. 添加 PostgreSQL 数据库
4. 设置环境变量
5. 部署

---

## 常见问题

### Q: Vercel Postgres 创建失败？

**解决**：使用 Neon 或 Supabase 替代：
- Neon: https://neon.tech
- Supabase: https://supabase.com

### Q: 部署成功但页面报错？

**检查清单**：
1. [ ] DATABASE_URL 是否正确设置
2. [ ] 数据库连接字符串是否包含 `?sslmode=require`
3. [ ] 是否重新部署过

### Q: 如何查看详细错误信息？

1. 进入 Vercel Dashboard
2. 点击你的项目
3. 点击 "Deployments"
4. 点击失败的部署
5. 查看 "Build Logs"

---

## 联系支持

如果以上方法都无效：

1. Vercel 支持：https://vercel.com/help
2. 查看 GitHub Issues：https://github.com/vercel/vercel/issues
3. Vercel Discord：https://vercel.com/discord

---

## 当前状态检查

Vercel 服务状态：https://www.vercel-status.com/

如果显示 "All Systems Operational" 但仍报错，尝试：
1. 清除浏览器缓存
2. 使用无痕模式
3. 更换浏览器
