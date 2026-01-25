# FlexiStaff 设计系统

> 版本: v1.0  
> 创建日期: 2026-01-20  
> 设计风格: 简约现代 + 莫兰迪色系  
> 适用范围: FlexiStaff Part-Time Booking System

---

## 目录

1. [设计理念](#1-设计理念)
2. [色彩系统](#2-色彩系统)
3. [字体系统](#3-字体系统)
4. [间距与布局](#4-间距与布局)
5. [组件规范](#5-组件规范)
6. [图标系统](#6-图标系统)
7. [动效规范](#7-动效规范)
8. [响应式设计](#8-响应式设计)

---

## 1. 设计理念

### 1.1 核心原则

**简约 · 优雅 · 专业 · 高效**

FlexiStaff 作为企业内部系统，设计遵循以下核心理念：

| 原则 | 说明 | 体现 |
|------|------|------|
| **功能优先** | 设计服务于功能，不做过度装饰 | 清晰的信息层级，直观的操作流程 |
| **视觉舒适** | 莫兰迪色系营造柔和、专业的氛围 | 低饱和度配色，减少视觉疲劳 |
| **一致性** | 保持整个系统的视觉和交互一致 | 统一的组件库，标准化的交互模式 |
| **可访问性** | 确保所有用户都能轻松使用 | 合理的对比度，清晰的文字 |

### 1.2 设计目标

- **减少认知负担**: 简洁的界面让用户专注于任务本身
- **提升工作效率**: 快速定位功能，流畅完成操作
- **营造专业氛围**: 莫兰迪色系传递稳重、可靠的品牌形象
- **适应长时间使用**: 柔和的配色减少眼部疲劳

---

## 2. 色彩系统

### 2.1 莫兰迪色系设计

**莫兰迪色系** (Morandi Color Palette) 以其低饱和度、灰调、柔和的特点，非常适合企业内部系统。

#### 设计特点
- **低饱和度**: 避免强烈色彩刺激
- **灰调**: 在纯色基础上混入灰色
- **优雅**: 色彩之间和谐统一
- **舒适**: 长时间使用不易疲劳

### 2.2 主色调 (Primary Colors)

| 色彩名称 | HEX | RGB | 用途 |
|---------|-----|-----|------|
| **莫兰迪蓝** | `#7C9CB5` | rgb(124, 156, 181) | 主要按钮、重要链接、选中状态 |
| **莫兰迪蓝（深）** | `#5D7B94` | rgb(93, 123, 148) | 悬停状态、强调元素 |
| **莫兰迪蓝（浅）** | `#B8CFE0` | rgb(184, 207, 224) | 背景、辅助元素 |

```css
/* CSS 变量定义 */
:root {
	--color-primary: #7C9CB5;
	--color-primary-dark: #5D7B94;
	--color-primary-light: #B8CFE0;
}
```

**使用场景**:
- 主要操作按钮 (Login, Submit, Confirm)
- 重要链接
- 选中状态 (Selected, Active)
- 进度指示器

### 2.3 辅助色 (Secondary Colors)

| 色彩名称 | HEX | RGB | 用途 |
|---------|-----|-----|------|
| **莫兰迪绿** | `#8FAF9A` | rgb(143, 175, 154) | 成功状态、确认操作 |
| **莫兰迪橙** | `#D4A574` | rgb(212, 165, 116) | 警告提示、待处理 |
| **莫兰迪红** | `#C29A9A` | rgb(194, 154, 154) | 错误提示、删除操作 |
| **莫兰迪紫** | `#A495B8` | rgb(164, 149, 184) | 标签、徽章 |

```css
:root {
	--color-success: #8FAF9A;
	--color-warning: #D4A574;
	--color-error: #C29A9A;
	--color-accent: #A495B8;
}
```

**使用场景**:
- **莫兰迪绿**: 成功消息、已完成状态、确认图标
- **莫兰迪橙**: 警告提示、待处理事项、提醒通知
- **莫兰迪红**: 错误提示、危险操作、删除按钮
- **莫兰迪紫**: 标签、徽章、辅助信息

### 2.4 中性色 (Neutral Colors)

| 色彩名称 | HEX | RGB | 用途 |
|---------|-----|-----|------|
| **深灰** | `#4A4A4A` | rgb(74, 74, 74) | 主要标题、重要文字 |
| **中灰** | `#7A7A7A` | rgb(122, 122, 122) | 正文文字、说明文字 |
| **浅灰** | `#B0B0B0` | rgb(176, 176, 176) | 辅助文字、占位符 |
| **极浅灰** | `#E8E8E8` | rgb(232, 232, 232) | 分割线、边框 |
| **背景灰** | `#F5F5F5` | rgb(245, 245, 245) | 页面背景、卡片背景 |
| **纯白** | `#FFFFFF` | rgb(255, 255, 255) | 卡片、弹窗背景 |

```css
:root {
	--color-text-primary: #4A4A4A;
	--color-text-secondary: #7A7A7A;
	--color-text-tertiary: #B0B0B0;
	--color-border: #E8E8E8;
	--color-bg-primary: #F5F5F5;
	--color-bg-secondary: #FFFFFF;
}
```

### 2.5 色彩使用规范

#### 2.5.1 文字与背景对比度

确保符合 WCAG 2.1 AA 级标准（对比度至少 4.5:1）

| 组合 | 对比度 | 符合标准 | 用途 |
|------|--------|---------|------|
| 深灰 (#4A4A4A) + 白色 (#FFFFFF) | 9.1:1 | ✅ AAA | 主要文字 |
| 中灰 (#7A7A7A) + 白色 (#FFFFFF) | 4.7:1 | ✅ AA | 正文文字 |
| 莫兰迪蓝 (#7C9CB5) + 白色 (#FFFFFF) | 2.9:1 | ❌ | 仅用于装饰，不用于文字 |
| 莫兰迪蓝（深） (#5D7B94) + 白色 (#FFFFFF) | 4.2:1 | ⚠️ | 大文字可用 |

#### 2.5.2 色彩应用示例

```tsx
// ✅ 正确：主要按钮
<button className="bg-primary hover:bg-primary-dark text-white">
	Login
</button>

// ✅ 正确：成功消息
<div className="bg-success/10 border border-success text-text-primary">
	Booking confirmed successfully
</div>

// ✅ 正确：警告提示
<div className="bg-warning/10 border border-warning text-text-primary">
	Please review your booking details
</div>

// ❌ 错误：对比度不足
<button className="bg-primary text-primary-light">
	Submit
</button>
```

### 2.6 色彩调色板可视化

```
主色调 (Primary)
┌──────────────────────────────────────────────────────────┐
│ #B8CFE0 (浅)   │ #7C9CB5 (标准)   │ #5D7B94 (深)     │
│ Light          │ Primary          │ Dark             │
└──────────────────────────────────────────────────────────┘

辅助色 (Secondary)
┌──────────────────────────────────────────────────────────┐
│ #8FAF9A        │ #D4A574          │ #C29A9A          │
│ Success        │ Warning          │ Error            │
└──────────────────────────────────────────────────────────┘
│ #A495B8        │
│ Accent         │
└──────────────────────────────────────────────────────────┘

中性色 (Neutral)
┌──────────────────────────────────────────────────────────┐
│ #4A4A4A   │ #7A7A7A   │ #B0B0B0   │ #E8E8E8   │ #F5F5F5 │
│ 深灰      │ 中灰      │ 浅灰      │ 极浅灰    │ 背景灰  │
└──────────────────────────────────────────────────────────┘
```

---

## 3. 字体系统

### 3.1 字体选择

| 用途 | 字体 | 备选 |
|------|------|------|
| **英文** | Inter | SF Pro, Roboto, System Font |
| **数字** | Inter | SF Pro, Roboto |
| **代码** | JetBrains Mono | Monaco, Consolas |

**字体加载策略**:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
	             'Roboto', 'Helvetica Neue', Arial, sans-serif;
}
```

### 3.2 字体层级

| 层级 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| **H1** | 36px / 2.25rem | 700 Bold | 1.2 | 页面主标题 |
| **H2** | 28px / 1.75rem | 600 Semibold | 1.3 | 区块标题 |
| **H3** | 20px / 1.25rem | 600 Semibold | 1.4 | 卡片标题 |
| **H4** | 18px / 1.125rem | 600 Semibold | 1.4 | 小标题 |
| **Body Large** | 16px / 1rem | 400 Regular | 1.6 | 重要正文 |
| **Body** | 14px / 0.875rem | 400 Regular | 1.6 | 正文 |
| **Body Small** | 12px / 0.75rem | 400 Regular | 1.5 | 辅助文字 |
| **Caption** | 11px / 0.6875rem | 400 Regular | 1.4 | 说明文字 |

### 3.3 字体样式示例

```css
/* Tailwind CSS 配置 */
module.exports = {
	theme: {
		fontSize: {
			'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
			'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
			'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
			'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
			'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
			'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
			'body-sm': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
			'caption': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
		},
	},
};
```

### 3.4 文字颜色使用

```tsx
// 主要文字：深灰 (#4A4A4A)
<h1 className="text-text-primary">FlexiStaff</h1>

// 正文文字：中灰 (#7A7A7A)
<p className="text-text-secondary">Manage casual staff availability...</p>

// 辅助文字：浅灰 (#B0B0B0)
<span className="text-text-tertiary">Last updated: 5 mins ago</span>
```

---

## 4. 间距与布局

### 4.1 间距系统

采用 **8px 基准间距** (8-point grid system)

| 名称 | 值 | Tailwind Class | 用途 |
|------|-----|---------------|------|
| **xs** | 4px | `space-1` | 紧密元素 |
| **sm** | 8px | `space-2` | 小间距 |
| **md** | 16px | `space-4` | 标准间距 |
| **lg** | 24px | `space-6` | 大间距 |
| **xl** | 32px | `space-8` | 区块间距 |
| **2xl** | 48px | `space-12` | 大区块间距 |
| **3xl** | 64px | `space-16` | 页面区块间距 |

```css
/* CSS 变量定义 */
:root {
	--spacing-xs: 4px;
	--spacing-sm: 8px;
	--spacing-md: 16px;
	--spacing-lg: 24px;
	--spacing-xl: 32px;
	--spacing-2xl: 48px;
	--spacing-3xl: 64px;
}
```

### 4.2 容器宽度

| 断点 | 最大宽度 | 用途 |
|------|---------|------|
| **sm** | 640px | 移动端 |
| **md** | 768px | 平板 |
| **lg** | 1024px | 小桌面 |
| **xl** | 1280px | 标准桌面 |
| **2xl** | 1536px | 大屏 |

```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
	{/* 内容 */}
</div>
```

### 4.3 栅格系统

采用 **12 列栅格系统**

```tsx
// 三列布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	<div>Column 1</div>
	<div>Column 2</div>
	<div>Column 3</div>
</div>

// 不等宽布局
<div className="grid grid-cols-12 gap-4">
	<div className="col-span-12 lg:col-span-8">主内容</div>
	<div className="col-span-12 lg:col-span-4">侧边栏</div>
</div>
```

### 4.4 内外边距规范

```tsx
// ✅ 卡片内边距
<div className="p-6">      {/* 24px 内边距 */}
	<h3 className="mb-4">Title</h3>    {/* 16px 下边距 */}
	<p className="mb-2">Content</p>    {/* 8px 下边距 */}
</div>

// ✅ 按钮内边距
<button className="px-6 py-3">     {/* 水平 24px, 垂直 12px */}
	Submit
</button>

// ✅ 表单间距
<form className="space-y-4">       {/* 子元素垂直间距 16px */}
	<input />
	<input />
	<button />
</form>
```

---

## 5. 组件规范

### 5.1 按钮 (Buttons)

#### 主要按钮 (Primary Button)

```tsx
<button className="
	px-6 py-3 
	bg-primary hover:bg-primary-dark 
	text-white 
	rounded-lg 
	font-medium 
	transition-colors duration-200
	focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
">
	Login
</button>
```

**视觉效果**:
- 背景: 莫兰迪蓝 (#7C9CB5)
- 文字: 白色 (#FFFFFF)
- 悬停: 莫兰迪蓝（深） (#5D7B94)
- 圆角: 8px
- 内边距: 水平 24px，垂直 12px

#### 次要按钮 (Secondary Button)

```tsx
<button className="
	px-6 py-3 
	bg-white hover:bg-gray-50 
	text-primary 
	border border-primary 
	rounded-lg 
	font-medium 
	transition-colors duration-200
">
	Cancel
</button>
```

#### 文字按钮 (Text Button)

```tsx
<button className="
	px-4 py-2 
	text-primary hover:text-primary-dark 
	font-medium 
	transition-colors duration-200
">
	Learn More
</button>
```

#### 按钮状态

| 状态 | 样式 |
|------|------|
| **Normal** | 默认样式 |
| **Hover** | 背景加深，鼠标变为指针 |
| **Active** | 轻微缩放效果 (scale-98) |
| **Disabled** | 透明度 50%，禁用鼠标事件 |
| **Loading** | 显示加载图标，禁用点击 |

```tsx
// 禁用状态
<button disabled className="
	px-6 py-3 
	bg-primary 
	text-white 
	rounded-lg 
	opacity-50 
	cursor-not-allowed
">
	Submit
</button>

// 加载状态
<button disabled className="
	px-6 py-3 
	bg-primary 
	text-white 
	rounded-lg 
	flex items-center gap-2
">
	<LoadingSpinner className="w-4 h-4 animate-spin" />
	Processing...
</button>
```

### 5.2 输入框 (Input Fields)

```tsx
<div className="w-full">
	<label className="block text-text-primary font-medium mb-2">
		Email Address
	</label>
	<input
		type="email"
		placeholder="you@company.com.au"
		className="
			w-full 
			px-4 py-3 
			border border-border 
			rounded-lg 
			text-text-primary 
			placeholder-text-tertiary
			focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
			transition-all duration-200
		"
	/>
	<p className="mt-2 text-sm text-text-tertiary">
		Use your company email address
	</p>
</div>
```

**错误状态**:
```tsx
<input
	type="email"
	className="
		w-full 
		px-4 py-3 
		border-2 border-error 
		rounded-lg 
		text-text-primary
		focus:outline-none focus:ring-2 focus:ring-error
	"
/>
<p className="mt-2 text-sm text-error">
	Invalid email address
</p>
```

### 5.3 卡片 (Cards)

```tsx
<div className="
	bg-white 
	rounded-xl 
	p-6 
	border border-border 
	shadow-sm 
	hover:shadow-md 
	transition-shadow duration-200
">
	<div className="flex items-center gap-4 mb-4">
		<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
			<CalendarIcon className="w-6 h-6 text-primary" />
		</div>
		<h3 className="text-h3 text-text-primary">
			Real-time Availability
		</h3>
	</div>
	<p className="text-body text-text-secondary">
		Check casual staff availability by date, time and skills
	</p>
</div>
```

**卡片变体**:
- **基础卡片**: 白色背景 + 边框 + 轻微阴影
- **悬停卡片**: 悬停时阴影加深
- **可点击卡片**: 悬停时光标变为指针 + 轻微缩放

### 5.4 通知提示 (Alerts)

```tsx
// 成功提示
<div className="
	p-4 
	bg-success/10 
	border border-success 
	rounded-lg 
	flex items-start gap-3
">
	<CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0" />
	<div>
		<h4 className="font-medium text-text-primary mb-1">
			Booking Confirmed
		</h4>
		<p className="text-sm text-text-secondary">
			Your booking has been successfully confirmed.
		</p>
	</div>
</div>

// 警告提示
<div className="
	p-4 
	bg-warning/10 
	border border-warning 
	rounded-lg 
	flex items-start gap-3
">
	<AlertCircleIcon className="w-5 h-5 text-warning flex-shrink-0" />
	<div>
		<h4 className="font-medium text-text-primary mb-1">
			Action Required
		</h4>
		<p className="text-sm text-text-secondary">
			Please review your booking details before confirming.
		</p>
	</div>
</div>

// 错误提示
<div className="
	p-4 
	bg-error/10 
	border border-error 
	rounded-lg 
	flex items-start gap-3
">
	<XCircleIcon className="w-5 h-5 text-error flex-shrink-0" />
	<div>
		<h4 className="font-medium text-text-primary mb-1">
			Booking Failed
		</h4>
		<p className="text-sm text-text-secondary">
			Unable to process your booking. Please try again.
		</p>
	</div>
</div>
```

### 5.5 徽章 (Badges)

```tsx
// 状态徽章
<span className="
	inline-flex items-center 
	px-3 py-1 
	rounded-full 
	text-xs font-medium 
	bg-success/10 text-success
">
	Confirmed
</span>

<span className="
	inline-flex items-center 
	px-3 py-1 
	rounded-full 
	text-xs font-medium 
	bg-warning/10 text-warning
">
	Pending
</span>

<span className="
	inline-flex items-center 
	px-3 py-1 
	rounded-full 
	text-xs font-medium 
	bg-error/10 text-error
">
	Cancelled
</span>
```

---

## 6. 图标系统

### 6.1 图标库选择

**推荐图标库**: [Lucide Icons](https://lucide.dev/) 或 [Heroicons](https://heroicons.com/)

**特点**:
- 简洁现代的线性图标
- 一致的视觉风格
- 多种尺寸支持
- 易于自定义颜色

### 6.2 图标尺寸

| 尺寸 | 值 | 用途 |
|------|-----|------|
| **xs** | 16px | 行内图标 |
| **sm** | 20px | 小图标 |
| **md** | 24px | 标准图标 |
| **lg** | 32px | 大图标 |
| **xl** | 48px | 特大图标 |

```tsx
<CalendarIcon className="w-4 h-4" />   {/* 16px */}
<CalendarIcon className="w-5 h-5" />   {/* 20px */}
<CalendarIcon className="w-6 h-6" />   {/* 24px */}
<CalendarIcon className="w-8 h-8" />   {/* 32px */}
<CalendarIcon className="w-12 h-12" /> {/* 48px */}
```

### 6.3 图标颜色

```tsx
// 主色图标
<CalendarIcon className="w-6 h-6 text-primary" />

// 成功图标
<CheckCircleIcon className="w-5 h-5 text-success" />

// 警告图标
<AlertCircleIcon className="w-5 h-5 text-warning" />

// 错误图标
<XCircleIcon className="w-5 h-5 text-error" />

// 灰色图标
<UserIcon className="w-5 h-5 text-text-tertiary" />
```

### 6.4 图标与文字组合

```tsx
<button className="flex items-center gap-2">
	<PlusIcon className="w-4 h-4" />
	<span>Add New</span>
</button>

<div className="flex items-center gap-2 text-text-secondary">
	<ClockIcon className="w-4 h-4" />
	<span className="text-sm">Last updated: 5 mins ago</span>
</div>
```

---

## 7. 动效规范

### 7.1 动画原则

- **微妙**: 动画应该微妙，不喧宾夺主
- **快速**: 动画时长控制在 150-300ms
- **流畅**: 使用缓动函数（easing）确保流畅
- **有意义**: 动画应该帮助用户理解操作结果

### 7.2 过渡时长

| 时长 | 值 | 用途 |
|------|-----|------|
| **Fast** | 150ms | 小元素，颜色变化 |
| **Base** | 200ms | 标准过渡 |
| **Slow** | 300ms | 大元素，位置变化 |

```css
:root {
	--transition-fast: 150ms;
	--transition-base: 200ms;
	--transition-slow: 300ms;
}
```

### 7.3 缓动函数

```css
:root {
	--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
	--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

/* Tailwind 配置 */
.transition-smooth {
	transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
}
```

### 7.4 常用动画

#### 淡入淡出
```tsx
<div className="transition-opacity duration-200 hover:opacity-80">
	Content
</div>
```

#### 颜色过渡
```tsx
<button className="
	bg-primary 
	hover:bg-primary-dark 
	transition-colors duration-200
">
	Button
</button>
```

#### 阴影过渡
```tsx
<div className="
	shadow-sm 
	hover:shadow-md 
	transition-shadow duration-200
">
	Card
</div>
```

#### 缩放效果
```tsx
<button className="
	transform 
	hover:scale-105 
	active:scale-95 
	transition-transform duration-150
">
	Click Me
</button>
```

---

## 8. 响应式设计

### 8.1 断点系统

```javascript
// Tailwind 断点配置
module.exports = {
	theme: {
		screens: {
			'sm': '640px',   // 移动端
			'md': '768px',   // 平板
			'lg': '1024px',  // 小桌面
			'xl': '1280px',  // 标准桌面
			'2xl': '1536px', // 大屏
		},
	},
};
```

### 8.2 响应式间距

```tsx
<div className="
	p-4 md:p-6 lg:p-8
	space-y-4 md:space-y-6 lg:space-y-8
">
	{/* 内容 */}
</div>
```

### 8.3 响应式字体

```tsx
<h1 className="
	text-2xl md:text-3xl lg:text-4xl 
	font-bold
">
	FlexiStaff
</h1>

<p className="
	text-sm md:text-base 
	text-text-secondary
">
	Manage casual staff availability...
</p>
```

### 8.4 响应式布局

```tsx
// 移动端单列，桌面端多列
<div className="
	grid 
	grid-cols-1 
	md:grid-cols-2 
	lg:grid-cols-3 
	gap-4 md:gap-6
">
	<Card />
	<Card />
	<Card />
</div>

// 移动端隐藏，桌面端显示
<div className="hidden md:block">
	Desktop Menu
</div>

<div className="block md:hidden">
	Mobile Menu
</div>
```

---

## 9. Tailwind CSS 配置

### 9.1 完整配置文件

```javascript
// tailwind.config.js
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
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
			fontSize: {
				'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
				'h2': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
				'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
				'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
				'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
				'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
				'body-sm': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
				'caption': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
			},
			spacing: {
				'xs': '4px',
				'sm': '8px',
				'md': '16px',
				'lg': '24px',
				'xl': '32px',
				'2xl': '48px',
				'3xl': '64px',
			},
			borderRadius: {
				'DEFAULT': '8px',
				'lg': '12px',
				'xl': '16px',
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
			},
			transitionDuration: {
				'fast': '150ms',
				'base': '200ms',
				'slow': '300ms',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
	],
};
```

---

## 10. 设计检查清单

### 组件设计
- [ ] 使用莫兰迪色系配色
- [ ] 文字对比度符合 WCAG AA 标准
- [ ] 交互元素有明确的悬停/激活状态
- [ ] 间距符合 8px 基准网格
- [ ] 圆角统一使用 8px/12px/16px

### 响应式
- [ ] 在所有断点下可用
- [ ] 移动端有适当的触摸区域（最小 44x44px）
- [ ] 文字在移动端可读（最小 14px）

### 可访问性
- [ ] 颜色不是唯一的信息传达方式
- [ ] 交互元素有清晰的焦点状态
- [ ] 图标配有文字说明
- [ ] 表单有明确的标签和错误提示

### 性能
- [ ] 图片使用 WebP 格式
- [ ] 动画使用 GPU 加速属性 (transform, opacity)
- [ ] 避免不必要的重绘

---

## 附录

### A. 设计资源

- **Figma 设计文件**: [Link to Figma]
- **图标库**: [Lucide Icons](https://lucide.dev/)
- **字体**: [Inter on Google Fonts](https://fonts.google.com/specimen/Inter)

### B. 参考资料

- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0 | 2026-01-20 | 初始版本：莫兰迪色系设计系统完整定义 |
