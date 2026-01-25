# 平台适配器规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的平台适配器开发规范，用于抽象不同部署平台的差异。

---

## 目录

1. [适配器模式](#1-适配器模式)
2. [环境配置](#2-环境配置)
3. [存储适配器](#3-存储适配器)
4. [通知适配器](#4-通知适配器)
5. [支付适配器](#5-支付适配器)

---

## 1. 适配器模式

### 1.1 核心原则

**依赖倒置** - 业务逻辑依赖抽象接口，而非具体实现

```typescript
// ✅ 好的设计
interface StorageAdapter {
	upload(file: Buffer, key: string): Promise<string>;
	download(key: string): Promise<Buffer>;
	delete(key: string): Promise<void>;
}

class S3Storage implements StorageAdapter {
	async upload(file: Buffer, key: string): Promise<string> {
		// AWS S3 实现
	}
}

class LocalStorage implements StorageAdapter {
	async upload(file: Buffer, key: string): Promise<string> {
		// 本地文件系统实现
	}
}

// 业务逻辑不关心具体实现
class FileService {
	constructor(private storage: StorageAdapter) {}
	
	async uploadAvatar(file: Buffer, userId: string): Promise<string> {
		const key = `avatars/${userId}.jpg`;
		return await this.storage.upload(file, key);
	}
}
```

### 1.2 适配器工厂

```typescript
// ✅ 工厂模式创建适配器
export function createStorageAdapter(): StorageAdapter {
	const env = process.env.NODE_ENV;
	
	if (env === 'production') {
		return new S3Storage({
			bucket: process.env.AWS_S3_BUCKET!,
			region: process.env.AWS_REGION!,
		});
	}
	
	return new LocalStorage({
		basePath: './uploads',
	});
}

// 使用
const storage = createStorageAdapter();
const fileService = new FileService(storage);
```

---

## 2. 环境配置

### 2.1 配置管理

```typescript
import { z } from 'zod';

// ✅ 类型安全的配置
const envSchema = z.object({
	// 通用配置
	NODE_ENV: z.enum(['development', 'production', 'test']),
	PORT: z.coerce.number().default(3000),
	
	// 数据库
	DATABASE_URL: z.string().url(),
	
	// 存储（条件必需）
	STORAGE_PROVIDER: z.enum(['s3', 'local']),
	AWS_S3_BUCKET: z.string().optional(),
	AWS_REGION: z.string().optional(),
	
	// 通知
	EMAIL_PROVIDER: z.enum(['sendgrid', 'smtp']),
	SENDGRID_API_KEY: z.string().optional(),
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().optional(),
});

export const env = envSchema.parse(process.env);

// ✅ 条件验证
if (env.STORAGE_PROVIDER === 's3') {
	if (!env.AWS_S3_BUCKET || !env.AWS_REGION) {
		throw new Error('AWS S3 configuration is required');
	}
}

if (env.EMAIL_PROVIDER === 'sendgrid') {
	if (!env.SENDGRID_API_KEY) {
		throw new Error('SendGrid API key is required');
	}
}
```

### 2.2 多环境配置

```typescript
// config/index.ts
interface AppConfig {
	storage: {
		provider: 's3' | 'local';
		maxFileSize: number;
	};
	email: {
		provider: 'sendgrid' | 'smtp';
		from: string;
	};
	payment: {
		provider: 'stripe' | 'mock';
	};
}

// 开发环境配置
const developmentConfig: AppConfig = {
	storage: {
		provider: 'local',
		maxFileSize: 10 * 1024 * 1024, // 10MB
	},
	email: {
		provider: 'smtp',
		from: 'dev@flexistaff.local',
	},
	payment: {
		provider: 'mock',
	},
};

// 生产环境配置
const productionConfig: AppConfig = {
	storage: {
		provider: 's3',
		maxFileSize: 50 * 1024 * 1024, // 50MB
	},
	email: {
		provider: 'sendgrid',
		from: 'noreply@flexistaff.com',
	},
	payment: {
		provider: 'stripe',
	},
};

export const config =
	process.env.NODE_ENV === 'production'
		? productionConfig
		: developmentConfig;
```

---

## 3. 存储适配器

### 3.1 接口定义

```typescript
/**
 * 存储适配器接口
 */
export interface StorageAdapter {
	/**
	 * 上传文件
	 */
	upload(file: Buffer, key: string, contentType?: string): Promise<string>;
	
	/**
	 * 下载文件
	 */
	download(key: string): Promise<Buffer>;
	
	/**
	 * 删除文件
	 */
	delete(key: string): Promise<void>;
	
	/**
	 * 获取文件 URL
	 */
	getUrl(key: string): string;
	
	/**
	 * 获取签名 URL（临时访问）
	 */
	getSignedUrl(key: string, expiresIn: number): Promise<string>;
}
```

### 3.2 S3 实现

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Storage implements StorageAdapter {
	private client: S3Client;
	private bucket: string;
	
	constructor(options: { bucket: string; region: string }) {
		this.bucket = options.bucket;
		this.client = new S3Client({ region: options.region });
	}
	
	async upload(file: Buffer, key: string, contentType?: string): Promise<string> {
		await this.client.send(new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: file,
			ContentType: contentType,
		}));
		
		return this.getUrl(key);
	}
	
	async download(key: string): Promise<Buffer> {
		const response = await this.client.send(new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		}));
		
		return Buffer.from(await response.Body!.transformToByteArray());
	}
	
	async delete(key: string): Promise<void> {
		await this.client.send(new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: key,
		}));
	}
	
	getUrl(key: string): string {
		return `https://${this.bucket}.s3.amazonaws.com/${key}`;
	}
	
	async getSignedUrl(key: string, expiresIn: number): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});
		
		return await getSignedUrl(this.client, command, { expiresIn });
	}
}
```

### 3.3 本地存储实现

```typescript
import fs from 'fs/promises';
import path from 'path';

