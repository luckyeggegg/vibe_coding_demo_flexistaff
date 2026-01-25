# 样式编写规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的样式编写规范（Tailwind CSS）。

---

## 目录

1. [Tailwind CSS 使用](#1-tailwind-css-使用)
2. [样式组织](#2-样式组织)
3. [响应式设计](#3-响应式设计)
4. [主题与设计系统](#4-主题与设计系统)
5. [动画与过渡](#5-动画与过渡)

---

## 1. Tailwind CSS 使用

### 1.1 基本原则

- **优先使用 Tailwind 工具类**
- **避免自定义 CSS**（除非必要）
- **使用组件提取重复样式**
- **遵循设计系统**

### 1.2 className 组织

```typescript
// ✅ 按逻辑分组，使用换行
<button
	className={`
		// 布局
		flex items-center justify-center gap-2
		// 尺寸
		w-full h-12 px-4
		// 样式
		bg-blue-600 text-white rounded-lg
		// 交互
		hover:bg-blue-700 active:scale-95
		// 状态
		disabled:opacity-50 disabled:cursor-not-allowed
		// 过渡
		transition-all duration-200
	`}
>
	Submit
</button>

// ❌ 难以阅读的长字符串
<button className="flex items-center justify-center gap-2 w-full h-12 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
```

### 1.3 使用 clsx 管理条件类名

```typescript
import clsx from 'clsx';

interface ButtonProps {
	variant?: 'primary' | 'secondary';
	size?: 'sm' | 'md' | 'lg';
	isLoading?: boolean;
	className?: string;
}

export function Button({
	variant = 'primary',
	size = 'md',
	isLoading,
	className,
	...props
}: ButtonProps) {
	return (
		<button
			className={clsx(
				// 基础样式
				'rounded-lg font-medium transition-colors',
				// 变体样式
				{
					'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
					'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
				},
				// 尺寸样式
				{
					'px-3 py-1.5 text-sm': size === 'sm',
					'px-4 py-2 text-base': size === 'md',
					'px-6 py-3 text-lg': size === 'lg',
				},
				// 加载状态
				{
					'opacity-50 cursor-wait': isLoading,
				},
				// 外部传入的类名
				className
			)}
			disabled={isLoading}
			{...props}
		/>
	);
}
```

### 1.4 提取重复样式

```typescript
// ❌ 重复的样式
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg" />

// ✅ 提取为组件
export function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={clsx(
				'w-full px-4 py-2 border border-gray-300 rounded-lg',
				'focus:outline-none focus:ring-2 focus:ring-blue-500',
				className
			)}
			{...props}
		/>
	);
}

// ✅ 或使用 @apply (tailwind.css)
@layer components {
	.input-base {
		@apply w-full px-4 py-2 border border-gray-300 rounded-lg;
		@apply focus:outline-none focus:ring-2 focus:ring-blue-500;
	}
}
```

---

## 2. 样式组织

### 2.1 Tailwind 配置

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
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					// ... 完整色阶
					900: '#1e3a8a',
				},
				secondary: {
					// ...
				},
			},
			spacing: {
				'128': '32rem',
				'144': '36rem',
			},
			borderRadius: {
				'4xl': '2rem',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
	],
};
```

### 2.2 全局样式

```css
/* globals.css */

/* Tailwind 基础层 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 全局基础样式 */
@layer base {
	body {
		@apply bg-gray-50 text-gray-900;
	}
	
	h1 {
		@apply text-4xl font-bold;
	}
	
	h2 {
		@apply text-3xl font-semibold;
	}
	
	a {
		@apply text-blue-600 hover:text-blue-700 underline;
	}
}

/* 自定义组件样式 */
@layer components {
	.btn {
		@apply px-4 py-2 rounded-lg font-medium transition-colors;
	}
	
	.btn-primary {
		@apply bg-blue-600 text-white hover:bg-blue-700;
	}
	
	.card {
		@apply bg-white rounded-lg shadow-md p-6;
	}
}

/* 自定义工具类 */
@layer utilities {
	.text-balance {
		text-wrap: balance;
	}
}
```

---

## 3. 响应式设计

### 3.1 断点使用

Tailwind 默认断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

```typescript
// ✅ 移动优先设计
<div className={`
	// 默认（移动端）
	grid grid-cols-1 gap-4
	// 平板
	md:grid-cols-2 md:gap-6
	// 桌面
	lg:grid-cols-3 lg:gap-8
	// 大屏
	xl:grid-cols-4
`}>
	{/* 内容 */}
</div>

// ✅ 响应式文字大小
<h1 className="text-2xl md:text-3xl lg:text-4xl">
	Responsive Heading
</h1>

// ✅ 响应式显示/隐藏
<div>
	<div className="block md:hidden">
		{/* 仅在移动端显示 */}
		<MobileMenu />
	</div>
	<div className="hidden md:block">
		{/* 仅在桌面端显示 */}
		<DesktopMenu />
	</div>
</div>
```

### 3.2 响应式布局

```typescript
// ✅ 响应式导航栏
export function Header() {
	return (
		<header className={`
			flex items-center justify-between
			px-4 md:px-6 lg:px-8
			py-4
			bg-white shadow-sm
		`}>
			<Logo />
			
			{/* 移动端：汉堡菜单 */}
			<button className="md:hidden">
				<MenuIcon />
			</button>
			
			{/* 桌面端：导航链接 */}
			<nav className="hidden md:flex gap-6">
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/bookings">Bookings</Link>
				<Link href="/profile">Profile</Link>
			</nav>
		</header>
	);
}

// ✅ 响应式卡片网格
export function BookingGrid({ bookings }: { bookings: Booking[] }) {
	return (
		<div className={`
			grid gap-4
			grid-cols-1
			sm:grid-cols-2
			lg:grid-cols-3
			xl:grid-cols-4
		`}>
			{bookings.map(booking => (
				<BookingCard key={booking.id} booking={booking} />
			))}
		</div>
	);
}
```

---

## 4. 主题与设计系统

### 4.1 颜色系统

```typescript
// 定义颜色常量
export const colors = {
	primary: {
		light: '#3b82f6',  // blue-500
		DEFAULT: '#2563eb', // blue-600
		dark: '#1d4ed8',    // blue-700
	},
	success: {
		light: '#22c55e',   // green-500
		DEFAULT: '#16a34a', // green-600
		dark: '#15803d',    // green-700
	},
	error: {
		light: '#ef4444',   // red-500
		DEFAULT: '#dc2626', // red-600
		dark: '#b91c1c',    // red-700
	},
	warning: {
		light: '#f59e0b',   // amber-500
		DEFAULT: '#d97706', // amber-600
		dark: '#b45309',    // amber-700
	},
};

// 在组件中使用
<button className="bg-primary hover:bg-primary-dark">
	Submit
</button>
```

### 4.2 间距系统

```typescript
// 使用统一的间距
<div className={`
	// 内边距
	p-4    // 1rem (16px)
	px-6   // 1.5rem (24px)
	py-2   // 0.5rem (8px)
	
	// 外边距
	m-4    // 1rem
	mx-auto // 水平居中
	mt-8   // 2rem (32px)
	
	// 间隙
	gap-4  // 1rem
	space-y-4 // 子元素垂直间距 1rem
`}>
```

### 4.3 字体系统

```typescript
// 字体大小
<h1 className="text-4xl font-bold">Title</h1>      // 36px
<h2 className="text-3xl font-semibold">Subtitle</h2> // 30px
<p className="text-base">Body text</p>             // 16px
<span className="text-sm text-gray-600">Caption</span> // 14px

// 字体粗细
<p className="font-light">Light (300)</p>
<p className="font-normal">Normal (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

### 4.4 阴影系统

```typescript
// 卡片阴影
<div className="shadow-sm">Subtle shadow</div>
<div className="shadow">Default shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-xl">Extra large shadow</div>

// 内阴影
<div className="shadow-inner">Inner shadow</div>
```

---

## 5. 动画与过渡

### 5.1 Tailwind 过渡

```typescript
// ✅ 基础过渡
<button className={`
	bg-blue-600 text-white
	hover:bg-blue-700
	transition-colors duration-200
`}>
	Hover me
</button>

// ✅ 多属性过渡
<div className={`
	transform
	hover:scale-105 hover:-translate-y-1
	transition-all duration-300 ease-out
`}>
	Card with hover effect
</div>

// ✅ 加载动画
<div className="animate-spin">
	<LoadingIcon />
</div>

<div className="animate-pulse">
	Loading...
</div>
```

### 5.2 自定义动画

```javascript
// tailwind.config.js
module.exports = {
	theme: {
		extend: {
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in',
				'slide-in': 'slideIn 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideIn: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
		},
	},
};
```

```typescript
// 使用自定义动画
<div className="animate-fade-in">
	Fades in
</div>

<div className="animate-slide-in">
	Slides in from top
</div>
```

### 5.3 Framer Motion 集成

```typescript
import { motion } from 'framer-motion';

// ✅ 页面过渡
export function PageTransition({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
		>
			{children}
		</motion.div>
	);
}

// ✅ 列表动画
export function AnimatedList({ items }: { items: Item[] }) {
	return (
		<motion.ul>
			{items.map((item, index) => (
				<motion.li
					key={item.id}
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.1 }}
					className="p-4 bg-white rounded-lg"
				>
					{item.name}
				</motion.li>
			))}
		</motion.ul>
	);
}
```

---

## 样式检查清单

### Tailwind 使用
- [ ] 优先使用 Tailwind 工具类
- [ ] className 按逻辑分组
- [ ] 使用 clsx 管理条件类名
- [ ] 重复样式已提取为组件

### 响应式设计
- [ ] 采用移动优先设计
- [ ] 关键断点有测试
- [ ] 移动端和桌面端都可用
- [ ] 文字大小响应式

### 设计系统
- [ ] 使用设计系统定义的颜色
- [ ] 使用统一的间距
- [ ] 使用统一的字体大小
- [ ] 遵循设计规范

### 性能
- [ ] 避免过度的动画
- [ ] 过渡时长合理（< 300ms）
- [ ] 未使用的 CSS 已清除
- [ ] 生产构建启用 PurgeCSS

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整样式编写规范 |
