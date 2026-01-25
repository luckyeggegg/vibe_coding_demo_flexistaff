# 性能规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的性能规范，遵循 **Performance Boundaries** 原则。

---

## 目录

1. [核心原则](#1-核心原则)
2. [性能边界](#2-性能边界)
3. [前端性能](#3-前端性能)
4. [后端性能](#4-后端性能)
5. [数据库优化](#5-数据库优化)
6. [性能监控](#6-性能监控)

---

## 1. 核心原则

### 1.1 Performance Boundaries

**定义明确的性能边界，超出边界需优化。**

### 1.2 性能优先级

1. **首先保证正确性** - 不要为性能牺牲代码质量
2. **先测量再优化** - 避免过早优化
3. **关注用户体验** - 优先优化可感知的性能
4. **设置性能预算** - 定义可接受的性能阈值

---

## 2. 性能边界

### 2.1 响应时间要求

| 操作类型 | 目标时间 | 最大可接受时间 |
|---------|---------|---------------|
| **页面加载（FCP）** | < 1.5s | < 2.5s |
| **页面交互（TTI）** | < 3.0s | < 5.0s |
| **API 响应** | < 200ms | < 500ms |
| **数据库查询** | < 50ms | < 200ms |
| **搜索** | < 500ms | < 1s |
| **批量操作** | < 2s | < 5s |

### 2.2 资源大小限制

| 资源类型 | 最大大小 |
|---------|---------|
| **JavaScript bundle** | < 200KB (gzipped) |
| **CSS bundle** | < 50KB (gzipped) |
| **图片（单张）** | < 200KB |
| **字体文件** | < 100KB |
| **总页面大小** | < 1MB |

### 2.3 性能预算配置

```javascript
// webpack.config.js
module.exports = {
	performance: {
		maxEntrypointSize: 250000,  // 250KB
		maxAssetSize: 200000,        // 200KB
		hints: 'error',              // 超出预算时报错
	},
};
```

---

## 3. 前端性能

### 3.1 代码分割

```typescript
// ✅ 路由级别代码分割
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const BookingForm = lazy(() => import('./pages/BookingForm'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<Routes>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/booking" element={<BookingForm />} />
				<Route path="/profile" element={<UserProfile />} />
			</Routes>
		</Suspense>
	);
}

// ✅ 组件级别代码分割（重组件）
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Analytics() {
	const [showChart, setShowChart] = useState(false);
	
	return (
		<div>
			<button onClick={() => setShowChart(true)}>Show Chart</button>
			{showChart && (
				<Suspense fallback={<p>Loading chart...</p>}>
					<HeavyChart />
				</Suspense>
			)}
		</div>
	);
}
```

### 3.2 图片优化

```typescript
// ✅ 使用 Next.js Image 组件（自动优化）
import Image from 'next/image';

function UserAvatar({ src, alt }: { src: string; alt: string }) {
	return (
		<Image
			src={src}
			alt={alt}
			width={48}
			height={48}
			loading="lazy"
			placeholder="blur"
		/>
	);
}

// ✅ 响应式图片
function Hero() {
	return (
		<picture>
			<source srcSet="/hero-mobile.webp" media="(max-width: 640px)" />
			<source srcSet="/hero-tablet.webp" media="(max-width: 1024px)" />
			<img src="/hero-desktop.webp" alt="Hero" loading="lazy" />
		</picture>
	);
}

// ❌ 不要：未优化的大图片
<img src="/hero-4k-uncompressed.png" alt="Hero" />
```

### 3.3 React 性能优化

```typescript
// ✅ 使用 memo 避免不必要的重渲染
import { memo } from 'react';

interface UserCardProps {
	user: User;
	onSelect: (id: string) => void;
}

export const UserCard = memo(({ user, onSelect }: UserCardProps) => {
	return (
		<div onClick={() => onSelect(user.id)}>
			<h3>{user.name}</h3>
			<p>{user.email}</p>
		</div>
	);
});

// ✅ 使用 useMemo 缓存计算结果
function BookingList({ bookings }: { bookings: Booking[] }) {
	const totalRevenue = useMemo(() => {
		return bookings.reduce((sum, b) => sum + b.amount, 0);
	}, [bookings]);
	
	return <div>Total Revenue: ${totalRevenue}</div>;
}

// ✅ 使用 useCallback 稳定函数引用
function UserList() {
	const [users, setUsers] = useState<User[]>([]);
	
	const handleSelect = useCallback((id: string) => {
		console.log('Selected user:', id);
	}, []); // 函数引用不变，避免子组件重渲染
	
	return (
		<div>
			{users.map(user => (
				<UserCard key={user.id} user={user} onSelect={handleSelect} />
			))}
		</div>
	);
}

// ❌ 不要：在 render 中创建新函数
function UserList({ users }: { users: User[] }) {
	return (
		<div>
			{users.map(user => (
				<UserCard
					key={user.id}
					user={user}
					onSelect={(id) => console.log(id)} // 每次渲染都创建新函数！
				/>
			))}
		</div>
	);
}
```

### 3.4 虚拟滚动（大列表）

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList({ items }: { items: User[] }) {
	const parentRef = useRef<HTMLDivElement>(null);
	
	const virtualizer = useVirtualizer({
		count: items.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 50, // 每项高度
	});
	
	return (
		<div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
			<div
				style={{
					height: `${virtualizer.getTotalSize()}px`,
					position: 'relative',
				}}
			>
				{virtualizer.getVirtualItems().map(virtualItem => (
					<div
						key={virtualItem.key}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: `${virtualItem.size}px`,
							transform: `translateY(${virtualItem.start}px)`,
						}}
					>
						<UserCard user={items[virtualItem.index]} />
					</div>
				))}
			</div>
		</div>
	);
}
```

### 3.5 防抖与节流

```typescript
import { debounce } from 'lodash';
import { useCallback } from 'react';

// ✅ 搜索框防抖
function SearchInput() {
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			// 执行搜索
			searchApi(query);
		}, 300), // 300ms 延迟
		[]
	);
	
	return (
		<input
			type="text"
			onChange={(e) => debouncedSearch(e.target.value)}
			placeholder="Search..."
		/>
	);
}

// ✅ 滚动事件节流
import { throttle } from 'lodash';

function ScrollTracker() {
	const handleScroll = useCallback(
		throttle(() => {
			console.log('Scroll position:', window.scrollY);
		}, 100), // 最多每 100ms 执行一次
		[]
	);
	
	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);
	
	return null;
}
```

---

## 4. 后端性能

### 4.1 缓存策略

```typescript
import Redis from 'ioredis';

