<div align="center">

# 烧师富 · 板前创作烧鸟预约系统

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-316192?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css" />
</p>

<p align="center">
  <b>专为高端日料烧鸟餐厅设计的私域预约邀请系统</b><br/>
  极简日式美学 · 智能客户管理 · 全链路服务流程
</p>

<p align="center">
  <a href="https://h-qshaoshifuv1.vercel.app"><strong>🌐 在线演示</strong></a> ·
  <a href="#-快速开始"><strong>🚀 快速部署</strong></a> ·
  <a href="#-功能概览"><strong>📖 功能文档</strong></a>
</p>

</div>

---

## 📸 界面预览

<div align="center">

| 管理后台 | 邀请函 | 座位平面图 |
|---------|--------|-----------|
| 三步式预约流程，快速创建邀约 | 精美电子邀请函，支持一键分享 | 可视化座位管理，实时预订状态 |

</div>

---

## ✨ 功能概览

### 🎯 核心能力

<table>
<tr>
<td width="50%">

#### 📱 邀约卡系统
- **三步创建** - 客人信息 → 预订详情 → 内部备忘
- **精美设计** - 黑红白日式极简美学，自动生成邀约卡片
- **一键分享** - 微信/短信直接发送邀请函链接
- **双版打印** - 宾客展示版 + 员工内部备忘版

</td>
<td width="50%">

#### 🗺️ 座位管理
- **平面图展示** - 可视化板前、卡座、包厢布局
- **实时状态** - 各时段座位预订情况一目了然
- **灵活配置** - 支持 10席板前 + 4桌卡座 + 2间包厢

</td>
</tr>
<tr>
<td width="50%">

#### 👤 VIP客户管理
- **客户档案** - 记录生日、纪念日、公司职位
- **偏好记忆** - 自动记忆忌口、酒水偏好、座位偏好
- **客户标签** - 回头客、商务客、探店博主分类
- **回头客识别** - 预订时自动显示历史到店记录

</td>
<td width="50%">

#### 📋 服务流程管理
- **自动任务** - 创建预订自动生成服务节点
  - 宴会前30分钟：备餐提醒
  - 宴会前15分钟：包厢检查
  - 宴会开始：迎客准备
  - 宴会中：巡台、交接班
- **状态追踪** - 预订 → 确认 → 备餐 → 用餐 → 完成

</td>
</tr>
</table>

### 📊 运营看板

- **今日概览** - 实时展示今日预订数、预计宾客、上座率
- **时间轴视图** - 按时间排序展示所有预订
- **回头客标识** - 自动标记今日到店的回头客
- **生日提醒** - 提前7天自动提醒客户生日

---

## 🎨 设计特色

| 设计元素 | 说明 |
|---------|------|
| **色彩** | 黑(#0A0A0A) + 红(#C41E3A) + 白 - 经典日式配色 |
| **字体** | Noto Serif JP - 日式衬线字体 |
| **标识** | 六个红圈圈修饰，呼应品牌调性 |
| **氛围** | "让烧鸟重新变成一种可以创作的料理" |

### 座位配置

| 类型 | 数量 | 容量 | 特点 |
|------|------|------|------|
| 板前 | 10席 | 1人/席 | 近距离观看炭火料理 |
| 卡座 | 4桌 | 4人/桌 | 适合2-4人小聚 |
| 小包厢 | 1间 | 6人 | 私密空间 |
| 大包厢 | 1间 | 12人 | 宽敞舒适，适合宴请 |

---

## 🚀 快速开始

### 方式一：一键部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fileckie/HQshaoshifuv1)

**步骤：**
1. 点击上方按钮，使用 Vercel + Neon PostgreSQL 一键部署
2. 按提示连接 GitHub 仓库
3. Neon 数据库会自动配置，无需手动操作
4. 等待部署完成，访问你的域名即可使用

### 方式二：手动部署

```bash
# 1. 克隆项目
git clone https://github.com/fileckie/HQshaoshifuv1.git
cd HQshaoshifuv1

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，添加 DATABASE_URL

# 4. 初始化数据库
npx prisma db push

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 🛠️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                        前端层                            │
│  Next.js 14 + React 18 + TypeScript + Tailwind CSS     │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                        API层                             │
│  RESTful API + Prisma Client + Server Actions          │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                       数据层                             │
│  PostgreSQL (生产) / SQLite (开发) + Prisma ORM       │
└─────────────────────────────────────────────────────────┘
```

### 技术栈详情

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
- **图标**: [Lucide React](https://lucide.dev/)
- **图片导出**: [dom-to-image-more](https://github.com/1904labs/dom-to-image-more)

---

## 📁 项目结构

```
HQshaoshifuv1/
├── app/                          # Next.js App Router
│   ├── admin/                    # 管理后台
│   │   ├── page.tsx             # 创建预约
│   │   ├── list/page.tsx        # 预约列表
│   │   ├── dashboard/page.tsx   # 今日运营看板 ⭐
│   │   ├── map/page.tsx         # 座位平面图
│   │   ├── customers/           # 客户管理 ⭐
│   │   └── service/page.tsx     # 服务流程管理 ⭐
│   ├── api/                      # API 路由
│   │   ├── banquet/             # 预订 CRUD
│   │   ├── customers/           # 客户管理 API ⭐
│   │   ├── dashboard/           # 看板 API ⭐
│   │   └── service/             # 服务流程 API ⭐
│   ├── invitation/[id]/         # 邀请函展示页面
│   └── print/[id]/              # 打印页面
├── components/                   # React 组件
├── lib/                          # 工具库
│   └── prisma.ts                # Prisma 客户端
├── prisma/
│   └── schema.prisma            # 数据库模型定义
└── public/                       # 静态资源
```

> ⭐ 表示 v2.0 新增功能

---

## 📱 使用流程

### 创建邀约

```
1. 访问 /admin
2. 填写组局人信息（姓名、电话）
3. 选择日期、时间、席位类型
4. 填写内部备忘（饮食禁忌、备餐提醒等）
5. 点击创建 → 自动生成邀约卡链接
```

### 客户管理

```
1. 访问 /admin/customers
2. 查看所有客户档案
3. 点击客户查看详情和偏好
4. 编辑客户标签和备注
```

### 服务流程

```
1. 创建预订后自动生成服务任务
2. 访问 /admin/service 查看今日任务
3. 按时间节点完成各项服务
4. 系统自动记录服务状态
```

---

## 📝 更新日志

### v2.0 (2026-03-17)
- ✨ 新增 VIP 客户管理模块（档案、偏好、标签）
- ✨ 新增服务流程管理（自动任务生成）
- ✨ 新增今日运营看板（实时数据、时间轴）
- ✨ 新增自动提醒系统（生日、回头客）
- 🔧 修复邀约卡创建失败问题
- 🔧 优化 PostgreSQL 生产环境支持

### v1.0 (2026-03-12)
- 🎉 初始版本发布
- ✅ 预约创建/编辑/删除/列表
- ✅ 邀请函页面（日式美学设计）
- ✅ RSVP 回执系统
- ✅ 座位平面图可视化
- ✅ 双版本打印输出

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 许可证

[MIT](LICENSE) License © 2026 烧师富

---

<div align="center">

**Made with ❤️ for 烧师富 · 板前创作烧鸟**

</div>