export class LocalStorage implements StorageAdapter {
	private basePath: string;
	
	constructor(options: { basePath: string }) {
		this.basePath = options.basePath;
	}
	
	async upload(file: Buffer, key: string): Promise<string> {
		const filePath = path.join(this.basePath, key);
		const dir = path.dirname(filePath);
		
		// 确保目录存在
		await fs.mkdir(dir, { recursive: true });
		
		// 写入文件
		await fs.writeFile(filePath, file);
		
		return this.getUrl(key);
	}
	
	async download(key: string): Promise<Buffer> {
		const filePath = path.join(this.basePath, key);
		return await fs.readFile(filePath);
	}
	
	async delete(key: string): Promise<void> {
		const filePath = path.join(this.basePath, key);
		await fs.unlink(filePath);
	}
	
	getUrl(key: string): string {
		return `/uploads/${key}`;
	}
	
	async getSignedUrl(key: string, expiresIn: number): Promise<string> {
		// 本地存储不需要签名 URL
		return this.getUrl(key);
	}
}
```

---

## 4. 通知适配器

### 4.1 接口定义

```typescript
/**
 * 邮件通知适配器接口
 */
export interface EmailAdapter {
	send(options: EmailOptions): Promise<void>;
}

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	text?: string;
	from?: string;
}
```

### 4.2 SendGrid 实现

```typescript
import sgMail from '@sendgrid/mail';

export class SendGridAdapter implements EmailAdapter {
	constructor(apiKey: string, private defaultFrom: string) {
		sgMail.setApiKey(apiKey);
	}
	
	async send(options: EmailOptions): Promise<void> {
		await sgMail.send({
			to: options.to,
			from: options.from || this.defaultFrom,
			subject: options.subject,
			html: options.html,
			text: options.text,
		});
	}
}
```

### 4.3 SMTP 实现

```typescript
import nodemailer from 'nodemailer';

export class SMTPAdapter implements EmailAdapter {
	private transporter: nodemailer.Transporter;
	
	constructor(
		private config: {
			host: string;
			port: number;
			auth: { user: string; pass: string };
		},
		private defaultFrom: string
	) {
		this.transporter = nodemailer.createTransporter(config);
	}
	
