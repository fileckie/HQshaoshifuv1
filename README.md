# 烧师富 · 板前创作烧鸟预约系统 v2.0

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fileckie/HQshaoshifuv1)

一款专为高端日料烧鸟餐厅设计的预约邀请系统，采用黑红白的极简日式美学，支持邀约卡生成、座位平面图管理、VIP客户管理和服务流程管理。

---

## ✨ v2.0 新功能

### 🎯 VIP客户管理
- **客户档案** - 记录客户基本信息、生日、纪念日、公司职位
- **偏好记忆** - 自动记忆忌口、喜好部位、酒水偏好、座位偏好
- **客户标签** - 标记回头客、商务客、情侣、探店博主等
- **回头客识别** - 预订时自动识别，显示累计到店次数

### 🔔 服务流程管理
- **自动任务生成** - 创建预订时自动生成服务节点任务
  - 宴会前30分钟：备餐提醒
  - 宴会前15分钟：包厢检查
  - 宴会开始：迎客准备
  - 宴会中：上菜、巡台、交接班提醒
- **服务状态追踪** - 预订 → 确认 → 备餐 → 用餐 → 完成

### 📊 今日运营看板
- **实时数据** - 今日预订数、预计宾客、上座率
- **时间轴视图** - 按时间排序展示今日所有预订
- **回头客标识** - 自动标记今日到店的回头客

### 🎂 自动提醒系统
- **生日提醒** - 提前7天自动创建客户生日提醒
- **回头客提醒** - 预订时自动提示客户历史偏好

---

## 🎨 核心功能

### 预约管理
- **三步式预约流程** - 客人信息 → 预订详情 → 内部管理
- **邀约卡生成** - 自动生成精美的电子邀约卡，支持导出PNG/JPG
- **座位平面图** - 可视化展示板前10席、卡座4桌、大小包厢的预订状态
- **员工备忘** - 内部管理信息（饮食禁忌、备餐提醒、交接备注）
- **双版本打印** - 桌上版（客人展示）+ 员工版（内部备忘）

### 设计风格
- **色彩**：黑（#0A0A0A）+ 红（#C41E3A）+ 白
- **字体**：Noto Serif JP（日式衬线）
- **标识**：六个红圈圈修饰"板前创作烧鸟"
- **氛围**："不只是一家烧鸟店，更是烧鸟料理的创作道场"

### 座位配置
| 类型 | 数量 | 容量 |
|------|------|------|
| 板前 | 10席 | 1人/席 |
| 卡座 | 4桌 | 4人/桌 |
| 小包厢 | 1间 | 6人 |
| 大包厢 | 1间 | 12人 |

---

## 🛠️ 技术栈

- **前端**：Next.js 14 + React + TypeScript
- **样式**：Tailwind CSS
- **数据库**：Prisma + PostgreSQL (Vercel/Neon)
- **图片导出**：html-to-image + dom-to-image-more (A/B测试)

---

## 🚀 快速部署

### 1. 准备数据库

使用 [Neon](https://neon.tech) 免费 PostgreSQL：

1. 访问 https://neon.tech 注册
2. 创建新项目
3. 复制连接字符串

### 2. 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fileckie/HQshaoshifuv1)

**环境变量设置：**
```
DATABASE_URL = postgresql://user:password@host/db?sslmode=require
```

### 3. 验证部署

访问以下链接验证：
- `https://你的域名.vercel.app/admin` - 创建预约
- `https://你的域名.vercel.app/admin/customers` - 客户管理
- `https://你的域名.vercel.app/admin/dashboard` - 今日看板

---

## 💻 本地开发

```bash
# 安装依赖
npm install

# 设置环境变量（SQLite 本地开发）
echo 'DATABASE_URL="file:./dev.db"' > .env.local

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 📁 项目结构

```
app/
├── admin/
│   ├── page.tsx              # 创建预约
│   ├── list/page.tsx         # 预约列表
│   ├── dashboard/page.tsx    # 今日看板 ⭐v2.0
│   ├── customers/page.tsx    # 客户管理 ⭐v2.0
│   ├── customers/[id]/       # 客户详情 ⭐v2.0
│   └── service/page.tsx      # 服务流程 ⭐v2.0
├── api/
│   ├── banquet/              # 预订 CRUD
│   ├── customers/            # 客户管理 API ⭐v2.0
│   ├── dashboard/            # 看板 API ⭐v2.0
│   ├── service/              # 服务流程 API ⭐v2.0
│   └── reminders/            # 提醒 API ⭐v2.0
├── invitation/[id]/          # 邀请函页面
└── print/[id]/               # 打印页面

prisma/
└── schema.prisma             # 数据库模型
```

---

## 📝 更新日志

### v2.0 (2026-03-13)
- ✨ 新增 VIP 客户管理模块
- ✨ 新增服务流程管理（自动任务生成）
- ✨ 新增今日运营看板
- ✨ 新增自动提醒系统（生日、回头客）
- 🔧 优化图片导出（A/B测试方案）
- 🔧 支持 PostgreSQL 生产环境

### v1.0 (2026-03-12)
- 🎉 初始版本发布
- ✅ 预约创建/编辑/删除/列表
- ✅ 邀请函页面（多主题）
- ✅ RSVP 回执系统
- ✅ 座位平面图
- ✅ 双版本打印（宾客版/员工版）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License
