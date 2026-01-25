# React 组件开发规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的 React 组件开发规范。

---

## 目录

1. [组件结构](#1-组件结构)
2. [组件类型](#2-组件类型)
3. [Props 设计](#3-props-设计)
4. [状态管理](#4-状态管理)
5. [生命周期与副作用](#5-生命周期与副作用)
6. [组件拆分](#6-组件拆分)

---

## 1. 组件结构

### 1.1 文件组织

```
components/
├── ui/                    # 基础 UI 组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Input/
│       ├── Input.tsx
│       ├── Input.test.tsx
│       └── index.ts
├── features/              # 功能组件
│   ├── BookingForm/
│   │   ├── BookingForm.tsx
│   │   ├── useBookingForm.ts
│   │   ├── BookingForm.test.tsx
│   │   └── index.ts
│   └── UserProfile/
│       ├── UserProfile.tsx
│       ├── UserProfile.test.tsx
│       └── index.ts
└── layouts/               # 布局组件
    ├── MainLayout.tsx
    └── DashboardLayout.tsx
```

### 1.2 组件内部结构

```typescript
// 1. 导入
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/utils/validators';
import type { User } from '@/types/user';

// 2. 类型定义
interface UserFormProps {
	user?: User;
	onSubmit: (data: UserFormData) => void;
	onCancel: () => void;
}

interface UserFormData {
	email: string;
	name: string;
}

// 3. 组件实现
export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
	// 3.1 Hooks
	const [formData, setFormData] = useState<UserFormData>({
		email: user?.email || '',
		name: user?.name || '',
	});
	const [errors, setErrors] = useState<Partial<UserFormData>>({});
	
	// 3.2 副作用
	useEffect(() => {
		// 副作用逻辑
	}, []);
	
	// 3.3 事件处理函数
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// 验证
		const newErrors: Partial<UserFormData> = {};
		if (!validateEmail(formData.email)) {
			newErrors.email = 'Invalid email';
		}
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		
		onSubmit(formData);
	};
	
	const handleInputChange = (field: keyof UserFormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// 清除该字段的错误
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};
	
	// 3.4 渲染函数（如果需要）
	const renderErrorMessage = (field: keyof UserFormData) => {
		if (!errors[field]) return null;
		return <span className="error">{errors[field]}</span>;
	};
	
	// 3.5 主渲染
	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Email</label>
				<input
					type="email"
					value={formData.email}
					onChange={(e) => handleInputChange('email', e.target.value)}
				/>
				{renderErrorMessage('email')}
			</div>
			
			<div>
				<label>Name</label>
				<input
					type="text"
					value={formData.name}
					onChange={(e) => handleInputChange('name', e.target.value)}
				/>
				{renderErrorMessage('name')}
			</div>
			
			<div>
				<Button type="submit">Save</Button>
				<Button type="button" onClick={onCancel}>Cancel</Button>
			</div>
		</form>
	);
}

// 4. 辅助函数（如果需要）
function formatFormData(data: UserFormData): string {
	return JSON.stringify(data);
}
```

---

## 2. 组件类型

### 2.1 展示组件（Presentational Components）

**职责**: 只负责展示，不包含业务逻辑

```typescript
interface UserCardProps {
	user: User;
	onSelect: (userId: string) => void;
}

/**
 * 用户卡片组件 - 纯展示
 */
export function UserCard({ user, onSelect }: UserCardProps) {
	return (
		<div className="user-card" onClick={() => onSelect(user.id)}>
			<img src={user.avatar} alt={user.name} />
			<h3>{user.name}</h3>
			<p>{user.email}</p>
		</div>
	);
}
```

### 2.2 容器组件（Container Components）

**职责**: 处理数据获取和业务逻辑

```typescript
/**
 * 用户列表容器 - 处理数据和逻辑
 */
export function UserListContainer() {
	// 数据获取
	const { data: users, isLoading, error } = useUsers();
	
	// 业务逻辑
	const handleSelectUser = (userId: string) => {
		router.push(`/users/${userId}`);
	};
	
	// 渲染展示组件
	if (isLoading) return <LoadingSpinner />;
	if (error) return <ErrorMessage error={error} />;
	
	return (
		<div>
			{users.map(user => (
				<UserCard
					key={user.id}
					user={user}
					onSelect={handleSelectUser}
				/>
			))}
		</div>
	);
}
```

### 2.3 复合组件（Compound Components）

```typescript
interface TabsContextValue {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

/**
 * 复合组件模式 - Tabs
 */
export function Tabs({ children, defaultTab }: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab);
	
	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab }}>
			<div className="tabs">{children}</div>
		</TabsContext.Provider>
	);
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
	return <div className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
	const context = React.useContext(TabsContext);
	if (!context) throw new Error('Tab must be used within Tabs');
	
	const isActive = context.activeTab === id;
	
	return (
		<button
			className={`tab ${isActive ? 'active' : ''}`}
			onClick={() => context.setActiveTab(id)}
		>
			{children}
		</button>
	);
};

Tabs.Panel = function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
	const context = React.useContext(TabsContext);
	if (!context) throw new Error('TabPanel must be used within Tabs');
	
	if (context.activeTab !== id) return null;
	
	return <div className="tab-panel">{children}</div>;
};

// 使用示例
<Tabs defaultTab="profile">
	<Tabs.List>
		<Tabs.Tab id="profile">Profile</Tabs.Tab>
		<Tabs.Tab id="settings">Settings</Tabs.Tab>
	</Tabs.List>
	
	<Tabs.Panel id="profile">
		<ProfileContent />
	</Tabs.Panel>
	<Tabs.Panel id="settings">
		<SettingsContent />
	</Tabs.Panel>
</Tabs>
```

---

## 3. Props 设计

### 3.1 Props 命名

```typescript
// ✅ 好的 Props 命名
interface ButtonProps {
	// 数据 Props
	children: React.ReactNode;
	label?: string;
	
	// 状态 Props（布尔值使用 is/has 前缀）
	isLoading?: boolean;
	isDisabled?: boolean;
	
	// 事件处理 Props（使用 on 前缀）
	onClick?: () => void;
	onSubmit?: (data: FormData) => void;
	
	// 样式 Props
	variant?: 'primary' | 'secondary';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

// ❌ 不好的命名
interface ButtonProps {
	text?: string;           // ✅ 应为 children 或 label
	loading?: boolean;       // ✅ 应为 isLoading
	disabled?: boolean;      // ✅ 应为 isDisabled
	click?: () => void;      // ✅ 应为 onClick
}
```

### 3.2 Props 默认值

```typescript
// ✅ 使用解构默认值
interface ButtonProps {
	variant?: 'primary' | 'secondary';
	size?: 'md' | 'lg';
	isDisabled?: boolean;
}

export function Button({
	variant = 'primary',
	size = 'md',
	isDisabled = false,
	...props
}: ButtonProps) {
	return (
		<button
			className={`btn btn-${variant} btn-${size}`}
			disabled={isDisabled}
			{...props}
		/>
	);
}

// ❌ 不要使用 defaultProps（已废弃）
Button.defaultProps = {
	variant: 'primary',
	size: 'md',
};
```

### 3.3 Props 验证

```typescript
// ✅ 使用 TypeScript 类型
interface UserAvatarProps {
	user: User;
	size: 'sm' | 'md' | 'lg';  // 限制为特定值
	alt: string;               // 必需
}

// ✅ 运行时验证（关键数据）
export function UserAvatar({ user, size, alt }: UserAvatarProps) {
	if (!user.avatar) {
		throw new Error('User avatar is required');
	}
	
	return <img src={user.avatar} alt={alt} />;
}
```

### 3.4 Children Props

```typescript
// ✅ 明确 children 类型
interface CardProps {
	children: React.ReactNode;  // 任何可渲染内容
	title: string;
}

// ✅ 限制 children 类型
interface ListProps {
	children: React.ReactElement<ListItemProps>[];  // 只接受 ListItem
}

// ✅ Render Props 模式
interface DataListProps<T> {
	data: T[];
	renderItem: (item: T) => React.ReactNode;
}

export function DataList<T>({ data, renderItem }: DataListProps<T>) {
	return (
		<div>
			{data.map((item, index) => (
				<div key={index}>{renderItem(item)}</div>
			))}
		</div>
	);
}
```

---

## 4. 状态管理

### 4.1 组件内部状态

```typescript
// ✅ 使用 useState
export function Counter() {
	const [count, setCount] = useState(0);
	
	const increment = () => setCount(prev => prev + 1);
	const decrement = () => setCount(prev => prev - 1);
	
	return (
		<div>
			<button onClick={decrement}>-</button>
			<span>{count}</span>
			<button onClick={increment}>+</button>
		</div>
	);
}

// ✅ 复杂状态使用 useReducer
type Action =
	| { type: 'ADD_ITEM'; item: Item }
	| { type: 'REMOVE_ITEM'; id: string }
	| { type: 'CLEAR' };

interface State {
	items: Item[];
	total: number;
}

function cartReducer(state: State, action: Action): State {
	switch (action.type) {
		case 'ADD_ITEM':
			return {
				items: [...state.items, action.item],
				total: state.total + action.item.price,
			};
		case 'REMOVE_ITEM':
			const item = state.items.find(i => i.id === action.id);
			return {
				items: state.items.filter(i => i.id !== action.id),
				total: state.total - (item?.price || 0),
			};
		case 'CLEAR':
			return { items: [], total: 0 };
		default:
			return state;
	}
}

export function ShoppingCart() {
	const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
	
	return (
		<div>
			<button onClick={() => dispatch({ type: 'ADD_ITEM', item: newItem })}>
				Add Item
			</button>
		</div>
	);
}
```

### 4.2 状态提升

```typescript
// ❌ 状态在子组件中，父组件无法控制
function ChildInput() {
	const [value, setValue] = useState('');
	return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// ✅ 状态提升到父组件
function ParentForm() {
	const [inputValue, setInputValue] = useState('');
	
	return (
		<div>
			<ControlledInput value={inputValue} onChange={setInputValue} />
			<p>Current value: {inputValue}</p>
		</div>
	);
}

function ControlledInput({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<input value={value} onChange={e => onChange(e.target.value)} />
	);
}
```

---

## 5. 生命周期与副作用

### 5.1 useEffect 使用

```typescript
// ✅ 数据获取
export function UserProfile({ userId }: { userId: string }) {
	const [user, setUser] = useState<User | null>(null);
	
	useEffect(() => {
		let cancelled = false;
		
		async function fetchUser() {
			const data = await getUserById(userId);
			if (!cancelled) {
				setUser(data);
			}
		}
		
		fetchUser();
		
		// 清理函数
		return () => {
			cancelled = true;
		};
	}, [userId]); // 依赖数组
	
	if (!user) return <LoadingSpinner />;
	return <div>{user.name}</div>;
}

// ✅ 事件监听
export function WindowSize() {
	const [size, setSize] = useState({ width: 0, height: 0 });
	
	useEffect(() => {
		const handleResize = () => {
			setSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		
		handleResize(); // 初始化
		window.addEventListener('resize', handleResize);
		
		// 清理
		return () => window.removeEventListener('resize', handleResize);
	}, []); // 空依赖，只在挂载/卸载时执行
	
	return <div>{size.width} x {size.height}</div>;
}

// ❌ 避免：缺少清理函数
useEffect(() => {
	const interval = setInterval(() => {
		console.log('tick');
	}, 1000);
	// 缺少清理！会导致内存泄漏
}, []);

// ✅ 正确：添加清理函数
useEffect(() => {
	const interval = setInterval(() => {
		console.log('tick');
	}, 1000);
	
	return () => clearInterval(interval);
}, []);
```

### 5.2 自定义 Hooks

```typescript
/**
 * 数据获取 Hook
 */
export function useUser(userId: string) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	
	useEffect(() => {
		let cancelled = false;
		
		async function fetchUser() {
			try {
				setIsLoading(true);
				const data = await getUserById(userId);
				if (!cancelled) {
					setUser(data);
					setError(null);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err as Error);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}
		
		fetchUser();
		
		return () => {
			cancelled = true;
		};
	}, [userId]);
	
	return { user, isLoading, error };
}

// 使用
export function UserProfile({ userId }: { userId: string }) {
	const { user, isLoading, error } = useUser(userId);
	
	if (isLoading) return <LoadingSpinner />;
	if (error) return <ErrorMessage error={error} />;
	if (!user) return <div>User not found</div>;
	
	return <div>{user.name}</div>;
}
```

---

## 6. 组件拆分

### 6.1 何时拆分

拆分组件的信号：
- 组件超过 200 行
- 有重复的 JSX 结构
- 逻辑复杂难以理解
- 需要在多处复用

### 6.2 拆分示例

```typescript
// ❌ 过大的组件
export function BookingPage() {
	// 100 行状态和逻辑...
	
	return (
		<div>
			{/* 复杂的表单 */}
			{/* 复杂的列表 */}
			{/* 复杂的图表 */}
		</div>
	);
}

// ✅ 拆分后
export function BookingPage() {
	return (
		<div>
			<BookingForm />
			<BookingList />
			<BookingChart />
		</div>
	);
}

// 每个子组件独立维护
export function BookingForm() {
	// 表单逻辑
}

export function BookingList() {
	// 列表逻辑
}

export function BookingChart() {
	// 图表逻辑
}
```

---

## 组件开发检查清单

- [ ] 组件职责单一
- [ ] Props 有明确类型定义
- [ ] 事件处理函数使用 on 前缀
- [ ] 布尔 Props 使用 is/has 前缀
- [ ] useEffect 有正确的依赖数组
- [ ] 副作用有清理函数
- [ ] 复杂逻辑提取为自定义 Hook
- [ ] 组件大小合理（< 200 行）
- [ ] 有必要的注释
- [ ] 有单元测试

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整 React 组件开发规范 |
