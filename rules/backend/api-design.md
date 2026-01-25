# API 设计规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的 RESTful API 设计规范。

---

## 目录

1. [RESTful 原则](#1-restful-原则)
2. [URL 设计](#2-url-设计)
3. [HTTP 方法](#3-http-方法)
4. [请求与响应](#4-请求与响应)
5. [错误处理](#5-错误处理)
6. [版本控制](#6-版本控制)
7. [分页与过滤](#7-分页与过滤)

---

## 1. RESTful 原则

### 1.1 核心原则

1. **资源导向** - URL 表示资源，动词表示操作
2. **统一接口** - 使用标准 HTTP 方法
3. **无状态** - 每个请求包含所有必要信息
4. **分层系统** - 客户端不关心服务器架构
5. **可缓存** - 响应应明确是否可缓存

---

## 2. URL 设计

### 2.1 命名规范

```bash
# ✅ 好的 URL 设计
GET    /api/users                 # 获取用户列表
GET    /api/users/:id             # 获取单个用户
POST   /api/users                 # 创建用户
PUT    /api/users/:id             # 更新用户（完整）
PATCH  /api/users/:id             # 更新用户（部分）
DELETE /api/users/:id             # 删除用户

# ✅ 嵌套资源
GET    /api/users/:id/bookings    # 获取用户的预订列表
POST   /api/users/:id/bookings    # 为用户创建预订
GET    /api/bookings/:id/comments # 获取预订的评论

# ❌ 不好的 URL
GET    /api/getAllUsers           # 不要在 URL 中使用动词
POST   /api/user/create           # 不要在 URL 中使用动词
GET    /api/user-list             # 使用复数形式
GET    /api/Users                 # 使用小写
```

### 2.2 URL 结构

```
/api/{version}/{resource}/{id}/{sub-resource}/{sub-id}

示例：
/api/v1/users/user-123/bookings/booking-456
```

### 2.3 查询参数

```bash
# ✅ 过滤
GET /api/users?role=admin&status=active

# ✅ 排序
GET /api/users?sort=created_at&order=desc

# ✅ 分页
GET /api/users?page=2&limit=20

# ✅ 搜索
GET /api/users?q=john

# ✅ 字段选择
GET /api/users?fields=id,name,email

# ✅ 组合使用
GET /api/users?role=admin&sort=created_at&page=1&limit=20
```

---

## 3. HTTP 方法

### 3.1 方法使用

| 方法 | 用途 | 幂等性 | 安全性 | 请求体 | 响应体 |
|------|------|--------|--------|--------|--------|
| **GET** | 获取资源 | ✅ | ✅ | ❌ | ✅ |
| **POST** | 创建资源 | ❌ | ❌ | ✅ | ✅ |
| **PUT** | 完整更新 | ✅ | ❌ | ✅ | ✅ |
| **PATCH** | 部分更新 | ❌ | ❌ | ✅ | ✅ |
| **DELETE** | 删除资源 | ✅ | ❌ | ❌ | ✅/❌ |

### 3.2 示例

```typescript
// GET - 获取资源
app.get('/api/users/:id', async (req, res) => {
	const user = await getUserById(req.params.id);
	res.json(user);
});

// POST - 创建资源
app.post('/api/users', async (req, res) => {
	const user = await createUser(req.body);
	res.status(201).json(user);
});

// PUT - 完整更新（替换整个资源）
app.put('/api/users/:id', async (req, res) => {
	const user = await updateUser(req.params.id, req.body);
	res.json(user);
});

// PATCH - 部分更新（只更新提供的字段）
app.patch('/api/users/:id', async (req, res) => {
	const user = await partialUpdateUser(req.params.id, req.body);
	res.json(user);
});

// DELETE - 删除资源
app.delete('/api/users/:id', async (req, res) => {
	await deleteUser(req.params.id);
	res.status(204).send(); // No Content
});
```

---

## 4. 请求与响应

### 4.1 请求格式

```typescript
// ✅ 请求头
POST /api/users
Content-Type: application/json
Authorization: Bearer <token>

// ✅ 请求体（JSON）
{
	"email": "john@example.com",
	"name": "John Doe",
	"role": "staff"
}
```

### 4.2 响应格式

```typescript
// ✅ 成功响应（单个资源）
{
	"id": "user-123",
	"email": "john@example.com",
	"name": "John Doe",
	"role": "staff",
	"createdAt": "2026-01-20T10:00:00Z",
	"updatedAt": "2026-01-20T10:00:00Z"
}

// ✅ 成功响应（列表）
{
	"data": [
		{
			"id": "user-123",
			"name": "John Doe",
			"email": "john@example.com"
		},
		{
			"id": "user-456",
			"name": "Jane Smith",
			"email": "jane@example.com"
		}
	],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 100,
		"totalPages": 5
	}
}

// ❌ 不好的响应（缺少元数据）
[
	{ "id": 1, "name": "John" },
	{ "id": 2, "name": "Jane" }
]
```

### 4.3 HTTP 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| **200** | OK | 请求成功（GET, PUT, PATCH） |
| **201** | Created | 资源创建成功（POST） |
| **204** | No Content | 删除成功（DELETE） |
| **400** | Bad Request | 请求参数错误 |
| **401** | Unauthorized | 未认证 |
| **403** | Forbidden | 无权限 |
| **404** | Not Found | 资源不存在 |
| **409** | Conflict | 资源冲突（如重复的email） |
| **422** | Unprocessable Entity | 验证失败 |
| **429** | Too Many Requests | 请求过于频繁 |
| **500** | Internal Server Error | 服务器错误 |
| **503** | Service Unavailable | 服务不可用 |

```typescript
// ✅ 正确使用状态码
app.post('/api/users', async (req, res) => {
	try {
		const user = await createUser(req.body);
		res.status(201).json(user); // Created
	} catch (error) {
		if (error instanceof ValidationError) {
			res.status(400).json({ error: error.message }); // Bad Request
		} else if (error instanceof ConflictError) {
			res.status(409).json({ error: error.message }); // Conflict
		} else {
			res.status(500).json({ error: 'Internal server error' });
		}
	}
});
```

---

## 5. 错误处理

### 5.1 错误响应格式

```typescript
// ✅ 标准错误响应
{
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Validation failed",
		"details": [
			{
				"field": "email",
				"message": "Invalid email format"
			},
			{
				"field": "password",
				"message": "Password must be at least 8 characters"
			}
		]
	}
}

// ✅ 简单错误响应
{
	"error": "User not found"
}
```

### 5.2 错误代码

```typescript
// 定义错误代码常量
export const ERROR_CODES = {
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	UNAUTHORIZED: 'UNAUTHORIZED',
	FORBIDDEN: 'FORBIDDEN',
	NOT_FOUND: 'NOT_FOUND',
	CONFLICT: 'CONFLICT',
	INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// 使用
res.status(400).json({
	error: {
		code: ERROR_CODES.VALIDATION_ERROR,
		message: 'Invalid input',
		details: validationErrors,
	},
});
```

---

## 6. 版本控制

### 6.1 URL 版本控制（推荐）

```bash
# ✅ 在 URL 中包含版本号
GET /api/v1/users
GET /api/v2/users

# 主要版本变更时使用新版本号
GET /api/v1/users      # 旧版本
GET /api/v2/users      # 新版本（不兼容变更）
```

### 6.2 版本实现

```typescript
// 按版本组织路由
// routes/v1/users.ts
import express from 'express';
const router = express.Router();

router.get('/users', getUsersV1);
router.post('/users', createUserV1);

export default router;

// routes/v2/users.ts
import express from 'express';
const router = express.Router();

router.get('/users', getUsersV2); // 新实现
router.post('/users', createUserV2);

export default router;

// app.ts
import v1Routes from './routes/v1';
import v2Routes from './routes/v2';

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

---

## 7. 分页与过滤

### 7.1 分页

```typescript
// ✅ 基于偏移量的分页
GET /api/users?page=2&limit=20

// 响应
{
	"data": [ /* users */ ],
	"pagination": {
		"page": 2,
		"limit": 20,
		"total": 100,      // 总记录数
		"totalPages": 5    // 总页数
	}
}

// ✅ 基于游标的分页（推荐用于大数据集）
GET /api/users?cursor=user-123&limit=20

// 响应
{
	"data": [ /* users */ ],
	"pagination": {
		"nextCursor": "user-145",
		"prevCursor": "user-101",
		"hasMore": true
	}
}

// 实现
export async function getUsers(req: Request, res: Response) {
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 20;
	const skip = (page - 1) * limit;
	
	const [users, total] = await Promise.all([
		db.users.findMany({
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		}),
		db.users.count(),
	]);
	
	res.json({
		data: users,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	});
}
```

### 7.2 过滤与搜索

```typescript
// ✅ 过滤
GET /api/users?role=admin&status=active

// 实现
export async function getUsers(req: Request, res: Response) {
	const { role, status } = req.query;
	
	const where: any = {};
	if (role) where.role = role;
	if (status) where.status = status;
	
	const users = await db.users.findMany({ where });
	
	res.json({ data: users });
}

// ✅ 搜索
GET /api/users?q=john

// 实现
export async function searchUsers(req: Request, res: Response) {
	const query = req.query.q as string;
	
	const users = await db.users.findMany({
		where: {
			OR: [
				{ name: { contains: query, mode: 'insensitive' } },
				{ email: { contains: query, mode: 'insensitive' } },
			],
		},
	});
	
	res.json({ data: users });
}
```

### 7.3 排序

```typescript
// ✅ 排序
GET /api/users?sort=created_at&order=desc

// 实现
export async function getUsers(req: Request, res: Response) {
	const sortField = (req.query.sort as string) || 'createdAt';
	const sortOrder = (req.query.order as 'asc' | 'desc') || 'desc';
	
	const users = await db.users.findMany({
		orderBy: { [sortField]: sortOrder },
	});
	
	res.json({ data: users });
}
```

---

## API 设计检查清单

### URL 设计
- [ ] 使用名词而非动词
- [ ] 使用复数形式
- [ ] URL 小写，使用连字符
- [ ] 嵌套资源不超过2层

### HTTP 方法
- [ ] GET 用于读取
- [ ] POST 用于创建
- [ ] PUT/PATCH 用于更新
- [ ] DELETE 用于删除
- [ ] 幂等性正确实现

### 响应
- [ ] 返回正确的 HTTP 状态码
- [ ] JSON 格式一致
- [ ] 包含必要的元数据
- [ ] 错误响应格式统一

### 其他
- [ ] API 有版本控制
- [ ] 支持分页
- [ ] 支持过滤和搜索
- [ ] 有 API 文档

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整 API 设计规范 |
