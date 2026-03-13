# Vercel 重新部署步骤

## 方法 1：通过 Git 触发自动部署（最简单）

由于 Vercel 已绑定 GitHub，任何新的 commit 都会触发重新部署。

```bash
# 在项目目录执行
cd ~/kimi-projects/banquet-invitation/shaoshifu-invitation

# 创建一个空 commit 触发部署
git commit --allow-empty -m "trigger: 重新部署"
git push origin main
```

## 方法 2：Vercel Dashboard 手动操作

### 步骤 1：找到项目
1. 访问 https://vercel.com/dashboard
2. 登录你的账号
3. 找到 `HQshaoshifuv1` 项目，点击进入

### 步骤 2：找到部署按钮
在项目页面里：

**方案 A - Deployments 标签：**
1. 点击顶部 `Deployments` 标签
2. 看到最新的部署记录
3. 点击右侧的 `⋮` (三个点) 
4. 选择 `Redeploy`

**方案 B - Git 连接：**
1. 点击顶部 `Git` 标签
2. 确认 Connected to GitHub
3. 点击 `Sync` 或 `Redeploy`

**方案 C - 项目设置：**
1. 点击顶部 `Settings` 标签
2. 左侧选择 `Git`
3. 找到 `Production Branch` 
4. 点击 `Redeploy`

## 方法 3：修改文件触发

在 GitHub 上直接修改任意文件（比如 README.md），保存后会自动触发部署。

## 部署后检查

部署完成后，访问以下链接验证：
- https://hqshaoshifuv1.vercel.app/admin/customers
- https://hqshaoshifuv1.vercel.app/admin/dashboard

如果看到错误页面，需要设置数据库环境变量。
