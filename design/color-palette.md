# FlexiStaff 莫兰迪色系配色方案

> 快速色彩参考指南

---

## 🎨 完整色彩调色板

### 主色调 (Primary Colors)

```
┌─────────────────────────────────────────────────────────────┐
│                     莫兰迪蓝系列                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ░░░░░░░░░░░░░░░░░░     ████████████████████     ▓▓▓▓▓▓▓▓ │
│   #B8CFE0 (浅)           #7C9CB5 (标准)           #5D7B94  │
│   rgb(184, 207, 224)     rgb(124, 156, 181)      rgb(93,   │
│                                                   123, 148) │
│   背景、辅助元素          主按钮、链接、选中       悬停状态  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**CSS 变量**:
```css
--color-primary-light: #B8CFE0;
--color-primary: #7C9CB5;
--color-primary-dark: #5D7B94;
```

**Tailwind CSS**:
```jsx
<button className="bg-primary hover:bg-primary-dark text-white">
```

---

### 辅助色 (Secondary Colors)

```
┌────────────────────────────────────────────────────────────┐
│                   状态与反馈色彩                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ████████          ████████          ████████      ████████│
│  #8FAF9A           #D4A574           #C29A9A        #A495B8│
│  莫兰迪绿          莫兰迪橙           莫兰迪红       莫兰迪紫│
│                                                            │
│  成功/确认         警告/待处理        错误/删除      标签    │
│  rgb(143,175,154)  rgb(212,165,116)  rgb(194,154,  rgb(164,│
│                                      154)          149,184)│
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**使用示例**:
```jsx
// ✅ 成功消息
<div className="bg-success/10 border border-success text-text-primary">
  Booking confirmed successfully
</div>

// ⚠️ 警告提示
<div className="bg-warning/10 border border-warning text-text-primary">
  Please review your details
</div>

// ❌ 错误提示
<div className="bg-error/10 border border-error text-text-primary">
  Failed to process booking
</div>

// 🏷️ 标签徽章
<span className="bg-accent/10 text-accent px-3 py-1 rounded-full">
  VIP
</span>
```

---

### 中性色 (Neutral Colors)

```
┌────────────────────────────────────────────────────────────┐
│                     文字与背景色                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ▓▓▓▓  ████  ░░░░  ░░  ░  □                               │
│  #4A   #7A   #B0   #E8  #F5 #FFF                          │
│  深灰  中灰  浅灰  极浅 背景 纯白                           │
│                    灰   灰                                 │
│  主标  正文  辅助   边框 页面 卡片                          │
│  题    文字  文字        背景 背景                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**文字色彩使用**:
```jsx
<h1 className="text-text-primary">     // #4A4A4A - 主标题
<p className="text-text-secondary">    // #7A7A7A - 正文
<span className="text-text-tertiary">  // #B0B0B0 - 辅助说明
```

**背景色彩使用**:
```jsx
<body className="bg-bg-primary">        // #F5F5F5 - 页面背景
<div className="bg-bg-secondary">       // #FFFFFF - 卡片/弹窗背景
<hr className="border-border">          // #E8E8E8 - 分割线
```

---

## 🔍 对比度检查

### 文字与背景对比度 (WCAG 2.1)

| 组合 | 对比度 | 标准 | 用途 |
|------|--------|------|------|
| 深灰 (#4A4A4A) + 白色 (#FFFFFF) | 9.1:1 | ✅ AAA | 主要文字 - 推荐 |
| 中灰 (#7A7A7A) + 白色 (#FFFFFF) | 4.7:1 | ✅ AA | 正文文字 - 合格 |
| 浅灰 (#B0B0B0) + 白色 (#FFFFFF) | 2.3:1 | ❌ | 仅装饰用 |
| 主蓝 (#7C9CB5) + 白色 (#FFFFFF) | 2.9:1 | ❌ | 仅背景用 |
| 主蓝深 (#5D7B94) + 白色 (#FFFFFF) | 4.2:1 | ⚠️ | 大文字可用 |

**最佳实践**:
- ✅ 使用深灰 (#4A4A4A) 作为主要文字颜色
- ✅ 使用中灰 (#7A7A7A) 作为正文文字颜色
- ❌ 不要用莫兰迪色作为小文字颜色（对比度不足）
- ✅ 莫兰迪色用于按钮背景（配白色文字）

---

## 📐 色彩使用规范

### 1. 按钮

```jsx
// ✅ 主要按钮 - 莫兰迪蓝
<button className="bg-primary hover:bg-primary-dark text-white">
  Submit
