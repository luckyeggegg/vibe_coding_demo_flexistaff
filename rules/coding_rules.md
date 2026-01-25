# FlexiStaff 项目编码规范

> 版本: v1.1
> 更新日期: 2026-01-20
> 适用范围: FlexiStaff Part-Time Booking System

本文档定义了 FlexiStaff 项目的编码规范，基于 **SOLID**、**KISS**、**DRY** 三大核心原则。

---

## 目录

1. [核心原则概述](#1-核心原则概述)
2. [SOLID 原则](#2-solid-原则)
3. [KISS 原则](#3-kiss-原则)
4. [DRY 原则](#4-dry-原则)
5. [代码审查清单](#5-代码审查清单)
6. [反模式警示](#6-反模式警示)
7. [附录](#7-附录)
   - [7.1 推荐工具](#71-推荐工具)
   - [7.2 推荐 ESLint 规则](#72-推荐-eslint-规则)
   - [7.3 代码格式规范](#73-代码格式规范)
   - [7.4 文档更新记录](#74-文档更新记录)

---

## 1. 核心原则概述

| 原则 | 全称 | 核心思想 |
|------|------|----------|
| **SOLID** | 五大设计原则 | 构建可维护、可扩展的面向对象系统 |
| **KISS** | Keep It Simple, Stupid | 保持简单，避免不必要的复杂性 |
| **DRY** | Don't Repeat Yourself | 避免重复，单一信息源 |

---

## 2. SOLID 原则

### 2.1 单一职责原则 (Single Responsibility Principle)

**定义**: 一个类/模块应该只有一个引起它变化的原因。

**规则**:
- 每个组件只负责一项功能
- 每个函数只做一件事
- **文件大小不得超过 1000 行**（强制要求）
  - 建议保持在 500 行以内
  - 超过 800 行需要计划重构
  - 超过 1000 行必须立即重构或拆分

**项目示例**:

```typescript
// ❌ 违反 SRP - 一个组件做太多事
const UserCard = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  // 处理 API 调用
  const fetchUserDetails = async () => { /* ... */ };

  // 处理表单验证
  const validateEmail = (email) => { /* ... */ };

  // 处理导出功能
  const exportToPDF = () => { /* ... */ };

  return <div>...</div>;
};

// ✅ 遵循 SRP - 职责分离
// hooks/useUserDetails.ts - 处理数据获取
export const useUserDetails = (userId: string) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // ...
  return { user, isLoading };
};

// utils/validators.ts - 处理验证
export const validateEmail = (email: string): boolean => { /* ... */ };

// components/UserCard.tsx - 只负责渲染
const UserCard = ({ user }) => {
  return <div>{user.name}</div>;
};
```

### 2.2 开闭原则 (Open/Closed Principle)

**定义**: 软件实体应该对扩展开放，对修改关闭。

**规则**:
- 新增功能通过扩展实现，而非修改现有代码
- 使用接口/抽象类定义契约
- 使用组合优于继承

**项目示例**:

```typescript
// ❌ 违反 OCP - 每次新增通知类型都要修改
const sendNotification = (type: string, message: string) => {
  if (type === 'email') {
    // 发送邮件
  } else if (type === 'sms') {
    // 发送短信
  } else if (type === 'push') {
    // 发送推送 - 新增时必须修改此函数
  }
};

// ✅ 遵循 OCP - 通过接口扩展
interface NotificationChannel {
  send(message: string): Promise<void>;
}

class EmailChannel implements NotificationChannel {
  async send(message: string) { /* ... */ }
}

class SMSChannel implements NotificationChannel {
  async send(message: string) { /* ... */ }
}

// 新增渠道只需实现接口，无需修改现有代码
class PushChannel implements NotificationChannel {
  async send(message: string) { /* ... */ }
}

const sendNotification = async (channel: NotificationChannel, message: string) => {
  await channel.send(message);
};
```

### 2.3 里氏替换原则 (Liskov Substitution Principle)

**定义**: 子类必须能够替换其父类而不影响程序正确性。

**规则**:
- 子类不应该削弱父类的功能
- 子类的前置条件不能比父类更严格
- 子类的后置条件不能比父类更宽松

**项目示例**:

```typescript
// ❌ 违反 LSP
class Employee {
  calculatePay(): number {
    return this.hourlyRate * this.hoursWorked;
  }
}

class Volunteer extends Employee {
  calculatePay(): number {
    throw new Error('Volunteers are not paid'); // 违反父类契约
  }
}

// ✅ 遵循 LSP - 使用组合或接口分离
interface Payable {
  calculatePay(): number;
}

interface Workable {
  work(): void;
}

class PaidEmployee implements Payable, Workable {
  calculatePay(): number { return this.hourlyRate * this.hoursWorked; }
  work(): void { /* ... */ }
}

class Volunteer implements Workable {
  work(): void { /* ... */ }
  // 不实现 Payable 接口
}
```

### 2.4 接口隔离原则 (Interface Segregation Principle)

**定义**: 不应该强迫客户端依赖它不使用的方法。

**规则**:
- 接口应该小而专注
- 避免"胖接口"
- 按功能拆分接口

**项目示例**:

```typescript
// ❌ 违反 ISP - 胖接口
interface UserService {
  getUser(id: string): User;
  createUser(data: UserData): User;
  deleteUser(id: string): void;
  sendEmail(userId: string, message: string): void;
  generateReport(userId: string): Report;
  exportToCSV(users: User[]): string;
}

// ✅ 遵循 ISP - 接口分离
interface UserReader {
  getUser(id: string): User;
}

interface UserWriter {
  createUser(data: UserData): User;
  deleteUser(id: string): void;
}

interface UserNotifier {
  sendEmail(userId: string, message: string): void;
}

interface UserReporter {
  generateReport(userId: string): Report;
  exportToCSV(users: User[]): string;
}
```

### 2.5 依赖倒置原则 (Dependency Inversion Principle)

**定义**: 高层模块不应该依赖低层模块，两者都应该依赖抽象。

**规则**:
- 依赖接口而非具体实现
- 使用依赖注入
- 通过抽象解耦

**项目示例**:

```typescript
// ❌ 违反 DIP - 直接依赖具体实现
class BookingService {
  private mysqlDb = new MySQLDatabase(); // 直接依赖具体数据库

  async createBooking(data: BookingData) {
    await this.mysqlDb.insert('bookings', data);
  }
}

// ✅ 遵循 DIP - 依赖抽象
interface Database {
  insert(table: string, data: any): Promise<void>;
  find(table: string, query: any): Promise<any>;
}

class BookingService {
  constructor(private db: Database) {} // 依赖注入

  async createBooking(data: BookingData) {
    await this.db.insert('bookings', data);
  }
}

// 可以轻松切换数据库实现
const bookingService = new BookingService(new MySQLDatabase());
// 或
const bookingService = new BookingService(new PostgreSQLDatabase());
```

---

## 3. KISS 原则

### 3.1 核心理念

**Keep It Simple, Stupid** - 保持简单，避免过度设计。

### 3.2 实践规则

| 规则 | 说明 |
|------|------|
| **避免过早优化** | 先让代码工作，再考虑优化 |
| **避免过度抽象** | 不为假设性需求设计 |
| **减少嵌套层级** | 最多 3 层嵌套，超过需重构 |
| **函数参数限制** | 建议不超过 3 个参数 |
| **避免魔法数字** | 使用常量定义数值 |

### 3.3 项目示例

```typescript
// ❌ 违反 KISS - 过度复杂
const calculateDiscount = (
  user: User,
  order: Order,
  promotions: Promotion[],
  seasonalFactors: SeasonalFactor[],
  membershipTier: MembershipTier,
  historicalData: HistoricalPurchase[]
) => {
  let discount = 0;

  // 100 行复杂的折扣计算逻辑...
  if (membershipTier.level > 3) {
    if (seasonalFactors.some(f => f.active)) {
      if (historicalData.length > 10) {
        // 深层嵌套...
      }
    }
  }

  return discount;
};

// ✅ 遵循 KISS - 简单直接
interface DiscountContext {
  userId: string;
  orderTotal: number;
  membershipLevel: number;
}

const calculateDiscount = (context: DiscountContext): number => {
  const { membershipLevel, orderTotal } = context;

  // 简单的折扣规则
  const DISCOUNT_RATES: Record<number, number> = {
    1: 0,
    2: 0.05,
    3: 0.10,
    4: 0.15,
  };

  return orderTotal * (DISCOUNT_RATES[membershipLevel] ?? 0);
};
```

### 3.4 简化检查清单

- [ ] 这个抽象现在真的需要吗？
- [ ] 能否用更少的代码实现同样功能？
- [ ] 新人能在 5 分钟内理解这段代码吗？
- [ ] 是否存在可以删除的代码？

---

## 4. DRY 原则

### 4.1 核心理念

**Don't Repeat Yourself** - 系统中每一项知识都应该有单一、明确、权威的表示。

### 4.2 实践规则

| 规则 | 说明 |
|------|------|
| **提取共享逻辑** | 重复 2 次以上的代码应提取 |
| **集中配置管理** | 配置项应有单一来源 |
| **使用常量文件** | 魔法字符串/数字集中管理 |
| **复用组件** | 创建可复用的 UI 组件 |

### 4.3 项目示例

```typescript
// ❌ 违反 DRY - 重复的验证逻辑
// 在 UserForm.tsx 中
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 在 ContactForm.tsx 中 - 重复！
const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 在 InviteForm.tsx 中 - 再次重复！
const checkEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ✅ 遵循 DRY - 集中定义
// utils/validators.ts
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

// 在各表单中复用
import { validateEmail } from '@/utils/validators';
```

### 4.4 常量管理示例

```typescript
// constants/index.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  BOOKINGS: '/api/bookings',
  AUTH: '/api/auth',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'Please login to continue.',
  NOT_FOUND: 'Resource not found.',
} as const;
```

### 4.5 DRY vs 错误的抽象

**注意**: DRY 不是绝对的。过度追求 DRY 可能导致错误的抽象。

```typescript
// ⚠️ 警告 - 错误的 DRY 应用
// 两段代码看起来相似，但实际业务逻辑不同

// 员工薪资计算
const calculateEmployeePay = (hours: number, rate: number) => hours * rate;

// 承包商费用计算 - 看起来相似，但业务规则可能演化不同
const calculateContractorFee = (hours: number, rate: number) => hours * rate;

// ✅ 正确做法 - 如果业务规则可能独立演化，保持分离
// 即使现在代码相同，但它们代表不同的业务概念
```

---

## 5. 代码审查清单

### 5.1 SOLID 检查项

| 原则 | 检查问题 |
|------|----------|
| **SRP** | 这个类/函数是否只有一个修改的理由？ |
| **OCP** | 添加新功能是否需要修改现有代码？ |
| **LSP** | 子类是否可以安全替换父类？ |
| **ISP** | 接口是否包含调用者不需要的方法？ |
| **DIP** | 是否依赖具体实现而非抽象？ |

### 5.2 KISS 检查项

| 检查项 | 标准 |
|--------|------|
| **文件长度** | **≤ 1000 行（强制）** |
| 函数长度 | ≤ 50 行 |
| 嵌套深度 | ≤ 3 层 |
| 参数数量 | ≤ 3 个 (对象参数除外) |
| 圈复杂度 | ≤ 10 |

### 5.3 DRY 检查项

- [ ] 是否存在复制粘贴的代码？
- [ ] 配置是否集中管理？
- [ ] 是否有重复的类型定义？
- [ ] 是否有重复的验证逻辑？

---

## 6. 反模式警示

### 6.1 常见违规示例

| 反模式 | 违反原则 | 问题描述 |
|--------|----------|----------|
| **Blob/God File** | **SRP** | **文件超过 1000 行，职责不清** |
| God Class | SRP | 一个类包含过多职责 |
| Spaghetti Code | KISS | 代码结构混乱，难以追踪 |
| Copy-Paste Programming | DRY | 重复代码遍布项目 |
| Magic Numbers | KISS/DRY | 硬编码的数字散落各处 |
| Deep Nesting | KISS | 过深的条件嵌套 |
| Feature Envy | SRP | 方法过度使用其他类的数据 |
| Premature Optimization | KISS | 过早进行性能优化 |

### 6.2 重构信号

当出现以下情况时，应考虑重构：

1. **🚨 文件过大** - 文件超过 1000 行（立即重构）
2. **⚠️ 文件接近上限** - 文件超过 800 行（计划重构）
3. **散弹式修改** - 一个变更需要修改多个类
4. **发散式变化** - 一个类因多个原因需要修改
5. **过长函数** - 函数超过 50 行
6. **过长参数列表** - 参数超过 3 个
7. **重复代码** - 相似代码出现 3 次以上

---

## 7. 附录

### 7.1 推荐工具

| 工具 | 用途 |
|------|------|
| ESLint | 代码质量检查 |
| Prettier | 代码格式化 |
| SonarQube | 代码质量分析 |
| TypeScript | 类型安全 |

### 7.2 推荐 ESLint 规则

```json
{
  "rules": {
    "max-lines-per-function": ["warn", 50],
    "max-depth": ["warn", 3],
    "max-params": ["warn", 3],
    "complexity": ["warn", 10],
    "no-duplicate-imports": "error"
  }
}
```

### 7.3 代码格式规范

| 规则 | 要求 |
|------|------|
| **缩进方式** | 必须使用 Tab |
| **Tab 大小** | 5 |

**说明**: 本项目所有代码文件必须使用 Tab 作为缩进字符，Tab 宽度统一设置为 5。禁止使用空格进行缩进。

**编辑器配置示例**:

```json
// VS Code settings.json
{
  "editor.insertSpaces": false,
  "editor.tabSize": 5
}
```

```
# .editorconfig
[*]
indent_style = tab
indent_size = 5
tab_width = 5
```

### 7.4 文档更新记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.1 | 2026-01-20 | 新增文件长度限制规范：所有代码文件不得超过 1000 行 | - |
| v1.0 | 2026-01-19 | 初始版本：SOLID、KISS、DRY 原则定义及项目示例 | - |

---

## 快速参考卡片

```
┌─────────────────────────────────────────────────────────┐
│                    SOLID KISS DRY                       │
├─────────────────────────────────────────────────────────┤
│  S - 单一职责: 一个类只做一件事                           │
│  O - 开闭原则: 扩展开放，修改关闭                         │
│  L - 里氏替换: 子类可替换父类                             │
│  I - 接口隔离: 小而专注的接口                             │
│  D - 依赖倒置: 依赖抽象而非具体                           │
├─────────────────────────────────────────────────────────┤
│  KISS: 保持简单，避免过度设计                             │
│        - 文件 ≤ 1000 行 (强制)                           │
│        - 函数 ≤ 50 行                                    │
│        - 嵌套 ≤ 3 层                                     │
│        - 参数 ≤ 3 个                                     │
├─────────────────────────────────────────────────────────┤
│  DRY: 不要重复自己                                       │
│       - 提取共享逻辑                                      │
│       - 集中配置管理                                      │
│       - 复用组件                                          │
└─────────────────────────────────────────────────────────┘
```