	async send(options: EmailOptions): Promise<void> {
		await this.transporter.sendMail({
			from: options.from || this.defaultFrom,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		});
	}
}
```

### 4.4 Mock 实现（测试用）

```typescript
export class MockEmailAdapter implements EmailAdapter {
	public sentEmails: EmailOptions[] = [];
	
	async send(options: EmailOptions): Promise<void> {
		console.log('📧 Mock email sent:', options);
		this.sentEmails.push(options);
	}
	
	clear(): void {
		this.sentEmails = [];
	}
}
```

---

## 5. 支付适配器

### 5.1 接口定义

```typescript
/**
 * 支付适配器接口
 */
export interface PaymentAdapter {
	createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
	confirmPayment(intentId: string): Promise<PaymentResult>;
	refund(paymentId: string, amount?: number): Promise<RefundResult>;
}

interface PaymentIntent {
	id: string;
	clientSecret: string;
	amount: number;
	currency: string;
}

interface PaymentResult {
	id: string;
	status: 'succeeded' | 'failed';
	amount: number;
}

interface RefundResult {
	id: string;
	status: 'succeeded' | 'failed';
	amount: number;
}
```

### 5.2 Stripe 实现

```typescript
import Stripe from 'stripe';

export class StripeAdapter implements PaymentAdapter {
	private stripe: Stripe;
	
	constructor(apiKey: string) {
		this.stripe = new Stripe(apiKey, {
			apiVersion: '2023-10-16',
		});
	}
	
	async createPaymentIntent(
		amount: number,
		currency: string
	): Promise<PaymentIntent> {
		const intent = await this.stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // 转换为分
			currency,
		});
		
		return {
			id: intent.id,
			clientSecret: intent.client_secret!,
			amount,
			currency,
		};
	}
	
	async confirmPayment(intentId: string): Promise<PaymentResult> {
		const intent = await this.stripe.paymentIntents.retrieve(intentId);
		
		return {
			id: intent.id,
			status: intent.status === 'succeeded' ? 'succeeded' : 'failed',
			amount: intent.amount / 100,
		};
	}
	
	async refund(paymentId: string, amount?: number): Promise<RefundResult> {
		const refund = await this.stripe.refunds.create({
			payment_intent: paymentId,
			...(amount && { amount: Math.round(amount * 100) }),
		});
		
		return {
			id: refund.id,
			status: refund.status === 'succeeded' ? 'succeeded' : 'failed',
			amount: refund.amount / 100,
		};
	}
}
```

### 5.3 Mock 实现

```typescript
export class MockPaymentAdapter implements PaymentAdapter {
	private intents = new Map<string, PaymentIntent>();
	
	async createPaymentIntent(
		amount: number,
		currency: string
	): Promise<PaymentIntent> {
		const intent: PaymentIntent = {
			id: `mock_intent_${Date.now()}`,
			clientSecret: `mock_secret_${Date.now()}`,
			amount,
			currency,
		};
		
		this.intents.set(intent.id, intent);
		
		return intent;
	}
	
	async confirmPayment(intentId: string): Promise<PaymentResult> {
		const intent = this.intents.get(intentId);
		
		if (!intent) {
			throw new Error('Payment intent not found');
		}
		
		return {
			id: intentId,
			status: 'succeeded', // Mock 总是成功
			amount: intent.amount,
		};
	}
	
	async refund(paymentId: string, amount?: number): Promise<RefundResult> {
		return {
			id: `mock_refund_${Date.now()}`,
			status: 'succeeded',
			amount: amount || 0,
		};
	}
}
```

---

## 适配器检查清单

### 设计
- [ ] 定义清晰的接口
- [ ] 遵循依赖倒置原则
- [ ] 使用工厂模式创建适配器
- [ ] 接口方法有完整的类型定义

### 实现
- [ ] 生产环境适配器
- [ ] 开发环境适配器
- [ ] 测试环境 Mock 适配器
- [ ] 错误处理

### 配置
- [ ] 环境变量验证
- [ ] 多环境配置
- [ ] 敏感信息不硬编码
- [ ] 配置文档化

### 测试
- [ ] 单元测试
- [ ] 集成测试
- [ ] Mock 适配器可用
- [ ] 测试覆盖主要场景

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整平台适配器规范 |
