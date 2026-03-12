# 🚀 一键部署指南（给同事）

不需要懂代码，5分钟完成部署！

## 步骤 1：准备账号（2分钟）

1. **注册 GitHub**
   - 访问 https://github.com/signup
   - 用邮箱注册，记住用户名和密码

2. **注册 Vercel**
   - 访问 https://vercel.com/signup
   - 选择 "Continue with GitHub"
   - 授权登录

## 步骤 2：创建数据库（1分钟）

### 使用 Vercel Postgres（推荐）

1. 登录 https://vercel.com/dashboard
2. 点击顶部 "Storage" 标签
3. 点击 "Create Database" → 选择 "Postgres"
4. Region 选择 "Singapore"
5. 点击 "Create"

完成！数据库会自动创建。

## 步骤 3：一键部署（2分钟）

### 方式 A：复制仓库后部署

1. **Fork 仓库**
   - 访问 https://github.com/fileckie/HQshaoshifuv1
   - 点击右上角 "Fork" 按钮
   - 等待几秒钟

2. **导入 Vercel**
   - 登录 https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择你 Fork 的 `HQshaoshifuv1` 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework: 保持默认 (Next.js)
   - 展开 "Environment Variables"
   - 添加变量：
     ```
     NEXT_PUBLIC_APP_URL = https://你的项目名.vercel.app
     ```
   - 点击 "Deploy"

4. **连接数据库**
   - 部署完成后，进入项目 Dashboard
   - 点击 "Storage" 标签
   - 点击 "Connect Database"
   - 选择你创建的数据库
   - 确认连接

5. **重新部署**
   - 连接数据库后，Vercel 会自动重新部署
   - 等待 1-2 分钟

### 方式 B：使用 Deploy 按钮（最简单）

点击下面按钮，按提示操作：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fileckie/HQshaoshifuv1&env=DATABASE_URL,NEXT_PUBLIC_APP_URL&envDescription=需要设置数据库连接字符串和应用URL)

部署时需要设置两个环境变量：

1. **DATABASE_URL**: 
   - 如果使用了 Vercel Postgres，先不填，部署后在 Storage 中连接
   - 如果使用其他数据库，填入连接字符串

2. **NEXT_PUBLIC_APP_URL**: 
   - 填入 `https://你的项目名.vercel.app`
   - 项目名可以在 Vercel 设置中查看

## 步骤 4：验证部署（30秒）

部署完成后，访问你的域名：
- 首页：`https://你的域名.vercel.app`
- 预约管理：`https://你的域名.vercel.app/admin`
- 座位平面图：`https://你的域名.vercel.app/admin/map`

看到页面就成功了！🎉

---

## 常见问题

### Q: 部署失败显示 "Build Failed"？

**解决**：
1. 检查是否正确设置了环境变量
2. 确保数据库已连接
3. 点击 "Redeploy" 重新部署

### Q: 页面显示 "Internal Server Error"？

**解决**：
1. 检查 DATABASE_URL 是否正确设置
2. 确认数据库连接字符串包含 `?sslmode=require`
3. 重新部署

### Q: 忘记设置环境变量？

**解决**：
1. 进入 Vercel Dashboard → 你的项目
2. 点击 "Settings" → "Environment Variables"
3. 添加缺失的变量
4. 点击 "Save" 后重新部署

### Q: 如何修改餐厅信息？

**解决**：
代码中已预设烧师富的信息，如需修改：
1. 修改 `app/api/banquet/route.ts` 中的餐厅数据
2. 重新提交到 GitHub
3. Vercel 会自动重新部署

---

## 分享给同事

部署完成后，直接分享这个链接：
```
https://你的域名.vercel.app/admin
```

同事打开即可使用！

---

## 需要帮助？

遇到问题请联系开发同学，或：
1. 查看详细文档：[DEPLOY.md](./DEPLOY.md)
2. Vercel 官方文档：https://vercel.com/docs
