# 核心编码标准

> 版本: v2.1
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的核心编码标准，包括命名、类型、注释、代码风格等规范。

---

## 目录

1. [命名规范](#1-命名规范)
2. [TypeScript 类型规范](#2-typescript-类型规范)
3. [注释规范](#3-注释规范)
4. [代码风格](#4-代码风格)
5. [为阅读者编码](#5-为阅读者编码)

---

## 1. 命名规范

### 1.1 核心原则：Clear Naming

**命名应该清晰表达意图，让阅读者无需查看实现就能理解用途。**

### 1.2 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| **变量** | camelCase | `userName`, `isActive`, `totalCount` |
| **常量** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| **函数** | camelCase (动词开头) | `getUserById`, `calculateTotal`, `validateEmail` |
| **类** | PascalCase | `UserService`, `BookingManager` |
| **接口** | PascalCase | `User`, `BookingData`, `ApiResponse` |
| **类型别名** | PascalCase | `UserId`, `BookingStatus` |
| **枚举** | PascalCase | `UserRole`, `BookingStatus` |
| **枚举值** | UPPER_SNAKE_CASE | `UserRole.ADMIN`, `Status.IN_PROGRESS` |
| **私有属性** | camelCase + # | `#privateField`, `#internalState` |
| **组件** | PascalCase | `UserCard`, `BookingForm` |
| **文件名** | kebab-case | `user-service.ts`, `booking-form.tsx` |

### 1.3 布尔值命名

布尔变量/函数应使用 `is`、`has`、`can`、`should` 等前缀：

```typescript
// ✅ 好的命名
const isActive: boolean = true;
const hasPermission: boolean = user.role === 'admin';
const canEdit: boolean = checkPermission(user);
const shouldRender: boolean = isVisible && hasData;

// ❌ 不好的命名
const active: boolean = true;        // 不清晰
const permission: boolean = true;    // 含义模糊
const edit: boolean = false;         // 难以理解
```

### 1.4 函数命名

#### 动词约定

| 动词 | 用途 | 示例 |
|------|------|------|
| **get** | 获取数据（同步） | `getUser()`, `getUserName()` |
| **fetch** | 获取数据（异步） | `fetchUserData()`, `fetchBookings()` |
| **set** | 设置值 | `setUserName()`, `setActiveTab()` |
| **update** | 更新现有数据 | `updateUser()`, `updateBookingStatus()` |
| **create** | 创建新数据 | `createUser()`, `createBooking()` |
| **delete** | 删除数据 | `deleteUser()`, `deleteBooking()` |
| **remove** | 从集合移除 | `removeItem()`, `removeFromCart()` |
| **add** | 添加到集合 | `addItem()`, `addToCart()` |
| **validate** | 验证数据 | `validateEmail()`, `validateForm()` |
| **check** | 检查条件 | `checkPermission()`, `checkAvailability()` |
| **calculate** | 计算结果 | `calculateTotal()`, `calculateDiscount()` |
| **format** | 格式化数据 | `formatDate()`, `formatCurrency()` |
| **parse** | 解析数据 | `parseJson()`, `parseDate()` |
| **handle** | 处理事件 | `handleClick()`, `handleSubmit()` |

#### 示例

```typescript
// ✅ 清晰的函数命名
async function fetchUserById(id: string): Promise<User> {
	const response = await api.get(`/users/${id}`);
	return response.data;
}

function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

function calculateBookingTotal(booking: Booking): number {
	return booking.hours * booking.hourlyRate;
}

// ❌ 不清晰的命名
async function user(id: string) { /* ... */ }        // 不是动词
function check(email: string) { /* ... */ }          // 太泛化
function doStuff(data: any) { /* ... */ }           // 完全无意义
```

### 1.5 类与接口命名

```typescript
// ✅ 好的类命名 - 名词，表达职责
class UserService {
	async createUser(data: UserData): Promise<User> { /* ... */ }
}

class BookingValidator {
	validate(booking: Booking): ValidationResult { /* ... */ }
}

// ✅ 好的接口命名 - 清晰表达数据结构
interface User {
	id: string;
	email: string;
	role: UserRole;
}

interface ApiResponse<T> {
	data: T;
	status: number;
	message?: string;
}

// ❌ 不好的命名
class Manager { /* ... */ }          // 太泛化
interface IUser { /* ... */ }        // 不要使用 I 前缀
interface UserInterface { /* ... */ } // 不要使用 Interface 后缀
```

### 1.6 避免的命名

| ❌ 避免 | ✅ 推荐 | 原因 |
|---------|---------|------|
| `data`, `info` | `userData`, `bookingInfo` | 太泛化 |
| `temp`, `tmp` | 有意义的名称 | 临时变量也应有清晰名称 |
| `x`, `y`, `z` | `userId`, `count` | 单字母变量（除循环外） |
| `handleStuff()` | `handleUserSubmit()` | 含义模糊 |
| `doSomething()` | `validateForm()` | 不表达意图 |
| `manager`, `handler` | 具体职责名称 | 过于通用 |

### 1.7 缩写规则

```typescript
// ✅ 可接受的常见缩写
const userId: string;     // ID 是通用缩写
const apiUrl: string;     // API, URL 是行业标准
const htmlContent: string; // HTML 是通用术语
const maxCount: number;    // max, min 是通用缩写

// ❌ 避免的自定义缩写
const usrNm: string;      // ✅ 应为 userName
const bkng: Booking;      // ✅ 应为 booking
const qty: number;        // ✅ 应为 quantity
```

---

## 2. TypeScript 类型规范

### 2.1 核心原则

**原则 12**: 所有导出的值必须有显式类型/接口
**原则 13**: 禁止使用 `any` 类型（除非白名单）

### 2.2 显式类型声明

```typescript
// ✅ 所有导出值都有显式类型
export const MAX_RETRIES: number = 3;

export function calculateTotal(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.price, 0);
}

export interface User {
	id: string;
	email: string;
	role: UserRole;
}

export class UserService {
	async getUser(id: string): Promise<User> { /* ... */ }
}

// ❌ 缺少类型声明
export const MAX_RETRIES = 3;                  // 应添加 : number
export function calculateTotal(items) { /* */ } // 缺少参数和返回类型
```

### 2.3 禁止使用 `any`

```typescript
// ❌ 禁止使用 any
function processData(data: any) {
	return data.value;
}

const response: any = await api.get('/users');

// ✅ 使用具体类型
function processData(data: UserData) {
	return data.value;
}

const response: ApiResponse<User[]> = await api.get('/users');

// ✅ 如果类型真的未知，使用 unknown
function processUnknownData(data: unknown) {
	// 必须进行类型检查
	if (typeof data === 'object' && data !== null && 'value' in data) {
		return data.value;
	}
	throw new Error('Invalid data format');
}
```

### 2.4 `any` 白名单（极少数情况）

仅在以下情况下允许使用 `any`，并且必须添加注释说明原因：

```typescript
// ✅ 白名单场景 1: 第三方库类型缺失
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import legacyLib from 'legacy-lib'; // 该库无类型定义

// ✅ 白名单场景 2: 动态表单数据（必须配合运行时验证）
interface DynamicFormData {
	// any is acceptable here because we validate at runtime
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fields: Record<string, any>;
}

function validateFormData(data: DynamicFormData): ValidatedFormData {
	// 必须进行运行时验证
	return validateSchema(data);
}
```

### 2.5 类型别名 vs 接口

| 场景 | 使用 | 示例 |
|------|------|------|
| 对象形状 | `interface` | `interface User { ... }` |
| 联合类型 | `type` | `type Status = 'active' \| 'inactive'` |
| 基础类型别名 | `type` | `type UserId = string` |
| 函数类型 | `type` | `type Handler = (e: Event) => void` |

```typescript
// ✅ 使用 interface 定义对象形状
interface User {
	id: string;
	email: string;
	role: UserRole;
}

// ✅ 使用 type 定义联合类型
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// ✅ 使用 type 定义函数类型
type ValidationFunction = (value: string) => boolean;

// ✅ 使用 type 定义基础类型别名
type UserId = string;
type Timestamp = number;
```

### 2.6 严格的空值检查

```typescript
// ✅ 明确处理 null/undefined
function getUserName(user: User | null): string {
	if (user === null) {
		return 'Guest';
	}
	return user.name;
}

// ✅ 使用可选链
const userName = user?.profile?.name ?? 'Guest';

// ❌ 不处理 null/undefined
function getUserName(user: User): string {
	return user.name; // user 可能为 null
}
```

### 2.7 泛型使用

```typescript
// ✅ 好的泛型使用
interface ApiResponse<T> {
	data: T;
	status: number;
	message?: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
	const response = await fetch(url);
	return response.json();
}

// 使用时类型清晰
const userResponse = await fetchData<User>('/api/users/1');
const bookings = await fetchData<Booking[]>('/api/bookings');

// ❌ 过度使用泛型
function process<T, U, V, W>(a: T, b: U, c: V, d: W) { /* ... */ }
```

---

## 3. 注释规范

### 3.1 核心原则：Comments First

**在编写代码之前，先写注释描述意图。**

### 3.2 何时需要注释

| 场景 | 是否需要 | 说明 |
|------|---------|------|
| 复杂业务逻辑 | ✅ 必需 | 解释"为什么"这样实现 |
| 公共 API | ✅ 必需 | JSDoc 文档 |
| 非显而易见的算法 | ✅ 必需 | 解释算法原理 |
| 临时方案/技术债 | ✅ 必需 | 标记 TODO/FIXME |
| 清晰的代码 | ❌ 不需要 | 代码自解释 |

### 3.3 JSDoc 规范

所有公共函数、类、接口都必须有 JSDoc 注释：

```typescript
/**
 * 根据用户ID获取用户信息
 * 
 * @param userId - 用户唯一标识符
 * @returns 用户对象，如果未找到返回 null
 * @throws {ValidationError} 当 userId 格式无效时抛出
 * 
 * @example
 * const user = await getUserById('user_123');
 * if (user) {
 *   console.log(user.email);
 * }
 */
export async function getUserById(userId: string): Promise<User | null> {
	validateUserId(userId);
	return await db.users.findById(userId);
}

/**
 * 用户数据接口
 */
export interface User {
	/** 用户唯一标识符 */
	id: string;
	
	/** 用户邮箱地址 */
	email: string;
	
	/** 用户角色 */
	role: UserRole;
	
	/** 账户创建时间 (Unix timestamp) */
	createdAt: number;
}
```

### 3.4 注释类型

#### TODO 注释
```typescript
// TODO: 实现缓存机制以提升性能
// TODO(张三): 2026-02-01 前重构此函数
```

#### FIXME 注释
```typescript
// FIXME: 此处存在竞态条件，需要添加锁机制
// FIXME: 临时方案，等待 API v2 上线后移除
```

#### 复杂逻辑注释
```typescript
function calculateDiscount(user: User, order: Order): number {
	// 业务规则：
	// 1. VIP 用户享受 15% 折扣
	// 2. 首次购买用户享受 10% 折扣
	// 3. 订单金额超过 1000 元享受 5% 折扣
	// 4. 折扣不叠加，取最大值
	
	const discounts: number[] = [];
	
	if (user.isVip) {
		discounts.push(0.15);
	}
	
	if (user.isFirstOrder) {
		discounts.push(0.10);
	}
	
	if (order.total > 1000) {
		discounts.push(0.05);
	}
	
	return Math.max(...discounts, 0);
}
```

### 3.5 避免无用注释

```typescript
// ❌ 无用的注释
// 获取用户
const user = await getUser();

// 循环数组
for (const item of items) { /* ... */ }

// 返回 true
return true;

// ✅ 有价值的注释
// 使用缓存避免重复查询，缓存有效期 5 分钟
const user = await getCachedUser(userId);

// 按创建时间倒序排序，确保最新的记录在前
items.sort((a, b) => b.createdAt - a.createdAt);

// 根据 RFC 5322 规范验证邮箱格式
return EMAIL_REGEX.test(email);
```

---

## 4. 代码风格

### 4.1 格式规范

| 规则 | 要求 |
|------|------|
| **缩进方式** | 必须使用 Tab |
| **Tab 大小** | 5 个空格宽度 |
| **引号** | 单引号 `'` |
| **分号** | 必须使用 |
| **行长度** | 建议不超过 100 字符 |
| **尾随逗号** | 多行时使用 |

### 4.2 文件组织

```typescript
// 1. 导入语句（分组排序）
// 外部依赖
import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// 内部模块
import { UserService } from '@/services/user-service';
import { validateEmail } from '@/utils/validators';

// 类型导入
import type { User, BookingData } from '@/types';

// 样式导入
import './styles.css';

// 2. 类型定义
interface Props {
	userId: string;
	onUpdate: (user: User) => void;
}

// 3. 常量定义
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// 4. 主要实现
export function UserProfile({ userId, onUpdate }: Props) {
	// ...
}

// 5. 辅助函数
function formatUserData(user: User): FormattedUser {
	// ...
}
```

### 4.3 文件长度限制

**核心原则：每个代码文件不得超过 1000 行**

| 规则 | 限制 | 说明 |
|------|------|------|
| **最大行数** | 1000 行 | 包括空行和注释 |
| **建议行数** | < 500 行 | 超过需考虑是否拆分 |
| **警告阈值** | 800 行 | 开始计划重构 |

#### 为什么限制文件长度？

1. **提高可读性** - 文件过大难以理解整体结构
2. **降低复杂度** - 大文件通常意味着职责过多
3. **便于维护** - 小文件更容易修改和测试
4. **减少冲突** - 多人协作时减少合并冲突
5. **提升性能** - IDE 和工具处理小文件更快

#### 超过 1000 行时如何处理？

```typescript
// ❌ 超过 1000 行的大文件
// user-service.ts (1500 lines)
class UserService {
	// 用户 CRUD 操作 (300 lines)
	createUser() { /* ... */ }
	updateUser() { /* ... */ }
	deleteUser() { /* ... */ }
	
	// 用户验证逻辑 (200 lines)
	validateEmail() { /* ... */ }
	validatePassword() { /* ... */ }
	
	// 用户权限管理 (300 lines)
	checkPermission() { /* ... */ }
	assignRole() { /* ... */ }
	
	// 用户通知 (200 lines)
	sendWelcomeEmail() { /* ... */ }
	sendResetEmail() { /* ... */ }
	
	// 用户统计 (300 lines)
	getUserStats() { /* ... */ }
	generateReport() { /* ... */ }
	
	// ... 更多功能
}

// ✅ 按职责拆分为多个文件
// user-crud.service.ts (250 lines)
export class UserCrudService {
	createUser() { /* ... */ }
	updateUser() { /* ... */ }
	deleteUser() { /* ... */ }
}

// user-validation.service.ts (180 lines)
export class UserValidationService {
	validateEmail() { /* ... */ }
	validatePassword() { /* ... */ }
}

// user-permission.service.ts (280 lines)
export class UserPermissionService {
	checkPermission() { /* ... */ }
	assignRole() { /* ... */ }
}

// user-notification.service.ts (200 lines)
export class UserNotificationService {
	sendWelcomeEmail() { /* ... */ }
	sendResetEmail() { /* ... */ }
}

// user-analytics.service.ts (280 lines)
export class UserAnalyticsService {
	getUserStats() { /* ... */ }
	generateReport() { /* ... */ }
}

// user.service.ts (100 lines) - 协调器
export class UserService {
	constructor(
		private crud: UserCrudService,
		private validation: UserValidationService,
		private permission: UserPermissionService,
		private notification: UserNotificationService,
		private analytics: UserAnalyticsService
	) {}
	
	// 协调各个服务
}
```

#### 重构策略

**策略 1: 按功能拆分**
```
原文件: user-service.ts (1200 lines)
拆分为:
  ├── user-crud.service.ts      (CRUD 操作)
  ├── user-validation.service.ts (验证逻辑)
  └── user-permission.service.ts (权限管理)
```

**策略 2: 按层次拆分**
```
原文件: booking-page.tsx (1500 lines)
拆分为:
  ├── BookingPage.tsx           (主组件, 100 lines)
  ├── BookingForm.tsx           (表单组件, 300 lines)
  ├── BookingList.tsx           (列表组件, 400 lines)
  ├── BookingFilters.tsx        (过滤器, 200 lines)
  └── useBookingData.ts         (数据逻辑, 300 lines)
```

**策略 3: 提取工具函数**
```
原文件: utils.ts (1100 lines)
拆分为:
  ├── date-utils.ts             (日期工具)
  ├── string-utils.ts           (字符串工具)
  ├── validation-utils.ts       (验证工具)
  └── format-utils.ts           (格式化工具)
```

**策略 4: 代码优化缩减**
```typescript
// ❌ 冗余代码
function getUserById(id: string): User | null {
	if (id === null) {
		return null;
	}
	if (id === undefined) {
		return null;
	}
	if (id === '') {
		return null;
	}
	// ... 100 lines of similar checks
}

// ✅ 优化后
function getUserById(id: string): User | null {
	if (!id) return null;
	return db.users.findById(id);
}
```

#### 配置 ESLint 规则

```javascript
// .eslintrc.js
module.exports = {
	rules: {
		'max-lines': ['error', {
			max: 1000,
			skipBlankLines: false,
			skipComments: false,
		}],
		'max-lines-per-function': ['warn', {
			max: 50,
			skipBlankLines: true,
			skipComments: true,
		}],
	},
};
```

#### 检查文件长度

```bash
# 查找超过 1000 行的文件
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 1000'

# 使用 cloc 统计（更准确）
cloc src --by-file | awk '$5 > 1000'
```

### 4.4 导入顺序

```typescript
// ✅ 正确的导入顺序
// 1. React 相关
import React from 'react';
import { useRouter } from 'next/router';

// 2. 第三方库
import { z } from 'zod';
import axios from 'axios';

// 3. 项目内部 - 按路径层级
import { api } from '@/lib/api';
import { UserService } from '@/services/user-service';
import { Button } from '@/components/ui/button';
import { validateEmail } from '@/utils/validators';

// 4. 类型导入单独一组
import type { User } from '@/types/user';
import type { ApiResponse } from '@/types/api';

// 5. 样式文件最后
import './user-profile.css';
```

---

## 5. 为阅读者编码

### 5.1 核心原则：Code for the Reader

**代码被阅读的次数远多于被编写的次数，优化可读性而非编写速度。**

### 5.2 可读性清单

#### ✅ 做到：
- 使用清晰的变量名
- 提取复杂表达式为命名变量
- 一个函数只做一件事
- 避免嵌套过深
- 添加必要的空行分隔逻辑块

#### ❌ 避免：
- 过度聪明的代码
- 不必要的简写
- 复杂的三元运算符嵌套
- 过长的函数
- 魔法数字

### 5.3 示例对比

```typescript
// ❌ 难以阅读
const f = (u) => u.r === 'a' || u.r === 'm' ? u.p.includes('w') ? true : false : false;

// ✅ 清晰可读
function canUserWrite(user: User): boolean {
	const isAdminOrManager = user.role === 'admin' || user.role === 'manager';
	const hasWritePermission = user.permissions.includes('write');
	
	return isAdminOrManager && hasWritePermission;
}

// ❌ 复杂嵌套
if (user) {
	if (user.role === 'admin') {
		if (user.isActive) {
			if (user.hasPermission('delete')) {
				deleteResource();
			}
		}
	}
}

// ✅ 提前返回（卫语句）
if (!user) return;
if (user.role !== 'admin') return;
if (!user.isActive) return;
if (!user.hasPermission('delete')) return;

deleteResource();
```

### 5.4 提取魔法数字

```typescript
// ❌ 魔法数字
if (user.age > 18 && user.accountBalance > 10000) {
	// ...
}

setTimeout(() => { /* ... */ }, 86400000);

// ✅ 使用命名常量
const ADULT_AGE = 18;
const VIP_BALANCE_THRESHOLD = 10000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

if (user.age > ADULT_AGE && user.accountBalance > VIP_BALANCE_THRESHOLD) {
	// ...
}

setTimeout(() => { /* ... */ }, ONE_DAY_IN_MS);
```

### 5.5 复杂条件提取

```typescript
// ❌ 复杂条件
if (
	(user.role === 'admin' || user.role === 'manager') &&
	user.isActive &&
	!user.isSuspended &&
	user.lastLoginDays < 30
) {
	// ...
}

// ✅ 提取为命名函数
function isActiveManager(user: User): boolean {
	const hasManagerRole = user.role === 'admin' || user.role === 'manager';
	const isAccountActive = user.isActive && !user.isSuspended;
	const hasRecentLogin = user.lastLoginDays < 30;
	
	return hasManagerRole && isAccountActive && hasRecentLogin;
}

if (isActiveManager(user)) {
	// ...
}
```

---

## 快速检查清单

### 命名
- [ ] 变量名清晰表达意图
- [ ] 布尔值使用 is/has/can/should 前缀
- [ ] 函数名以动词开头
- [ ] 避免缩写（除非是通用缩写）

### 类型
- [ ] 所有导出值有显式类型
- [ ] 无 `any` 类型（除非白名单）
- [ ] null/undefined 已明确处理
- [ ] 接口/类型定义清晰

### 注释
- [ ] 复杂逻辑有注释说明
- [ ] 公共 API 有 JSDoc
- [ ] 无无用注释
- [ ] TODO/FIXME 标记清晰

### 代码结构
- [ ] 文件长度 ≤ 1000 行
- [ ] 函数长度 ≤ 50 行
- [ ] 嵌套深度 ≤ 3 层
- [ ] 无魔法数字
- [ ] 复杂条件已提取

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.1 | 2026-01-20 | 新增文件长度限制规范（≤ 1000 行） |
| v2.0 | 2026-01-20 | 新增完整命名规范、类型规范、注释规范 |
| v1.0 | 2026-01-19 | 初始版本 |
