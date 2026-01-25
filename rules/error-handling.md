# 错误处理规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的错误处理规范，遵循 **Explicit Error Handling** 原则。

---

## 目录

1. [核心原则](#1-核心原则)
2. [错误类型](#2-错误类型)
3. [错误处理模式](#3-错误处理模式)
4. [日志规范](#4-日志规范)
5. [用户反馈](#5-用户反馈)
6. [调试支持](#6-调试支持)

---

## 1. 核心原则

### 1.1 Explicit Error Handling

**所有可能的错误都必须显式处理，不允许静默失败。**

### 1.2 错误处理原则

1. **预期错误**：使用返回值或特定异常（如 `ValidationError`）
2. **意外错误**：让其抛出，由全局处理器捕获
3. **永远不要静默失败**：至少要记录日志
4. **提供有意义的错误消息**：帮助定位问题
5. **区分开发与生产环境**：开发环境显示详细信息，生产环境保护敏感数据

---

## 2. 错误类型

### 2.1 自定义错误类

```typescript
/**
 * 基础错误类
 */
export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code: string = 'INTERNAL_ERROR',
		public isOperational: boolean = true
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * 验证错误 (400)
 */
export class ValidationError extends AppError {
	constructor(message: string, public details?: any) {
		super(message, 400, 'VALIDATION_ERROR');
	}
}

/**
 * 未授权错误 (401)
 */
export class UnauthorizedError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401, 'UNAUTHORIZED');
	}
}

/**
 * 禁止访问错误 (403)
 */
export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(message, 403, 'FORBIDDEN');
	}
}

/**
 * 未找到错误 (404)
 */
export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(`${resource} not found`, 404, 'NOT_FOUND');
	}
}

/**
 * 冲突错误 (409)
 */
export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409, 'CONFLICT');
	}
}

/**
 * 外部服务错误 (502)
 */
export class ExternalServiceError extends AppError {
	constructor(service: string, originalError?: Error) {
		super(
			`External service error: ${service}`,
			502,
			'EXTERNAL_SERVICE_ERROR',
			false // 不是操作性错误，可能需要重试
		);
		this.cause = originalError;
	}
}
```

### 2.2 错误使用示例

```typescript
// ✅ 正确：抛出具体的错误类型
export async function getUserById(id: string): Promise<User> {
	// 验证输入
	if (!id || !isValidUserId(id)) {
		throw new ValidationError('Invalid user ID format');
	}
	
	// 查询用户
	const user = await db.users.findById(id);
	
	if (!user) {
		throw new NotFoundError('User');
	}
	
	return user;
}

// ❌ 错误：泛泛的错误
export async function getUserById(id: string): Promise<User> {
	const user = await db.users.findById(id);
	
	if (!user) {
		throw new Error('Error'); // 信息不足！
	}
	
	return user;
}
```

---

## 3. 错误处理模式

### 3.1 Try-Catch 使用

```typescript
// ✅ 正确：明确处理预期错误
export async function createBooking(data: BookingData): Promise<Booking> {
	try {
		// 验证数据
		const validated = BookingSchema.parse(data);
		
		// 检查可用性
		const isAvailable = await checkAvailability(validated);
		if (!isAvailable) {
			throw new ConflictError('Time slot not available');
		}
		
		// 创建预订
		return await db.bookings.create(validated);
		
	} catch (error) {
		// 重新抛出已知错误
		if (error instanceof AppError) {
			throw error;
		}
		
		// 包装未知错误
		logger.error('Failed to create booking', { error, data });
		throw new AppError('Failed to create booking');
	}
}

// ❌ 错误：捕获但不处理
export async function createBooking(data: BookingData): Promise<Booking> {
	try {
		return await db.bookings.create(data);
	} catch (error) {
		console.log('Error:', error); // 只打印，然后呢？
		// 没有抛出错误，调用者无法知道失败了！
	}
}
```

### 3.2 Promise 错误处理

```typescript
// ✅ 正确：使用 async/await
export async function fetchUserData(userId: string): Promise<User> {
	try {
		const response = await fetch(`/api/users/${userId}`);
		
		if (!response.ok) {
			throw new ExternalServiceError('User API');
		}
		
		return await response.json();
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}
		throw new ExternalServiceError('User API', error as Error);
	}
}

// ❌ 错误：未处理 rejection
export function fetchUserData(userId: string): Promise<User> {
	return fetch(`/api/users/${userId}`)
		.then(res => res.json()); // 如果 fetch 失败怎么办？
}
```

### 3.3 API 全局错误处理器

```typescript
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors';
import { logger } from '@/lib/logger';

/**
 * 全局错误处理中间件
 */
export function errorHandler(
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// 记录错误
	logger.error('Request error', {
		error: error.message,
		stack: error.stack,
		path: req.path,
		method: req.method,
		userId: req.user?.userId,
	});
	
	// 处理已知错误
	if (error instanceof AppError) {
		res.status(error.statusCode).json({
			error: error.message,
			code: error.code,
			...(error instanceof ValidationError && { details: error.details }),
		});
		return;
	}
	
	// 处理未知错误
	res.status(500).json({
		error: process.env.NODE_ENV === 'production'
			? 'Internal server error'
			: error.message,
		...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
	});
}

// 在 Express 应用中使用（必须在所有路由之后）
app.use(errorHandler);
```

### 3.4 React 错误边界

```typescript
import React, { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

/**
 * 错误边界组件
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}
	
	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}
	
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		// 记录错误
		logger.error('React error boundary caught error', {
			error: error.message,
			stack: error.stack,
			componentStack: errorInfo.componentStack,
		});
	}
	
	render(): ReactNode {
		if (this.state.hasError) {
			return this.props.fallback || (
				<div className="error-container">
					<h2>Something went wrong</h2>
					<p>We've been notified and are working on a fix.</p>
					<button onClick={() => window.location.reload()}>
						Reload Page
					</button>
				</div>
			);
		}
		
		return this.props.children;
	}
}

// 使用示例
<ErrorBoundary>
	<App />
</ErrorBoundary>
```

---

## 4. 日志规范

### 4.1 日志级别

| 级别 | 使用场景 | 示例 |
|------|---------|------|
| **error** | 错误、异常 | `logger.error('Failed to create user', { error })` |
| **warn** | 警告、潜在问题 | `logger.warn('API rate limit approaching')` |
| **info** | 重要操作 | `logger.info('User logged in', { userId })` |
| **debug** | 调试信息 | `logger.debug('Cache hit', { key })` |

### 4.2 日志结构

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' }),
	],
});

// 在生产环境中不记录敏感信息
if (process.env.NODE_ENV === 'production') {
	logger.format = winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	);
}
```

### 4.3 日志最佳实践

```typescript
// ✅ 好的日志
logger.info('User created', {
	userId: user.id,
	email: user.email,
	role: user.role,
	timestamp: Date.now(),
});

logger.error('Failed to send email', {
	error: error.message,
	stack: error.stack,
	userId: user.id,
	emailType: 'welcome',
	attempt: retryCount,
});

// ❌ 不好的日志
logger.info('User created'); // 缺少上下文
logger.error(error);         // 没有额外信息
console.log('Something');    // 使用 console.log
```

---

## 5. 用户反馈

### 5.1 错误消息指南

| 类型 | 做法 | 不要 |
|------|------|------|
| **清晰** | "Email address is invalid" | "Error: 400" |
| **有帮助** | "Password must be at least 8 characters" | "Invalid input" |
| **友好** | "We couldn't find that user" | "NULL POINTER EXCEPTION" |
| **可操作** | "Please try again or contact support" | "Error occurred" |

### 5.2 前端错误显示

```typescript
// 错误提示组件
interface ErrorMessageProps {
	error: Error | null;
	onDismiss?: () => void;
}

export function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
	if (!error) return null;
	
	// 根据错误类型显示不同的消息
	const getUserMessage = (error: Error): string => {
		if (error instanceof ValidationError) {
			return error.message;
		}
		
		if (error instanceof UnauthorizedError) {
			return 'Please log in to continue';
		}
		
		if (error instanceof ForbiddenError) {
			return "You don't have permission to perform this action";
		}
		
		if (error instanceof NotFoundError) {
			return 'The requested resource was not found';
		}
		
		// 默认消息
		return 'Something went wrong. Please try again.';
	};
	
	return (
		<div className="error-message" role="alert">
			<p>{getUserMessage(error)}</p>
			{onDismiss && (
				<button onClick={onDismiss} aria-label="Dismiss error">
					×
				</button>
			)}
		</div>
	);
}
```

### 5.3 表单错误显示

```typescript
interface FormFieldProps {
	label: string;
	error?: string;
	children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
	return (
		<div className="form-field">
			<label>{label}</label>
			{children}
			{error && (
				<span className="field-error" role="alert">
					{error}
				</span>
			)}
		</div>
	);
}

// 使用示例
<FormField label="Email" error={errors.email}>
	<input type="email" name="email" />
</FormField>
```

---

## 6. 调试支持

### 6.1 错误上下文

```typescript
/**
 * 为错误添加上下文信息
 */
export function withContext<T extends any[], R>(
	fn: (...args: T) => Promise<R>,
	context: Record<string, any>
): (...args: T) => Promise<R> {
	return async (...args: T): Promise<R> => {
		try {
			return await fn(...args);
		} catch (error) {
			if (error instanceof Error) {
				// 添加上下文到错误
				Object.assign(error, { context });
			}
			throw error;
		}
	};
}

// 使用示例
const createUserWithContext = withContext(
	createUser,
	{ operation: 'user_creation', service: 'user-service' }
);
```

### 6.2 错误追踪

```typescript
// 使用 Sentry 等服务追踪错误
import * as Sentry from '@sentry/node';

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,
	tracesSampleRate: 1.0,
});

// 在错误处理器中上报
export function errorHandler(
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// 上报到 Sentry
	if (process.env.NODE_ENV === 'production') {
		Sentry.captureException(error, {
			user: {
				id: req.user?.userId,
				email: req.user?.email,
			},
			tags: {
				path: req.path,
				method: req.method,
			},
		});
	}
	
	// ... 其余错误处理逻辑
}
```

---

## 错误处理检查清单

### 代码实现
- [ ] 所有错误都被显式处理
- [ ] 使用自定义错误类
- [ ] 提供有意义的错误消息
- [ ] 记录错误日志
- [ ] 不暴露敏感信息

### API 端点
- [ ] 返回正确的 HTTP 状态码
- [ ] 错误响应格式一致
- [ ] 包含错误代码
- [ ] 生产环境不暴露堆栈跟踪

### 用户体验
- [ ] 错误消息清晰易懂
- [ ] 提供可操作的建议
- [ ] 友好的语气
- [ ] 有错误边界保护

### 调试支持
- [ ] 完整的错误上下文
- [ ] 集成错误追踪服务
- [ ] 日志结构化
- [ ] 便于问题排查

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整错误处理规范 |