const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
});

/**
 * 缓存包装器
 */
export async function withCache<T>(
	key: string,
	ttl: number,
	fetchFn: () => Promise<T>
): Promise<T> {
	// 尝试从缓存获取
	const cached = await redis.get(key);
	if (cached) {
		return JSON.parse(cached);
	}
	
	// 缓存未命中，执行函数
	const result = await fetchFn();
	
	// 存入缓存
	await redis.setex(key, ttl, JSON.stringify(result));
	
	return result;
}

// 使用示例
export async function getUserById(id: string): Promise<User> {
	return withCache(
		`user:${id}`,
		3600, // 1 小时
		async () => {
			return await db.users.findById(id);
		}
	);
}

// ✅ 批量缓存失效
export async function invalidateUserCache(userId: string): Promise<void> {
	await redis.del(`user:${userId}`);
	await redis.del(`user:${userId}:bookings`);
}
```

### 4.2 数据库连接池

```typescript
import { Pool } from 'pg';

// ✅ 使用连接池
const pool = new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	max: 20,                  // 最大连接数
	idleTimeoutMillis: 30000, // 空闲超时
	connectionTimeoutMillis: 2000, // 连接超时
});

// 使用连接池执行查询
export async function queryUsers(email: string): Promise<User[]> {
	const result = await pool.query(
		'SELECT * FROM users WHERE email = $1',
		[email]
	);
	return result.rows;
}
```

### 4.3 批量操作

```typescript
// ✅ 批量插入
export async function createManyBookings(
	bookings: BookingData[]
): Promise<void> {
	// 使用事务批量插入
	await db.transaction(async (tx) => {
		await tx.bookings.createMany({
			data: bookings,
			skipDuplicates: true,
		});
	});
}

// ❌ 不要：循环单条插入
export async function createManyBookings(
	bookings: BookingData[]
): Promise<void> {
	for (const booking of bookings) {
		await db.bookings.create({ data: booking }); // 慢！
	}
}

// ✅ 批量查询（DataLoader）
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids: readonly string[]) => {
	const users = await db.users.findMany({
		where: { id: { in: [...ids] } },
	});
	
	// 保持顺序
	return ids.map(id => users.find(u => u.id === id) || null);
});

// 使用
const user1 = await userLoader.load('user-1'); // 批量查询
const user2 = await userLoader.load('user-2'); // 合并到同一个查询
```

### 4.4 限流

```typescript
import rateLimit from 'express-rate-limit';

// API 限流
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 分钟
	max: 100,                 // 最多 100 次请求
	message: 'Too many requests, please try again later',
});

