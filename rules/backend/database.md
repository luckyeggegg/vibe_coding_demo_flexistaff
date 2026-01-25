# 数据库使用规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的数据库使用规范（Prisma ORM）。

---

## 目录

1. [Schema 设计](#1-schema-设计)
2. [查询优化](#2-查询优化)
3. [事务处理](#3-事务处理)
4. [数据验证](#4-数据验证)
5. [迁移管理](#5-迁移管理)

---

## 1. Schema 设计

### 1.1 命名规范

```prisma
// ✅ 好的命名
model User {
	id        String   @id @default(cuid())
	email     String   @unique
	name      String
	role      UserRole
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
	
	// 关联（复数形式）
	bookings  Booking[]
}

model Booking {
	id        String   @id @default(cuid())
	userId    String
	status    BookingStatus
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
	
	// 关联（单数形式）
	user      User     @relation(fields: [userId], references: [id])
	
	@@index([userId])
	@@index([status])
}

enum UserRole {
	ADMIN
	MANAGER
	STAFF
}

enum BookingStatus {
	PENDING
	CONFIRMED
	CANCELLED
	COMPLETED
}
```

### 1.2 索引策略

```prisma
model User {
	id    String @id @default(cuid())
	email String @unique  // 自动创建唯一索引
	name  String
	role  UserRole
	
	@@index([role])  // 常用于过滤的字段
}

model Booking {
	id        String   @id
	userId    String
	storeId   String
	status    BookingStatus
	date      DateTime
	createdAt DateTime
	
	// 单字段索引
	@@index([userId])
	@@index([status])
	
	// 复合索引（查询多个字段时）
	@@index([userId, status])
	@@index([storeId, date])
	
	// 全文搜索索引（PostgreSQL）
	@@fulltext([notes])
}
```

### 1.3 关联关系

```prisma
// ✅ 一对多关系
model User {
	id       String    @id @default(cuid())
	bookings Booking[]
}

model Booking {
	id     String @id @default(cuid())
	userId String
	user   User   @relation(fields: [userId], references: [id])
	
	@@index([userId])
}

// ✅ 多对多关系
model User {
	id    String   @id @default(cuid())
	roles UserRole[]
}

model Role {
	id    String   @id @default(cuid())
	name  String
	users UserRole[]
}

// 中间表
model UserRole {
	userId String
	roleId String
	user   User   @relation(fields: [userId], references: [id])
	role   Role   @relation(fields: [roleId], references: [id])
	
	@@id([userId, roleId])
	@@index([userId])
	@@index([roleId])
}

// ✅ 自关联（如评论回复）
model Comment {
	id        String    @id @default(cuid())
	content   String
	parentId  String?
	parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
	replies   Comment[] @relation("CommentReplies")
}
```

---

## 2. 查询优化

### 2.1 选择字段

```typescript
// ❌ 不要：查询所有字段
const users = await prisma.user.findMany();

// ✅ 只查询需要的字段
const users = await prisma.user.findMany({
	select: {
		id: true,
		email: true,
		name: true,
		// 不查询 passwordHash 等敏感字段
	},
});
```

### 2.2 预加载关联（避免 N+1）

```typescript
// ❌ N+1 问题
const bookings = await prisma.booking.findMany();
for (const booking of bookings) {
	// 每个 booking 都执行一次查询！
	booking.user = await prisma.user.findUnique({
		where: { id: booking.userId },
	});
}

// ✅ 使用 include 预加载
const bookings = await prisma.booking.findMany({
	include: {
		user: true,  // 一次查询加载所有关联用户
		store: true,
	},
});

// ✅ 使用 select 只加载需要的字段
const bookings = await prisma.booking.findMany({
	include: {
		user: {
			select: {
				id: true,
				name: true,
				email: true,
			},
		},
	},
});
```

### 2.3 分页查询

```typescript
// ✅ 基于偏移量的分页
export async function getBookings(page: number, limit: number) {
	const skip = (page - 1) * limit;
	
	const [bookings, total] = await Promise.all([
		prisma.booking.findMany({
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.booking.count(),
	]);
	
	return {
		data: bookings,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
}

// ✅ 基于游标的分页（性能更好）
export async function getBookingsCursor(cursor?: string, limit: number = 20) {
	const bookings = await prisma.booking.findMany({
		take: limit + 1, // 多取一个判断是否有下一页
		...(cursor && {
			cursor: { id: cursor },
			skip: 1, // 跳过游标本身
		}),
		orderBy: { createdAt: 'desc' },
	});
	
	const hasMore = bookings.length > limit;
	const data = hasMore ? bookings.slice(0, -1) : bookings;
	const nextCursor = hasMore ? data[data.length - 1].id : null;
	
	return { data, nextCursor, hasMore };
}
```

### 2.4 批量操作

```typescript
// ❌ 循环插入（慢）
for (const user of users) {
	await prisma.user.create({ data: user });
}

// ✅ 批量插入
await prisma.user.createMany({
	data: users,
	skipDuplicates: true, // 跳过重复记录
});

// ✅ 批量更新
await prisma.user.updateMany({
	where: { role: 'STAFF' },
	data: { isActive: true },
});

// ✅ 批量删除
await prisma.user.deleteMany({
	where: { isActive: false },
});
```

---

## 3. 事务处理

### 3.1 基础事务

```typescript
// ✅ 交互式事务
export async function transferBooking(
	bookingId: string,
	fromUserId: string,
	toUserId: string
) {
	return await prisma.$transaction(async (tx) => {
		// 1. 验证预订存在
		const booking = await tx.booking.findUnique({
			where: { id: bookingId },
		});
		
		if (!booking || booking.userId !== fromUserId) {
			throw new Error('Invalid booking');
		}
		
		// 2. 转移预订
		const updated = await tx.booking.update({
			where: { id: bookingId },
			data: { userId: toUserId },
		});
		
		// 3. 记录历史
		await tx.bookingHistory.create({
			data: {
				bookingId,
				action: 'TRANSFER',
				fromUserId,
				toUserId,
			},
		});
		
		return updated;
	});
}
```

### 3.2 批量事务

```typescript
// ✅ 批量事务
export async function createUserWithProfile(userData: UserData) {
	return await prisma.$transaction([
		prisma.user.create({
			data: {
				email: userData.email,
				name: userData.name,
			},
		}),
		prisma.profile.create({
			data: {
				userId: userData.id,
				bio: userData.bio,
			},
		}),
	]);
}
```

### 3.3 事务隔离级别

```typescript
// ✅ 设置隔离级别
await prisma.$transaction(
	async (tx) => {
		// 事务逻辑
	},
	{
		isolationLevel: 'Serializable', // 最高隔离级别
		maxWait: 5000,  // 最大等待时间（毫秒）
		timeout: 10000, // 事务超时时间（毫秒）
	}
);
```

---

## 4. 数据验证

### 4.1 Prisma 验证

```prisma
model User {
	id    String @id @default(cuid())
	email String @unique  // 唯一性约束
	age   Int    @default(18)  // 默认值
	
	// 检查约束（PostgreSQL）
	@@check(age >= 18, name: "age_check")
}
```

### 4.2 应用层验证

```typescript
import { z } from 'zod';

// ✅ 使用 Zod 验证输入
const CreateUserSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2).max(50),
	age: z.number().int().min(18).max(120),
});

export async function createUser(data: unknown) {
	// 验证输入
	const validated = CreateUserSchema.parse(data);
	
	// 创建用户
	return await prisma.user.create({
		data: validated,
	});
}
```

### 4.3 唯一性验证

```typescript
// ✅ 检查唯一性
export async function createUser(email: string, name: string) {
	// 检查邮箱是否已存在
	const existing = await prisma.user.findUnique({
		where: { email },
	});
	
	if (existing) {
		throw new ConflictError('Email already exists');
	}
	
	return await prisma.user.create({
		data: { email, name },
	});
}

// ✅ 使用 upsert（如果存在则更新，否则创建）
export async function upsertUser(email: string, data: UserData) {
	return await prisma.user.upsert({
		where: { email },
		update: data,
		create: { email, ...data },
	});
}
```

---

## 5. 迁移管理

### 5.1 创建迁移

```bash
# 开发环境：创建并应用迁移
npx prisma migrate dev --name add_user_role

# 生产环境：只应用迁移
npx prisma migrate deploy

# 重置数据库（开发环境）
npx prisma migrate reset
```

### 5.2 迁移最佳实践

```prisma
// ✅ 好的迁移：向后兼容

// 1. 添加可选字段
model User {
	id    String  @id
	email String
	phone String? // 可选字段，不影响现有数据
}

// 2. 分步骤迁移（重命名字段）
// 步骤 1: 添加新字段
model User {
	id       String @id
	userName String?  // 新字段
	name     String   // 旧字段
}

// 步骤 2: 迁移数据
// 在应用代码中将 name 复制到 userName

// 步骤 3: 删除旧字段
model User {
	id       String @id
	userName String  // 新字段（现在是必需的）
}

// ❌ 不好的迁移：直接重命名
// 直接从 name 改为 userName 会导致数据丢失！
```

### 5.3 回滚策略

```bash
# 查看迁移历史
npx prisma migrate status

# 回滚到特定迁移（需要手动处理）
# 1. 恢复 schema.prisma 到目标版本
# 2. 删除新的迁移文件
# 3. 重新生成 Prisma Client
npx prisma generate
```

### 5.4 数据迁移

```typescript
// migrations/data/20260120_migrate_user_names.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// 数据迁移逻辑
	const users = await prisma.user.findMany({
		where: { userName: null },
	});
	
	for (const user of users) {
		await prisma.user.update({
			where: { id: user.id },
			data: { userName: user.name },
		});
	}
	
	console.log(`Migrated ${users.length} users`);
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
```

---

## 数据库使用检查清单

### Schema 设计
- [ ] 表名使用 PascalCase
- [ ] 字段名使用 camelCase
- [ ] 关键字段有索引
- [ ] 外键有索引
- [ ] 时间戳字段（createdAt, updatedAt）

### 查询优化
- [ ] 只查询需要的字段
- [ ] 使用 include/select 预加载关联
- [ ] 大数据集使用分页
- [ ] 批量操作而非循环
- [ ] 复杂查询使用原始 SQL

### 数据完整性
- [ ] 使用事务处理关联操作
- [ ] 应用层验证输入
- [ ] 数据库层约束（unique, check）
- [ ] 外键约束

### 迁移
- [ ] 迁移文件有描述性名称
- [ ] 向后兼容的迁移
- [ ] 生产环境先备份
- [ ] 数据迁移脚本单独管理

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整数据库使用规范 |
