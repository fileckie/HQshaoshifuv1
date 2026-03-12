# Vercel 自动部署指南

## 📋 部署流程概览

```
你推送代码 → GitHub Actions 自动构建 → 自动部署到 Vercel
     ↑___________________________________________↓
                  完全自动化！
```

---

## 第一步：安装 Vercel CLI

```bash
# 全局安装 Vercel CLI
npm install -g vercel

# 验证安装
vercel --version
```

---

## 第二步：登录 Vercel 并创建项目

```bash
# 登录（会打开浏览器验证）
vercel login

# 进入项目目录
cd /Users/leckie/kimi-projects/banquet-invitation/my-app

# 创建 Vercel 项目
vercel
```

执行 `vercel` 后会询问：
- **Set up "~/kimi-projects/banquet-invitation/my-app"?** → 输入 `Y`
- **Which scope do you want to deploy to?** → 选择你的用户名
- **Link to existing project?** → 输入 `N`（创建新项目）
- **What's your project name?** → 输入 `hqinvitation`（或你喜欢的名字）
- **In which directory is your code located?** → 直接回车（当前目录）

---

## 第三步：获取 Vercel Token

### 方法：通过 Vercel 网站创建

1. 访问 https://vercel.com/account/tokens
2. 点击 **"Create Token"**
3. 名称填写：`GitHub Actions`
4. 点击 **"Create"**
5. **立即复制 Token**（只显示一次！）

```
示例 Token：F3qXv9yZ...（很长一串）
```

---

## 第四步：配置 GitHub Secrets

1. 打开 GitHub 仓库设置页面：
   ```
   https://github.com/fileckie/HQinvitation/settings/secrets/actions
   ```

2. 点击 **"New repository secret"**

3. 添加以下 Secrets：

| Secret 名称 | 值 | 说明 |
|-------------|-----|------|
| `VERCEL_TOKEN` | 上面复制的 Token | Vercel 访问令牌 |

---

## 第五步：本地连接 Vercel 项目（获取项目 ID）

```bash
# 在项目目录执行
vercel link
```

完成后会生成 `.vercel/project.json` 文件：

```json
{
  "orgId": "team_xxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxx"
}
```

**注意**：这些 ID 已经保存在本地，GitHub Actions 通过 `vercel pull` 会自动获取。

---

## 第六步：配置 Vercel 环境变量

### 方法：在 Vercel Dashboard 设置

1. 访问 https://vercel.com/dashboard
2. 点击你的项目 `hqinvitation`
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | `file:./dev.db` | Production |

> 💡 **生产环境建议**：使用 Vercel Postgres 或 Neon 等服务器less数据库

---

## 第七步：推送配置到 GitHub

```bash
# 添加更新的配置文件
git add .

# 提交
git commit -m "配置 Vercel 自动部署"

# 推送（会自动触发部署！）
./push.sh "配置 Vercel 自动部署"
```

---

## 🎉 完成！自动部署已配置

现在每次你推送代码到 `main` 分支：

```bash
./push.sh "更新某某功能"
```

GitHub Actions 会自动：
1. ✅ 检出最新代码
2. ✅ 安装依赖
3. ✅ 构建项目
4. ✅ 部署到 Vercel

部署完成后会显示：
```
🔍  Inspect: https://vercel.com/xxx/hqinvitation/xxxx
✅  Production: https://hqinvitation-xxx.vercel.app
```

---

## 🔍 查看部署状态

### 方法 1：GitHub 仓库页面
- 打开仓库 → 点击 **"Actions"** 标签
- 查看部署日志

### 方法 2：Vercel Dashboard
- 访问 https://vercel.com/dashboard
- 查看实时构建日志和部署状态

---

## 🛠️ 故障排查

### 问题 1：部署失败 "VERCEL_TOKEN" 错误
```
Error: No token found
```
**解决**：检查 GitHub Secrets 中 `VERCEL_TOKEN` 是否正确设置

### 问题 2：构建失败
```
Error: Command "build" exited with 1
```
**解决**：
```bash
# 本地先测试构建
npm run build
```

### 问题 3：数据库错误
```
Error: Database connection failed
```
**解决**：在 Vercel Dashboard → Settings → Environment Variables 中添加 `DATABASE_URL`

---

## 💡 生产环境建议

### 数据库选择

| 方案 | 优点 | 缺点 |
|------|------|------|
| **SQLite (当前)** | 简单、免费 | 不能多实例读写 |
| **Vercel Postgres** | 官方集成、serverless | 有免费额度限制 |
| **Neon** | Serverless、免费额度大 | 需要额外配置 |

### 切换到 Vercel Postgres

```bash
# 1. 在 Vercel Dashboard 创建 Postgres 数据库
# 2. 连接后会自动设置环境变量
# 3. 更新 schema.prisma
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

---

## 📚 相关链接

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Actions: https://github.com/fileckie/HQinvitation/actions
- 部署文档: https://vercel.com/docs/concepts/git/vercel-for-github

---

**需要我帮你执行哪一步？** 例如：
- 安装 Vercel CLI
- 获取 Token
- 配置 Secrets
- 测试部署