app.use('/api/', apiLimiter);

// 登录限流（更严格）
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5, // 最多 5 次登录尝试
	skipSuccessfulRequests: true,
});

app.post('/api/auth/login', loginLimiter, loginHandler);
```

---

## 5. 数据库优化

### 5.1 索引

```sql
-- ✅ 为常用查询字段创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ✅ 复合索引（查询多个字段）
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);

-- ✅ 部分索引（只索引部分数据）
CREATE INDEX idx_active_bookings ON bookings(created_at)
WHERE status = 'active';
```

### 5.2 查询优化

```typescript
// ✅ 只查询需要的字段
const users = await db.users.findMany({
	select: {
		id: true,
		email: true,
		name: true,
		// 不查询不需要的字段（如 passwordHash）
	},
});

// ❌ 不要：查询所有字段
const users = await db.users.findMany(); // 包含所有字段

// ✅ 使用分页
const PAGE_SIZE = 20;

const bookings = await db.bookings.findMany({
	take: PAGE_SIZE,
	skip: (page - 1) * PAGE_SIZE,
	orderBy: { createdAt: 'desc' },
});

// ✅ 预加载关联数据（避免 N+1 问题）
const bookings = await db.bookings.findMany({
	include: {
		user: true,      // 一次性加载用户数据
		store: true,     // 一次性加载门店数据
	},
});

// ❌ 不要：N+1 查询
const bookings = await db.bookings.findMany();
for (const booking of bookings) {
	booking.user = await db.users.findUnique({ where: { id: booking.userId } });
	// 每个 booking 都执行一次查询！
}
```

### 5.3 使用 EXPLAIN 分析

```typescript
// 分析慢查询
const query = `
	SELECT * FROM bookings
	WHERE user_id = $1 AND status = $2
	ORDER BY created_at DESC
	LIMIT 20
`;

const explainResult = await db.$queryRaw`
	EXPLAIN ANALYZE ${query}
`;

console.log(explainResult);
// 检查是否使用了索引，扫描行数等
```

---

## 6. 性能监控

### 6.1 Web Vitals 监控

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
	// 发送到分析服务
	fetch('/api/analytics', {
		method: 'POST',
		body: JSON.stringify(metric),
	});
}

// 监控核心 Web Vitals
getCLS(sendToAnalytics);  // Cumulative Layout Shift
getFID(sendToAnalytics);  // First Input Delay
getFCP(sendToAnalytics);  // First Contentful Paint
getLCP(sendToAnalytics);  // Largest Contentful Paint
getTTFB(sendToAnalytics); // Time to First Byte
```

### 6.2 API 性能监控

```typescript
import { performance } from 'perf_hooks';

/**
 * 性能监控中间件
 */
export function performanceMonitor(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const start = performance.now();
	
	res.on('finish', () => {
		const duration = performance.now() - start;
		
		// 记录慢请求
		if (duration > 500) {
			logger.warn('Slow request', {
				path: req.path,
				method: req.method,
				duration: `${duration.toFixed(2)}ms`,
			});
		}
		
		// 发送到监控服务
		metrics.timing('api.response_time', duration, {
			path: req.path,
			method: req.method,
			status: res.statusCode,
		});
	});
	
	next();
}

app.use(performanceMonitor);
```

### 6.3 性能测试

```typescript
import autocannon from 'autocannon';

// 压力测试
async function loadTest() {
	const result = await autocannon({
		url: 'http://localhost:3000/api/users',
		connections: 100,    // 并发连接数
		duration: 30,        // 测试持续时间（秒）
		pipelining: 1,
	});
	
	console.log('Requests/sec:', result.requests.average);
	console.log('Latency (avg):', result.latency.mean);
	console.log('Errors:', result.errors);
}
```

---

## 性能检查清单

### 前端
- [ ] 代码分割（路由级别）
- [ ] 图片优化（lazy loading, WebP）
- [ ] JavaScript bundle < 200KB
- [ ] 使用 memo/useMemo/useCallback
- [ ] 大列表使用虚拟滚动
- [ ] FCP < 2.5s

### 后端
- [ ] 使用缓存（Redis）
- [ ] 数据库连接池
- [ ] API 响应时间 < 500ms
- [ ] 实现限流
- [ ] 批量操作而非循环

### 数据库
- [ ] 关键字段有索引
- [ ] 避免 N+1 查询
- [ ] 只查询需要的字段
- [ ] 使用分页
- [ ] 查询时间 < 200ms

### 监控
- [ ] 监控 Web Vitals
- [ ] 记录慢查询
- [ ] API 性能监控
- [ ] 定期压力测试

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整性能规范 |
