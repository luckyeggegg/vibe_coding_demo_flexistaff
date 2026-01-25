# FlexiStaff Landing Page PRD 文档

## 产品需求文档 (Product Requirements Document)

**文档版本**: v2.0
**创建日期**: 2026-01-18
**更新日期**: 2026-01-25
**产品名称**: FlexiStaff (Casual Staff Management Platform)
**文档类型**: Landing Page 产品需求文档（简化版）
**使用范围**: 企业内部系统 (Internal Use Only)
**目标市场**: 澳洲 (Australia)

---

## 1. 文档概述

### 1.1 背景
FlexiStaff 是一个面向澳洲中小型企业（500人以内）的兼职/临时员工 (Casual Staff) 资源管理平台。

### 1.2 Landing Page 定位
本 Landing Page 定位为**产品展示页面**，主要功能：
- 产品简介与亮点展示
- 吸引用户了解和使用产品
- 提供登录/注册入口
- 简要的使用教程引导

**设计参考**: [Relevance AI](https://relevanceai.com/) - 简洁的产品展示风格

### 1.3 成功指标
| 指标 | 目标值 | 说明 |
|------|--------|------|
| 页面加载成功率 | > 99% | 系统稳定性 |
| 用户首次登录完成率 | > 95% | 引导效果 |

### 1.4 相关文档
- **系统功能需求**: 详见 [`PRD_system_features.md`](./PRD_system_features.md)（FAQ、支持联系、认证系统、技术架构等）
- **设计系统**: 详见 [`design/design-system.md`](./design/design-system.md)

---

## 2. 页面结构设计

### 2.1 整体页面架构

```
┌─────────────────────────────────────────────────────────┐
│                    导航栏 (Navigation)                   │
├─────────────────────────────────────────────────────────┤
│                    首屏区 (Hero Section)                 │
├─────────────────────────────────────────────────────────┤
│                    功能亮点区 (Features Highlights)      │
├─────────────────────────────────────────────────────────┤
│                    快速开始区 (Quick Start Guide)        │
├─────────────────────────────────────────────────────────┤
│                    页脚 (Footer)                         │
└─────────────────────────────────────────────────────────┘
```

**设计原则**: 简洁、展示为主、无复杂交互

---

### 2.2 各区块详细需求

#### 2.2.1 导航栏 (Navigation Bar)

**布局**: 固定顶部，滚动时保持可见

| 元素 | 内容 | 说明 |
|------|------|------|
| Logo | FlexiStaff | 点击回到首屏 |
| 导航链接 | Features / Get Started | 锚点跳转（可选） |
| Login 按钮 | "Login" / "Sign In" | 未登录时显示，跳转登录页 |
| Dashboard 按钮 | "Go to Dashboard" | 已登录时显示 |

**移动端**: 汉堡菜单，Login 按钮始终可见

---

#### 2.2.2 首屏区 (Hero Section)

**目标**: 快速传达产品价值，吸引用户

| 元素 | 内容示例 (英文) | 设计要求 |
|------|-----------------|----------|
| 主标题 (H1) | "Manage Casual Staff, Simplified" | 大字号，醒目 |
| 副标题 | "Book, track and manage casual staff availability in one place" | 补充说明 |
| 主 CTA | "Login to Get Started" | 主色调按钮 |
| 次 CTA | "Learn More" | 次要样式，锚点跳转到功能区 |
| 产品截图/插图 | 系统 Dashboard 界面预览或产品插图 | 展示产品界面 |

**视觉要求**:
- 首屏高度适配主流屏幕（100vh 或固定高度）
- 简洁专业的企业内部系统风格
- 产品截图需有阴影/边框，体现层次感

---

#### 2.2.3 功能亮点区 (Features Highlights Section)

**目标**: 展示产品核心功能和优势

**标题**: "What You Can Do with FlexiStaff"

**功能卡片**（6个核心功能）:

| 功能名称 | 英文标题 | 图标 | 简短描述 |
|----------|----------|------|----------|
| 实时可用性查询 | Real-time Availability | 日历图标 | Check staff availability instantly |
| 一键预定确认 | Quick Booking | 勾选图标 | Book available staff with one click |
| 智能冲突检测 | Conflict Detection | 警告图标 | Automatic scheduling conflict alerts |
| 预定管理 | Booking Management | 编辑图标 | Easily reschedule or cancel bookings |
| 个人日程面板 | My Schedule | 用户图标 | Manage your own availability |
| 数据报表分析 | Reports & Analytics | 图表图标 | Utilisation reports and insights |

**展示形式**:
- 卡片式网格布局 (2x3 或 3x2)
- 每张卡片包含：图标 + 标题 + 一行描述
- 悬停时轻微放大或阴影效果

---

#### 2.2.4 快速开始区 (Quick Start Guide Section)

**目标**: 帮助用户了解使用流程

**标题**: "Get Started in 3 Steps"

**步骤卡片**:

| 步骤 | 英文标题 | 描述 | 图标 |
|------|----------|------|------|
| Step 1 | Log In | Use your company credentials to access | 登录图标 |
| Step 2 | Search & Book | Find available staff and make a booking | 搜索图标 |
| Step 3 | Confirm & Track | Receive confirmation and track bookings | 确认图标 |

**附加元素**（可选）:
- "View Full User Guide" 链接
- 简短的动画或插图展示流程

---

#### 2.2.5 页脚 (Footer)

**内容**（简化版）:

| 区块 | 内容 |
|------|------|
| 系统信息 | FlexiStaff - Internal Use Only |
| 链接 | User Guide / Contact Support / Privacy Policy |
| 公司信息 | © 2026 [Company Name] - All Rights Reserved |

---

## 3. 交互设计要求

### 3.1 通用交互

| 交互项 | 要求 |
|--------|------|
| 页面加载 | 首屏加载 < 2秒 |
| 按钮反馈 | 悬停变色，点击有按压效果 |
| 导航滚动 | 点击导航锚点平滑滚动 |
| 登录跳转 | Login 按钮点击后跳转至登录页面 |

### 3.2 登录入口

- 点击 Login 按钮跳转至 `/login` 页面
- 登录页面独立实现（不在本 Landing Page 范围内）
- 已登录用户显示 "Go to Dashboard" 按钮

---

## 4. 视觉设计规范

### 4.1 设计风格

**FlexiStaff 采用简约现代风格 + 莫兰迪色系**

- **设计理念**: 功能优先、视觉舒适、一致性、可访问性
- **色彩特点**: 低饱和度、灰调、柔和优雅
- **适用场景**: 企业内部系统，长时间使用不易疲劳

### 4.2 品牌色彩 (莫兰迪色系)

#### 主色调
| 色彩名称 | 色值 | 用途 |
|----------|------|------|
| **莫兰迪蓝** | #7C9CB5 | 主按钮、重要链接、选中状态 |
| **莫兰迪蓝（深）** | #5D7B94 | 悬停状态、强调元素 |
| **莫兰迪蓝（浅）** | #B8CFE0 | 背景、辅助元素 |

#### 辅助色
| 色彩名称 | 色值 | 用途 |
|----------|------|------|
| **莫兰迪绿** | #8FAF9A | 成功状态、确认操作 |
| **莫兰迪橙** | #D4A574 | 警告提示、待处理 |
| **莫兰迪红** | #C29A9A | 错误提示、删除操作 |
| **莫兰迪紫** | #A495B8 | 标签、徽章 |

#### 中性色
| 色彩名称 | 色值 | 用途 |
|----------|------|------|
| **深灰** | #4A4A4A | 主要标题、重要文字 |
| **中灰** | #7A7A7A | 正文文字、说明文字 |
| **浅灰** | #B0B0B0 | 辅助文字、占位符 |
| **极浅灰** | #E8E8E8 | 分割线、边框 |
| **背景灰** | #F5F5F5 | 页面背景、卡片背景 |
| **纯白** | #FFFFFF | 卡片、弹窗背景 |

### 4.3 字体规范

| 元素 | 字体 | 字号 | 字重 | 行高 |
|------|------|------|------|------|
| **H1 主标题** | Inter / System Font | 36px / 2.25rem | Bold (700) | 1.2 |
| **H2 区块标题** | Inter / System Font | 28px / 1.75rem | Semibold (600) | 1.3 |
| **H3 卡片标题** | Inter / System Font | 20px / 1.25rem | Semibold (600) | 1.4 |
| **正文** | Inter / System Font | 14px / 0.875rem | Regular (400) | 1.6 |
| **辅助文字** | Inter / System Font | 12px / 0.75rem | Regular (400) | 1.5 |

### 4.4 间距规范 (8px 基准系统)

| 间距名称 | 值 | 用途 |
|----------|-----|------|
| **xs** | 4px | 紧密元素 |
| **sm** | 8px | 小间距 |
| **md** | 16px | 标准间距 |
| **lg** | 24px | 大间距 |
| **xl** | 32px | 区块间距 |
| **2xl** | 48px | 大区块间距 |
| **3xl** | 64px | 页面区块间距 |

---

## 5. 响应式设计

### 5.1 断点设置

| 设备类型 | 屏幕宽度 | 布局调整 |
|----------|----------|----------|
| Desktop | ≥ 1280px | 完整布局 |
| Small Desktop | 1024-1279px | 缩小间距 |
| Tablet | 768-1023px | 双列变单列 |
| Mobile | < 768px | 单列布局，汉堡菜单 |

### 5.2 移动端适配要点

- 导航栏折叠为汉堡菜单
- Login 按钮保持可见
- 功能卡片堆叠排列
- 支持触摸操作
- 字号适当放大确保可读性

---

## 6. 本地化要求 (Australia)

### 6.1 语言
- **主要语言**: English (Australian)
- **拼写**: 使用澳洲英语拼写 (colour, organisation, etc.)

### 6.2 日期时间格式
| 元素 | 格式 | 示例 |
|------|------|------|
| 日期 | DD/MM/YYYY | 25/01/2026 |
| 时间 | 12-hour 或 24-hour | 2:30 PM 或 14:30 |
| 时区 | AEST/AEDT | 显示时区标识 |

---

## 7. 技术实现建议

### 7.1 技术栈
| 层级 | 推荐技术 |
|------|----------|
| 前端框架 | Next.js + React 18 + TypeScript |
| 样式 | Tailwind CSS |
| 部署 | Vercel / AWS |

### 7.2 性能要求
| 指标 | 目标值 |
|------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |

---

## 8. 简化检查清单

### 8.1 上线前检查
- [ ] 页面在各断点下显示正常
- [ ] Login 按钮跳转正确
- [ ] 所有锚点链接工作正常
- [ ] 图片正常加载
- [ ] 英文文案无拼写错误
- [ ] 移动端适配正常

---

**文档更新记录**

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| v1.0 | 2026-01-18 | 初稿创建 | - |
| v1.1 | 2026-01-18 | 调整为澳洲企业内部使用场景 | - |
| v1.2 | 2026-01-19 | 新增用户流程图、系统架构图、回滚方案 | - |
| v1.3 | 2026-01-19 | 新增项目范围章节 | - |
| v1.4 | 2026-01-20 | 更新视觉设计规范为莫兰迪色系 | - |
| v2.0 | 2026-01-25 | **重大更新**: 简化为展示型 Landing Page；将系统级功能需求拆分至 PRD_system_features.md | - |
