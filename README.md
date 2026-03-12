# 平江颂 · 私域宴请邀请函系统

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css" />
</p>

<p align="center">
  <b>金海华餐饮集团 · 米其林一星餐厅 · 专属私宴邀请函系统</b>
</p>

---

## ✨ 功能特性

### 🎨 邀请函管理
- **一键生成邀请函** - 预填平江颂餐厅信息，快速生成精美邀请函
- **多风格模板** - 经典雅致、现代简约、极简留白三种风格可选
- **导出高清图片** - 支持导出 PNG 图片，方便分享到微信
- **二维码分享** - 自动生成邀请函二维码，扫码即可查看

### 📝 RSVP 回执系统
- **宾客在线回复** - 宾客可直接在邀请函页面确认出席
- **实时统计看板** - 查看确认出席人数、忌口信息等
- **自动汇总** - 主人可查看所有宾客回复详情

### 🖨️ 打印物料
- **对外菜牌** - 精美展示，彰显品味
- **对内员工卡** - 含服务备注、忌口信息等
- **A4 纸张优化** - 一键导出，直接打印

### 🔐 管理后台
- **密码保护** - 管理员密码登录（默认：`pingjiang2024`）
- **宴请列表** - 查看所有宴请记录，支持搜索和筛选
- **编辑功能** - 随时修改宴请信息
- **删除归档** - 支持删除不需要的宴请

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/fileckie/HQinvitation.git
cd HQinvitation

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 初始化数据库
npx prisma db push
npx prisma generate

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 即可使用。

---

## 📁 项目结构

```
HQinvitation/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台
│   │   ├── page.tsx       # 创建邀请函
│   │   ├── list/          # 宴请列表
│   │   └── edit/[id]/     # 编辑邀请函
│   ├── invitation/[id]/   # 邀请函展示页
│   ├── print/[id]/        # 打印版本
│   ├── api/               # API 路由
│   └── layout.tsx         # 根布局
├── components/            # 可复用组件
│   ├── PasswordGate.tsx   # 密码保护
│   ├── RSVPForm.tsx       # RSVP 表单
│   ├── RSVPStats.tsx      # RSVP 统计
│   └── TemplateSelector.tsx # 模板选择
├── lib/
│   └── prisma.ts          # Prisma 客户端
├── prisma/
│   └── schema.prisma      # 数据库模型
├── public/                # 静态资源
└── push.sh                # 一键推送脚本
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 14** | React 框架，支持 App Router |
| **TypeScript** | 类型安全 |
| **Tailwind CSS** | 原子化 CSS |
| **Prisma** | ORM 数据库管理 |
| **SQLite** | 开发数据库 |
| **html-to-image** | 邀请函导出图片 |
| **qrcode.react** | 二维码生成 |

---

## 📝 使用指南

### 创建邀请函

1. 访问首页，点击"创建邀请函"
2. 输入管理员密码：`pingjiang2024`
3. 填写宴请信息（主题、日期、时间、人数等）
4. 编辑今日菜单（可选招牌菜标记）
5. 点击"生成邀请函"
6. 分享二维码或链接给宾客

### 宾客 RSVP

1. 宾客收到邀请函链接/二维码
2. 打开邀请函页面
3. 点击"填写出席回执"
4. 选择确认出席/无法出席
5. 填写人数、忌口等信息
6. 提交后主人可实时查看

### 打印物料

1. 在宴请列表中找到目标宴请
2. 点击"打印菜单"按钮
3. 在新标签页中选择打印（Ctrl+P / Cmd+P）

---

## 🔧 配置说明

### 环境变量

```env
# 数据库（开发用 SQLite）
DATABASE_URL="file:./dev.db"

# 生产环境可配置 PostgreSQL
# DATABASE_URL="postgresql://user:pass@localhost:5432/hqinvitation"

# 应用 URL（用于生成 OG 图片）
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 修改默认密码

编辑 `components/PasswordGate.tsx`：

```typescript
const ADMIN_PASSWORD = '你的新密码'
```

---

## 🚀 部署

### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📱 移动端适配

- 完全响应式设计，支持手机、平板、电脑
- 针对微信内置浏览器优化
- 支持 PWA，可添加到手机桌面

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

<p align="center">
  <b>平江颂 · 一席私宴，尽显东方雅韵</b>
</p>