</button>

// ✅ 次要按钮 - 白底蓝边
<button className="bg-white hover:bg-gray-50 text-primary border border-primary">
  Cancel
</button>

// ✅ 危险按钮 - 莫兰迪红
<button className="bg-error hover:bg-error/90 text-white">
  Delete
</button>
```

### 2. 状态徽章

```jsx
<span className="bg-success/10 text-success border border-success px-3 py-1 rounded-full">
  ✓ Confirmed
</span>

<span className="bg-warning/10 text-warning border border-warning px-3 py-1 rounded-full">
  ⏱ Pending
</span>

<span className="bg-error/10 text-error border border-error px-3 py-1 rounded-full">
  ✗ Cancelled
</span>
```

### 3. 卡片与容器

```jsx
// ✅ 白色卡片 + 灰色边框
<div className="bg-white border border-border rounded-xl p-6 shadow-sm">
  Card content
</div>

// ✅ 浅蓝背景卡片（强调）
<div className="bg-primary-light/20 border border-primary-light rounded-xl p-6">
  Highlighted card
</div>
```

### 4. 输入框

```jsx
// ✅ 正常状态
<input className="border border-border focus:border-primary focus:ring-2 focus:ring-primary" />

// ✅ 错误状态
<input className="border-2 border-error focus:border-error focus:ring-2 focus:ring-error" />

// ✅ 成功状态
<input className="border-2 border-success focus:border-success focus:ring-2 focus:ring-success" />
```

---

## 🎯 完整 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 主色调
        primary: {
          light: '#B8CFE0',
          DEFAULT: '#7C9CB5',
          dark: '#5D7B94',
        },
        // 辅助色
        success: '#8FAF9A',
        warning: '#D4A574',
        error: '#C29A9A',
        accent: '#A495B8',
        // 中性色
        text: {
          primary: '#4A4A4A',
          secondary: '#7A7A7A',
          tertiary: '#B0B0B0',
        },
        border: '#E8E8E8',
        bg: {
          primary: '#F5F5F5',
          secondary: '#FFFFFF',
        },
      },
    },
  },
};
```

---

## 📱 实际应用示例

### Landing Page Hero Section

```jsx
<section className="bg-bg-primary py-16">
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold text-text-primary mb-4">
      FlexiStaff
    </h1>
    <p className="text-lg text-text-secondary mb-8">
      Manage Casual Staff, Simplified
    </p>
    <div className="flex gap-4">
      <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">
        Login to Get Started
      </button>
      <button className="bg-white hover:bg-gray-50 text-primary border border-primary px-6 py-3 rounded-lg">
        View Quick Start Guide
      </button>
    </div>
  </div>
</section>
```

### Feature Card

```jsx
<div className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
    <CalendarIcon className="w-6 h-6 text-primary" />
  </div>
  <h3 className="text-xl font-semibold text-text-primary mb-2">
    Real-time Availability
  </h3>
  <p className="text-text-secondary">
    Check casual staff availability by date, time and skills
  </p>
</div>
```

### Alert Message

```jsx
<div className="bg-success/10 border border-success rounded-lg p-4 flex items-start gap-3">
  <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
  <div>
    <h4 className="font-medium text-text-primary mb-1">
      Booking Confirmed
    </h4>
    <p className="text-sm text-text-secondary">
      Your booking has been successfully confirmed.
    </p>
  </div>
</div>
```

---

## 🔗 相关资源

- **完整设计系统**: [design-system.md](./design-system.md)
- **设计目录**: [README.md](./README.md)
- **产品需求文档**: [../PRD_landing_page.md](../PRD_landing_page.md)

---

## 版本

v1.0 - 2026-01-20 - 初始版本
