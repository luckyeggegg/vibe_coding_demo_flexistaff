# 安全规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的安全规范，遵循 **"Secure by Default"** 原则。

---

## 目录

1. [敏感信息管理](#1-敏感信息管理)
2. [认证与授权](#2-认证与授权)
3. [输入验证](#3-输入验证)
4. [输出转义](#4-输出转义)
5. [安全头配置](#5-安全头配置)
6. [依赖安全](#6-依赖安全)

---

## 1. 敏感信息管理

### 1.1 核心原则：No Hard-Coded Secrets

**绝对禁止将敏感信息硬编码在代码中。**

### 1.2 什么是敏感信息？

- API 密钥、令牌
- 数据库连接字符串
- 第三方服务凭证
- 加密密钥、盐值
- 用户密码（即使是哈希值）
- 私钥、证书

### 1.3 环境变量管理

```typescript
// ❌ 绝对禁止：硬编码敏感信息
const API_KEY = 'sk_live_abc123xyz789';
const DB_PASSWORD = 'MyS3cr3tP@ssw0rd';

// ✅ 正确：使用环境变量
const API_KEY = process.env.STRIPE_API_KEY;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

// ✅ 更好：使用类型安全的环境变量配置
import { z } from 'zod';

const envSchema = z.object({
	STRIPE_API_KEY: z.string().min(1),
	DATABASE_PASSWORD: z.string().min(8),
	JWT_SECRET: z.string().min(32),
	NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

### 1.4 .env 文件管理

#### 文件结构
```
.env.local          # 本地开发（不提交到 Git）
.env.example        # 示例模板（可提交）
.env.production     # 生产环境（服务器管理，不提交）
```

#### .env.example 示例
```bash
# API Keys
STRIPE_API_KEY=sk_test_xxxxxxxxxxxxxxxxxx
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379
```

#### .gitignore 配置
```gitignore
# 敏感文件
.env
.env.local
.env.*.local

# 保留示例文件
!.env.example
```

### 1.5 敏感日志过滤

```typescript
// ❌ 禁止：记录敏感信息
logger.info('User login', { email, password }); // 密码泄露！
logger.debug('API Response', response);         // 可能包含 token

// ✅ 正确：过滤敏感字段
function sanitizeForLogging(data: any): any {
	const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
	
	const sanitized = { ...data };
	for (const field of sensitiveFields) {
		if (field in sanitized) {
			sanitized[field] = '[REDACTED]';
		}
	}
	return sanitized;
}

logger.info('User login', sanitizeForLogging({ email, password }));
// 输出: User login { email: 'user@example.com', password: '[REDACTED]' }
```

---

## 2. 认证与授权

### 2.1 核心原则：Secure by Default

**默认拒绝访问，显式授予权限。**

### 2.2 认证（Authentication）

#### JWT Token 管理
```typescript
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

interface TokenPayload {
	userId: string;
	role: string;
	iat: number;
	exp: number;
}

/**
 * 生成访问令牌
 */
export function generateAccessToken(userId: string, role: string): string {
	return jwt.sign(
		{ userId, role },
		env.JWT_SECRET,
		{ expiresIn: '15m' } // 短期有效
	);
}

/**
 * 生成刷新令牌
 */
export function generateRefreshToken(userId: string): string {
	return jwt.sign(
		{ userId },
		env.JWT_REFRESH_SECRET,
		{ expiresIn: '7d' } // 长期有效
	);
}

/**
 * 验证令牌
 * @throws {JsonWebTokenError} 令牌无效时抛出
 */
export function verifyToken(token: string): TokenPayload {
	try {
		return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
	} catch (error) {
		throw new UnauthorizedError('Invalid or expired token');
	}
}
```

#### 密码处理
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // 推荐 12 轮

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
	// 验证密码强度
	if (password.length < 8) {
		throw new ValidationError('Password must be at least 8 characters');
	}
	
	return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 验证密码
 */
export async function verifyPassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}

// ❌ 绝对禁止：明文存储密码
class User {
	password: string; // 危险！
}

// ✅ 正确：只存储哈希值
class User {
	passwordHash: string;
}
```

### 2.3 授权（Authorization）

#### 中间件实现
```typescript
import type { Request, Response, NextFunction } from 'express';

/**
 * 认证中间件：验证用户身份
 */
export function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const token = req.headers.authorization?.replace('Bearer ', '');
	
	if (!token) {
		res.status(401).json({ error: 'Unauthorized: No token provided' });
		return;
	}
	
	try {
		const payload = verifyToken(token);
		req.user = payload; // 附加用户信息到请求
		next();
	} catch (error) {
		res.status(401).json({ error: 'Unauthorized: Invalid token' });
	}
}

/**
 * 授权中间件：检查用户权限
 */
export function authorize(...allowedRoles: string[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const user = req.user;
		
		if (!user) {
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}
		
		if (!allowedRoles.includes(user.role)) {
			res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
			return;
		}
		
		next();
	};
}

// 使用示例
app.delete('/api/users/:id',
	authenticate,              // 必须登录
	authorize('admin'),        // 只有 admin 可删除
	deleteUserHandler
);
```

#### 资源级权限控制
```typescript
/**
 * 检查用户是否可以访问特定资源
 */
export async function canAccessBooking(
	userId: string,
	bookingId: string
): Promise<boolean> {
	const booking = await db.bookings.findById(bookingId);
	
	if (!booking) {
		return false;
	}
	
	const user = await db.users.findById(userId);
	
	// Admin 可访问所有预订
	if (user.role === 'admin') {
		return true;
	}
	
	// Manager 可访问本门店的预订
	if (user.role === 'manager') {
		return booking.storeId === user.storeId;
	}
	
	// 普通用户只能访问自己的预订
	return booking.userId === userId;
}

// 使用示例
app.get('/api/bookings/:id', authenticate, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.userId;
	
	if (!await canAccessBooking(userId, id)) {
		return res.status(403).json({ error: 'Forbidden' });
	}
	
	const booking = await getBooking(id);
	res.json(booking);
});
```

---

## 3. 输入验证

### 3.1 核心原则

**永远不要信任用户输入，所有输入必须验证。**

### 3.2 使用 Zod 进行验证

```typescript
import { z } from 'zod';

// 定义验证 schema
const CreateUserSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	name: z.string().min(2).max(50),
	role: z.enum(['admin', 'manager', 'staff']),
	phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// 在 API 路由中使用
export async function createUserHandler(req: Request, res: Response) {
	try {
		// 验证输入
		const validatedData = CreateUserSchema.parse(req.body);
		
		// 处理已验证的数据
		const user = await createUser(validatedData);
		
		res.status(201).json(user);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				error: 'Validation failed',
				details: error.errors,
			});
		}
		
		res.status(500).json({ error: 'Internal server error' });
	}
}
```

### 3.3 常见验证规则

```typescript
// 邮箱验证
const emailSchema = z.string().email();

// 密码强度验证
const passwordSchema = z.string()
	.min(8, 'At least 8 characters')
	.regex(/[A-Z]/, 'At least one uppercase letter')
	.regex(/[a-z]/, 'At least one lowercase letter')
	.regex(/[0-9]/, 'At least one number');

// URL 验证
const urlSchema = z.string().url();

// 日期验证
const dateSchema = z.coerce.date().refine(
	(date) => date > new Date(),
	'Date must be in the future'
);

// 枚举验证
const roleSchema = z.enum(['admin', 'manager', 'staff']);

// 数字范围验证
const ageSchema = z.number().int().min(18).max(120);

// 数组验证
const tagsSchema = z.array(z.string()).min(1).max(5);

// 嵌套对象验证
const addressSchema = z.object({
	street: z.string(),
	city: z.string(),
	zipCode: z.string().regex(/^\d{5}$/),
});
```

### 3.4 SQL 注入防护

```typescript
// ❌ 危险：SQL 注入风险
const userId = req.params.id;
const query = `SELECT * FROM users WHERE id = ${userId}`; // 危险！
db.query(query);

// ✅ 正确：使用参数化查询
const userId = req.params.id;
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);

// ✅ 更好：使用 ORM
const user = await db.users.findById(userId);
```

### 3.5 XSS 防护

```typescript
// ❌ 危险：可能导致 XSS
function displayUserComment(comment: string) {
	document.innerHTML = comment; // 危险！
}

// ✅ 正确：使用文本内容
function displayUserComment(comment: string) {
	document.textContent = comment;
}

// ✅ React 自动转义
function CommentDisplay({ comment }: { comment: string }) {
	return <div>{comment}</div>; // 自动转义
}

// ⚠️ 谨慎使用 dangerouslySetInnerHTML
function RichTextDisplay({ html }: { html: string }) {
	// 必须先消毒 HTML
	const sanitizedHtml = DOMPurify.sanitize(html);
	return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
```

---

## 4. 输出转义

### 4.1 HTML 转义

```typescript
/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;',
	};
	
	return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

// 使用示例
const userInput = '<script>alert("XSS")</script>';
const safeOutput = escapeHtml(userInput);
// 输出: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### 4.2 JSON 响应安全

```typescript
// ✅ 正确：Express 自动转义
app.get('/api/user', (req, res) => {
	res.json({
		name: userInput, // 自动转义
		email: user.email,
	});
});

// ❌ 危险：手动构造 JSON
app.get('/api/user', (req, res) => {
	const json = `{"name": "${userInput}"}`; // XSS 风险！
	res.send(json);
});
```

---

## 5. 安全头配置

### 5.1 推荐的安全头

```typescript
import helmet from 'helmet';
import express from 'express';

const app = express();

// 使用 Helmet 设置安全头
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", 'data:', 'https:'],
		},
	},
	hsts: {
		maxAge: 31536000,
		includeSubDomains: true,
		preload: true,
	},
}));

// CORS 配置
import cors from 'cors';

const allowedOrigins = [
	'https://app.flexistaff.com',
	'https://admin.flexistaff.com',
];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
}));
```

---

## 6. 依赖安全

### 6.1 定期审计

```bash
# 检查已知漏洞
npm audit

