# 状态管理规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的前端状态管理规范。

---

## 目录

1. [状态分类](#1-状态分类)
2. [本地状态管理](#2-本地状态管理)
3. [全局状态管理](#3-全局状态管理)
4. [服务器状态管理](#4-服务器状态管理)
5. [URL 状态](#5-url-状态)

---

## 1. 状态分类

### 1.1 状态类型

| 状态类型 | 说明 | 管理方式 | 示例 |
|---------|------|---------|------|
| **本地状态** | 组件内部状态 | useState, useReducer | 表单输入、模态框开关 |
| **全局状态** | 跨组件共享状态 | Context, Zustand | 用户信息、主题设置 |
| **服务器状态** | 后端数据缓存 | TanStack Query | API 数据、列表数据 |
| **URL 状态** | 路由参数和查询 | Next.js Router | 分页、筛选、搜索 |

### 1.2 选择指南

```typescript
// 是否需要在多个组件共享？
//   No  → 使用本地状态 (useState)
//   Yes ↓

// 是否是服务器数据？
//   Yes → 使用 TanStack Query
//   No  ↓

// 是否需要持久化？
//   Yes → 考虑 localStorage + Context/Zustand
//   No  ↓

// 是否需要 URL 同步？
//   Yes → 使用 URL 状态 (router query)
//   No  → 使用全局状态 (Context/Zustand)
```

---

## 2. 本地状态管理

### 2.1 useState 使用

```typescript
// ✅ 简单状态
export function Counter() {
	const [count, setCount] = useState(0);
	
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>+</button>
		</div>
	);
}

// ✅ 对象状态（使用函数式更新）
export function UserForm() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
	});
	
	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));
	};
	
	return (
		<form>
			<input
				value={formData.name}
				onChange={e => handleChange('name', e.target.value)}
			/>
			<input
				value={formData.email}
				onChange={e => handleChange('email', e.target.value)}
			/>
		</form>
	);
}

// ✅ 惰性初始化（避免每次渲染都计算）
export function ExpensiveComponent() {
	const [data, setData] = useState(() => {
		// 只在初始化时执行
		return computeExpensiveValue();
	});
}
```

### 2.2 useReducer 使用

```typescript
// ✅ 复杂状态逻辑使用 useReducer
type State = {
	items: Item[];
	filter: 'all' | 'active' | 'completed';
	sortBy: 'name' | 'date';
};

type Action =
	| { type: 'ADD_ITEM'; item: Item }
	| { type: 'REMOVE_ITEM'; id: string }
	| { type: 'SET_FILTER'; filter: State['filter'] }
	| { type: 'SET_SORT'; sortBy: State['sortBy'] };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'ADD_ITEM':
			return {
				...state,
				items: [...state.items, action.item],
			};
		
		case 'REMOVE_ITEM':
			return {
				...state,
				items: state.items.filter(item => item.id !== action.id),
			};
		
		case 'SET_FILTER':
			return {
				...state,
				filter: action.filter,
			};
		
		case 'SET_SORT':
			return {
				...state,
				sortBy: action.sortBy,
			};
		
		default:
			return state;
	}
}

export function TodoList() {
	const [state, dispatch] = useReducer(reducer, {
		items: [],
		filter: 'all',
		sortBy: 'date',
	});
	
	return (
		<div>
			<button onClick={() => dispatch({ type: 'ADD_ITEM', item: newItem })}>
				Add Item
			</button>
		</div>
	);
}
```

---

## 3. 全局状态管理

### 3.1 Context API

```typescript
// ✅ 创建 Context
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextValue {
	theme: 'light' | 'dark';
	setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Provider 组件
export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

// 自定义 Hook
export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
}

// 使用
export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	
	return (
		<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
			Toggle Theme
		</button>
	);
}
```

### 3.2 Zustand (推荐用于复杂全局状态)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ 定义 Store
interface UserStore {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			logout: () => set({ user: null }),
		}),
		{
			name: 'user-storage', // localStorage key
		}
	)
);

// 使用
export function UserProfile() {
	const user = useUserStore(state => state.user);
	const logout = useUserStore(state => state.logout);
	
	if (!user) {
		return <div>Please log in</div>;
	}
	
	return (
		<div>
			<p>Welcome, {user.name}</p>
			<button onClick={logout}>Logout</button>
		</div>
	);
}

// ✅ 选择器优化（避免不必要的重渲染）
export function UserName() {
	// 只订阅 user.name，其他字段变化不会触发重渲染
	const userName = useUserStore(state => state.user?.name);
	
	return <span>{userName}</span>;
}
```

### 3.3 Zustand 最佳实践

```typescript
// ✅ 拆分 Store（按功能模块）

// stores/userStore.ts
interface UserStore {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));

// stores/uiStore.ts
interface UIStore {
	sidebarOpen: boolean;
	toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
	sidebarOpen: true,
	toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
}));

// ✅ 使用 Immer 简化嵌套状态更新
import { immer } from 'zustand/middleware/immer';

interface BookingStore {
	bookings: Booking[];
	updateBooking: (id: string, updates: Partial<Booking>) => void;
}

