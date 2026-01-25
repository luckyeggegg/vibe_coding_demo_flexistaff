# 测试规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的测试规范，遵循 **Test-Driven Development (TDD)** 原则。

---

## 目录

1. [测试驱动开发](#1-测试驱动开发)
2. [单元测试](#2-单元测试)
3. [集成测试](#3-集成测试)
4. [E2E 测试](#4-e2e-测试)
5. [测试覆盖率](#5-测试覆盖率)
6. [Mock 与 Stub](#6-mock-与-stub)

---

## 1. 测试驱动开发

### 1.1 核心原则：Test-Driven

**先写测试，再写实现。**

### 1.2 TDD 流程（Red-Green-Refactor）

```
1. 🔴 RED: 编写失败的测试
   ↓
2. 🟢 GREEN: 编写最简实现使测试通过
   ↓
3. 🔵 REFACTOR: 重构代码，保持测试通过
   ↓
   重复
```

### 1.3 TDD 示例

```typescript
// 步骤 1: 🔴 编写测试（先失败）
describe('calculateDiscount', () => {
	it('should return 0 discount for non-VIP users', () => {
		const user = { isVip: false };
		const order = { total: 1000 };
		
		expect(calculateDiscount(user, order)).toBe(0);
	});
	
	it('should return 10% discount for VIP users', () => {
		const user = { isVip: true };
		const order = { total: 1000 };
		
		expect(calculateDiscount(user, order)).toBe(100);
	});
});

// 步骤 2: 🟢 编写实现
function calculateDiscount(user: User, order: Order): number {
	if (user.isVip) {
		return order.total * 0.1;
	}
	return 0;
}

// 步骤 3: 🔵 重构（如果需要）
function calculateDiscount(user: User, order: Order): number {
	const VIP_DISCOUNT_RATE = 0.1;
	return user.isVip ? order.total * VIP_DISCOUNT_RATE : 0;
}
```

### 1.4 何时使用 TDD

| 场景 | 是否使用 TDD |
|------|-------------|
| 核心业务逻辑 | ✅ 强烈推荐 |
| 复杂算法 | ✅ 强烈推荐 |
| Bug 修复 | ✅ 推荐（先写复现测试） |
| 工具函数 | ✅ 推荐 |
| UI 组件 | ⚠️ 视情况而定 |
| 原型/探索性代码 | ❌ 不推荐 |

---

## 2. 单元测试

### 2.1 核心原则

**测试单个函数/类的行为，隔离外部依赖。**

### 2.2 测试结构（AAA 模式）

```typescript
describe('UserService', () => {
	describe('createUser', () => {
		it('should create a user with valid data', async () => {
			// Arrange（准备）
			const userData = {
				email: 'test@example.com',
				password: 'SecurePass123',
				name: 'Test User',
			};
			
			// Act（执行）
			const result = await userService.createUser(userData);
			
			// Assert（断言）
			expect(result).toMatchObject({
				email: 'test@example.com',
				name: 'Test User',
			});
			expect(result.id).toBeDefined();
			expect(result.passwordHash).not.toBe(userData.password);
		});
	});
});
```

### 2.3 命名规范

```typescript
// ✅ 好的测试命名 - 清晰描述行为
describe('calculateTotal', () => {
	it('should return 0 for empty cart', () => { /* ... */ });
	it('should sum all item prices', () => { /* ... */ });
	it('should apply discount for VIP users', () => { /* ... */ });
	it('should throw error for negative prices', () => { /* ... */ });
});

// ❌ 不好的命名
describe('calculateTotal', () => {
	it('test1', () => { /* ... */ });              // 无意义
	it('works', () => { /* ... */ });              // 不清晰
	it('should calculate', () => { /* ... */ });   // 不具体
});
```

### 2.4 边界测试

```typescript
describe('validateAge', () => {
	// 正常情况
	it('should accept valid age', () => {
		expect(validateAge(25)).toBe(true);
	});
	
	// 边界值
	it('should accept minimum age (18)', () => {
		expect(validateAge(18)).toBe(true);
	});
	
	it('should reject age below minimum (17)', () => {
		expect(validateAge(17)).toBe(false);
	});
	
	it('should accept maximum age (120)', () => {
		expect(validateAge(120)).toBe(true);
	});
	
	it('should reject age above maximum (121)', () => {
		expect(validateAge(121)).toBe(false);
	});
	
	// 异常情况
	it('should reject negative age', () => {
		expect(validateAge(-1)).toBe(false);
	});
	
	it('should reject zero age', () => {
		expect(validateAge(0)).toBe(false);
	});
	
	it('should reject non-integer age', () => {
		expect(validateAge(25.5)).toBe(false);
	});
});
```

### 2.5 测试异常处理

```typescript
describe('getUserById', () => {
	it('should throw ValidationError for invalid ID', async () => {
		await expect(getUserById('invalid-id'))
			.rejects
			.toThrow(ValidationError);
	});
	
	it('should throw NotFoundError for non-existent user', async () => {
		await expect(getUserById('non-existent-id'))
			.rejects
			.toThrow(NotFoundError);
	});
	
	it('should include error message', async () => {
		await expect(getUserById('invalid-id'))
			.rejects
			.toThrow('Invalid user ID format');
	});
});
```

### 2.6 测试异步代码

```typescript
describe('fetchUserData', () => {
	// ✅ 使用 async/await
	it('should fetch user data', async () => {
		const user = await fetchUserData('user-123');
		expect(user.email).toBe('test@example.com');
	});
	
	// ✅ 测试 Promise rejection
	it('should handle fetch errors', async () => {
		await expect(fetchUserData('invalid-id'))
			.rejects
			.toThrow('User not found');
	});
});
```

---

## 3. 集成测试

### 3.1 核心原则

**测试多个模块协同工作，包含真实依赖。**

### 3.2 API 集成测试

```typescript
import request from 'supertest';
import { app } from '@/app';
import { setupTestDb, teardownTestDb } from '@/test-utils/db';

describe('POST /api/users', () => {
	beforeAll(async () => {
		await setupTestDb();
	});
	
	afterAll(async () => {
		await teardownTestDb();
	});
	
	it('should create a new user', async () => {
		const response = await request(app)
			.post('/api/users')
			.send({
				email: 'test@example.com',
				password: 'SecurePass123',
				name: 'Test User',
			})
			.expect(201);
		
		expect(response.body).toMatchObject({
			email: 'test@example.com',
			name: 'Test User',
		});
		expect(response.body.id).toBeDefined();
		expect(response.body.password).toBeUndefined(); // 不应返回密码
	});
	
	it('should return 400 for invalid email', async () => {
		const response = await request(app)
			.post('/api/users')
			.send({
				email: 'invalid-email',
				password: 'SecurePass123',
				name: 'Test User',
			})
			.expect(400);
		
		expect(response.body.error).toBe('Validation failed');
	});
	
	it('should return 409 for duplicate email', async () => {
		// 先创建用户
		await request(app)
			.post('/api/users')
			.send({
				email: 'duplicate@example.com',
				password: 'SecurePass123',
				name: 'User 1',
			});
		
		// 尝试创建重复用户
		const response = await request(app)
			.post('/api/users')
			.send({
				email: 'duplicate@example.com',
				password: 'SecurePass123',
				name: 'User 2',
			})
			.expect(409);
		
		expect(response.body.error).toBe('Email already exists');
	});
});
```

### 3.3 数据库测试

```typescript
import { db } from '@/lib/db';

describe('UserRepository', () => {
	beforeEach(async () => {
		// 每个测试前清空数据库
		await db.users.deleteMany({});
	});
	
	describe('create', () => {
		it('should insert user into database', async () => {
			const userData = {
				email: 'test@example.com',
				passwordHash: 'hashed-password',
				name: 'Test User',
			};
			
			const user = await db.users.create(userData);
			
			// 验证返回值
			expect(user.id).toBeDefined();
			expect(user.email).toBe('test@example.com');
			
			// 验证数据库中的数据
			const found = await db.users.findById(user.id);
			expect(found).toMatchObject(userData);
		});
	});
	
	describe('findByEmail', () => {
		it('should find user by email', async () => {
			await db.users.create({
				email: 'test@example.com',
				passwordHash: 'hashed',
				name: 'Test',
			});
			
			const user = await db.users.findByEmail('test@example.com');
			expect(user).not.toBeNull();
			expect(user!.email).toBe('test@example.com');
		});
		
		it('should return null for non-existent email', async () => {
			const user = await db.users.findByEmail('nonexistent@example.com');
			expect(user).toBeNull();
		});
	});
});
```

---

## 4. E2E 测试

### 4.1 核心原则

**从用户角度测试完整流程。**

### 4.2 Playwright 示例

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
	test('should register a new user successfully', async ({ page }) => {
		// 1. 访问注册页面
		await page.goto('/register');
		
		// 2. 填写表单
		await page.fill('[name="email"]', 'test@example.com');
		await page.fill('[name="password"]', 'SecurePass123');
		await page.fill('[name="confirmPassword"]', 'SecurePass123');
		await page.fill('[name="name"]', 'Test User');
		
		// 3. 提交表单
		await page.click('button[type="submit"]');
		
		// 4. 验证成功
		await expect(page).toHaveURL('/dashboard');
		await expect(page.locator('text=Welcome, Test User')).toBeVisible();
	});
	
	test('should show validation errors for invalid input', async ({ page }) => {
		await page.goto('/register');
		
		// 提交空表单
		await page.click('button[type="submit"]');
		
		// 验证错误消息
		await expect(page.locator('text=Email is required')).toBeVisible();
		await expect(page.locator('text=Password is required')).toBeVisible();
	});
	
	test('should prevent duplicate registration', async ({ page }) => {
		// 先注册一个用户
		await page.goto('/register');
		await page.fill('[name="email"]', 'existing@example.com');
		await page.fill('[name="password"]', 'SecurePass123');
		await page.fill('[name="confirmPassword"]', 'SecurePass123');
		await page.fill('[name="name"]', 'Existing User');
		await page.click('button[type="submit"]');
		
		// 登出
		await page.click('button[aria-label="Logout"]');
		
		// 尝试再次注册相同邮箱
		await page.goto('/register');
		await page.fill('[name="email"]', 'existing@example.com');
		await page.fill('[name="password"]', 'SecurePass123');
		await page.fill('[name="confirmPassword"]', 'SecurePass123');
		await page.fill('[name="name"]', 'Another User');
		await page.click('button[type="submit"]');
		
		// 验证错误消息
		await expect(page.locator('text=Email already exists')).toBeVisible();
	});
});
```

---

## 5. 测试覆盖率

### 5.1 覆盖率目标

| 代码类型 | 最低覆盖率 | 推荐覆盖率 |
|---------|-----------|-----------|
| 业务逻辑 | 80% | 90%+ |
| 工具函数 | 90% | 100% |
| API 端点 | 70% | 85% |
| UI 组件 | 60% | 75% |

### 5.2 查看覆盖率

```bash
# 运行测试并生成覆盖率报告
npm run test:coverage

# 在浏览器中查看
open coverage/lcov-report/index.html
```

### 5.3 覆盖率配置

```javascript
// jest.config.js
module.exports = {
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.test.{ts,tsx}',
		'!src/**/index.ts',
	],
	coverageThresholds: {
		global: {
			statements: 80,
			branches: 75,
			functions: 80,
			lines: 80,
		},
		'./src/utils/': {
			statements: 90,
			branches: 85,
			functions: 90,
			lines: 90,
		},
	},
};
```

---

## 6. Mock 与 Stub

### 6.1 何时使用 Mock

| 场景 | 是否 Mock |
|------|-----------|
| 外部 API 调用 | ✅ Mock |
| 数据库操作（单元测试） | ✅ Mock |
| 第三方服务 | ✅ Mock |
| 时间相关函数 | ✅ Mock |
| 数据库操作（集成测试） | ❌ 使用真实数据库 |

### 6.2 Mock 外部依赖

```typescript
import { vi } from 'vitest';
import { sendEmail } from '@/lib/email';
import { createUser } from '@/services/user-service';

// Mock 邮件服务
vi.mock('@/lib/email', () => ({
	sendEmail: vi.fn(),
}));

describe('createUser', () => {
	it('should send welcome email', async () => {
		const userData = {
			email: 'test@example.com',
			password: 'SecurePass123',
			name: 'Test User',
		};
		
		await createUser(userData);
		
		// 验证邮件被发送
		expect(sendEmail).toHaveBeenCalledWith({
			to: 'test@example.com',
			subject: 'Welcome to FlexiStaff',
			body: expect.stringContaining('Test User'),
		});
	});
});
```

### 6.3 Mock 时间

```typescript
import { vi } from 'vitest';

describe('isExpired', () => {
	beforeEach(() => {
		// 固定时间为 2026-01-20 00:00:00
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-01-20T00:00:00Z'));
	});
	
	afterEach(() => {
		vi.useRealTimers();
	});
	
	it('should return true for expired token', () => {
		const token = {
			expiresAt: new Date('2026-01-19T23:59:59Z'),
		};
		
		expect(isExpired(token)).toBe(true);
	});
	
	it('should return false for valid token', () => {
		const token = {
			expiresAt: new Date('2026-01-20T00:00:01Z'),
		};
		
		expect(isExpired(token)).toBe(false);
	});
});
```

### 6.4 Spy 函数调用

```typescript
describe('UserService', () => {
	it('should log user creation', async () => {
		const loggerSpy = vi.spyOn(logger, 'info');
		
		await userService.createUser({
			email: 'test@example.com',
			password: 'SecurePass123',
			name: 'Test User',
		});
		
		expect(loggerSpy).toHaveBeenCalledWith(
			'User created',
			expect.objectContaining({ email: 'test@example.com' })
		);
		
		loggerSpy.mockRestore();
	});
});
```

---

## 测试检查清单

### 编写测试
- [ ] 遵循 AAA 模式（Arrange-Act-Assert）
- [ ] 测试命名清晰描述行为
- [ ] 包含边界测试
- [ ] 包含异常情况测试
- [ ] 每个测试独立运行

### 测试质量
- [ ] 测试通过
- [ ] 覆盖率达标
- [ ] 无跳过的测试（除非有明确原因）
- [ ] Mock 使用合理

### TDD 流程
- [ ] 先写测试（Red）
- [ ] 最简实现（Green）
- [ ] 重构优化（Refactor）

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整测试规范 |