# 自动修复（谨慎使用）
npm audit fix

# 使用 Snyk 进行深度扫描
npx snyk test
```

### 6.2 依赖更新策略

```json
// package.json
{
	"dependencies": {
		"express": "^4.18.0",    // ✅ 允许小版本更新
		"react": "18.2.0"        // ⚠️ 锁定版本（关键依赖）
	}
}
```

---

## 安全检查清单

### 敏感信息
- [ ] 无硬编码的密钥/密码
- [ ] 使用环境变量管理配置
- [ ] .env 文件已加入 .gitignore
- [ ] 日志中过滤敏感字段

### 认证授权
- [ ] 使用强密码哈希（bcrypt）
- [ ] JWT 有合理的过期时间
- [ ] API 端点有认证保护
- [ ] 实现了权限检查

### 输入验证
- [ ] 所有输入都经过验证
- [ ] 使用参数化查询（防 SQL 注入）
- [ ] 文件上传有类型/大小限制

### 输出安全
- [ ] HTML 输出已转义
- [ ] 谨慎使用 dangerouslySetInnerHTML
- [ ] JSON 响应安全

### 配置
- [ ] 使用 Helmet 设置安全头
- [ ] CORS 正确配置
- [ ] HTTPS 已启用（生产环境）

### 依赖
- [ ] 定期运行 npm audit
- [ ] 及时更新依赖
- [ ] 使用 Snyk 扫描

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整安全规范 |