export const useBookingStore = create<BookingStore>()(
	immer((set) => ({
		bookings: [],
		updateBooking: (id, updates) => set(state => {
			const booking = state.bookings.find(b => b.id === id);
			if (booking) {
				Object.assign(booking, updates);
			}
		}),
	}))
);
```

---

## 4. 服务器状态管理

### 4.1 TanStack Query (React Query)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ 数据获取
export function UserList() {
	const {
		data: users,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['users'],
		queryFn: fetchUsers,
		staleTime: 5 * 60 * 1000, // 5 分钟
	});
	
	if (isLoading) return <LoadingSpinner />;
	if (error) return <ErrorMessage error={error} />;
	
	return (
		<ul>
			{users.map(user => (
				<li key={user.id}>{user.name}</li>
			))}
		</ul>
	);
}

// ✅ 数据更新
export function CreateUserButton() {
	const queryClient = useQueryClient();
	
	const mutation = useMutation({
		mutationFn: createUser,
		onSuccess: () => {
			// 更新成功后，使缓存失效
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
	
	return (
		<button
			onClick={() => mutation.mutate({ name: 'John', email: 'john@example.com' })}
			disabled={mutation.isPending}
		>
			{mutation.isPending ? 'Creating...' : 'Create User'}
		</button>
	);
}

// ✅ 乐观更新
export function UpdateBookingButton({ booking }: { booking: Booking }) {
	const queryClient = useQueryClient();
	
	const mutation = useMutation({
		mutationFn: updateBooking,
		onMutate: async (newData) => {
			// 取消正在进行的查询
			await queryClient.cancelQueries({ queryKey: ['bookings', booking.id] });
			
			// 快照当前值
			const previousBooking = queryClient.getQueryData(['bookings', booking.id]);
			
			// 乐观更新
			queryClient.setQueryData(['bookings', booking.id], newData);
			
			// 返回快照以便回滚
			return { previousBooking };
		},
		onError: (err, newData, context) => {
			// 出错时回滚
			queryClient.setQueryData(
				['bookings', booking.id],
				context?.previousBooking
			);
		},
		onSettled: () => {
			// 最终重新获取数据
			queryClient.invalidateQueries({ queryKey: ['bookings', booking.id] });
		},
	});
	
	return (
		<button onClick={() => mutation.mutate({ status: 'confirmed' })}>
			Confirm Booking
		</button>
	);
}
```

### 4.2 Query Key 管理

```typescript
// ✅ 集中管理 Query Keys
export const queryKeys = {
	users: {
		all: ['users'] as const,
		lists: () => [...queryKeys.users.all, 'list'] as const,
		list: (filters: string) => [...queryKeys.users.lists(), filters] as const,
		details: () => [...queryKeys.users.all, 'detail'] as const,
		detail: (id: string) => [...queryKeys.users.details(), id] as const,
	},
	bookings: {
		all: ['bookings'] as const,
		lists: () => [...queryKeys.bookings.all, 'list'] as const,
		list: (filters: string) => [...queryKeys.bookings.lists(), filters] as const,
		details: () => [...queryKeys.bookings.all, 'detail'] as const,
		detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
	},
};

// 使用
const { data } = useQuery({
	queryKey: queryKeys.users.detail('user-123'),
	queryFn: () => fetchUser('user-123'),
});
```

---

## 5. URL 状态

### 5.1 Next.js Router

```typescript
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ 读取 URL 参数
export function BookingList() {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const filter = searchParams.get('filter') || 'all';
	
	const { data: bookings } = useQuery({
		queryKey: ['bookings', page, filter],
		queryFn: () => fetchBookings({ page, filter }),
	});
	
	// ...
}

// ✅ 更新 URL 参数
export function FilterButtons() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const setFilter = (filter: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('filter', filter);
		router.push(`?${params.toString()}`);
	};
	
	return (
		<div>
			<button onClick={() => setFilter('all')}>All</button>
			<button onClick={() => setFilter('active')}>Active</button>
			<button onClick={() => setFilter('completed')}>Completed</button>
		</div>
	);
}

// ✅ 自定义 Hook 简化 URL 状态管理
export function useUrlState<T = string>(
	key: string,
	defaultValue: T
): [T, (value: T) => void] {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	const value = (searchParams.get(key) as T) || defaultValue;
	
	const setValue = (newValue: T) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(key, String(newValue));
		router.push(`?${params.toString()}`);
	};
	
	return [value, setValue];
}

// 使用
export function SearchPage() {
	const [query, setQuery] = useUrlState('q', '');
	const [page, setPage] = useUrlState('page', '1');
	
	return (
		<div>
			<input value={query} onChange={e => setQuery(e.target.value)} />
			<p>Page: {page}</p>
		</div>
	);
}
```

---

## 状态管理检查清单

### 选择合适的方案
- [ ] 本地状态使用 useState/useReducer
- [ ] 服务器数据使用 TanStack Query
- [ ] 全局 UI 状态使用 Context/Zustand
- [ ] URL 可共享状态使用 router query

### 性能优化
- [ ] 避免不必要的全局状态
- [ ] 使用选择器避免重渲染
- [ ] 合理设置 TanStack Query 缓存时间
- [ ] 大型列表使用虚拟滚动

### 代码质量
- [ ] 状态有明确类型定义
- [ ] Context 有错误处理
- [ ] Query Keys 集中管理
- [ ] 状态更新使用函数式更新

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整状态管理规范 |
