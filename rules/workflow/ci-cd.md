# CI/CD 流程规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的 CI/CD 流程规范。

---

## 目录

1. [CI 流程](#1-ci-流程)
2. [CD 流程](#2-cd-流程)
3. [环境管理](#3-环境管理)
4. [部署策略](#4-部署策略)
5. [回滚流程](#5-回滚流程)

---

## 1. CI 流程

### 1.1 持续集成原则

- **快速反馈** - CI 流程应在 10 分钟内完成
- **自动化** - 所有检查自动执行
- **可重复** - 每次运行结果一致
- **失败即停** - 任何检查失败则停止后续步骤

### 1.2 CI 检查项

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

jobs:
  # 1. 代码质量检查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  # 2. 类型检查
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run type-check

  # 3. 单元测试
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # 4. E2E 测试
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Run E2E tests
        run: npm run test:e2e

  # 5. 安全审计
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit --audit-level=high

  # 6. 构建检查
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### 1.3 分支保护规则

```yaml
# GitHub Branch Protection Settings

main:
  required_reviews: 2
  required_checks:
    - lint
    - typecheck
    - test
    - e2e
    - build
  dismiss_stale_reviews: true
  require_code_owner_review: true
  restrict_pushes: true

develop:
  required_reviews: 1
  required_checks:
    - lint
    - typecheck
    - test
  dismiss_stale_reviews: false
```

---

## 2. CD 流程

### 2.1 部署流程

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch: # 手动触发

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # 1. 安装依赖
      - run: npm ci
      
      # 2. 运行测试
      - run: npm run test
      
      # 3. 构建
      - run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.STAGING_API_URL }}
      
      # 4. 部署到 Staging
      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    name: Deploy to Production
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # 1. 运行完整测试套件
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      
      # 2. 构建生产版本
      - run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.PRODUCTION_API_URL }}
      
      # 3. 部署到生产环境
      - name: Deploy to Production
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      
      # 4. 通知团队
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployed to production!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2.2 部署检查清单

**部署前：**
- [ ] 所有 CI 检查通过
- [ ] PR 已审查并批准
- [ ] 已在 Staging 环境测试
- [ ] 数据库迁移已准备
- [ ] 环境变量已配置

**部署中：**
- [ ] 监控部署日志
- [ ] 检查健康检查端点
- [ ] 验证关键功能

**部署后：**
- [ ] 验证部署成功
- [ ] 检查错误日志
- [ ] 监控性能指标
- [ ] 通知团队

---

## 3. 环境管理

### 3.1 环境分类

| 环境 | 用途 | 数据 | 部署频率 |
|------|------|------|---------|
| **Development** | 本地开发 | 模拟数据 | 持续 |
| **Staging** | 测试环境 | 脱敏的生产数据 | 每次 PR 合并 |
| **Production** | 生产环境 | 真实数据 | 发布时 |

### 3.2 环境变量管理

```bash
# ✅ 环境变量命名
# Development
DATABASE_URL=postgresql://localhost:5432/flexistaff_dev
API_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development

# Staging
DATABASE_URL=postgresql://staging-db/flexistaff
API_URL=https://staging-api.flexistaff.com
NEXT_PUBLIC_ENV=staging

# Production
DATABASE_URL=postgresql://prod-db/flexistaff
API_URL=https://api.flexistaff.com
NEXT_PUBLIC_ENV=production
```

### 3.3 配置管理

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production']),
	DATABASE_URL: z.string().url(),
	API_URL: z.string().url(),
	// ...其他环境变量
});

export const env = envSchema.parse(process.env);

// ✅ 类型安全的环境变量
console.log(env.DATABASE_URL); // TypeScript 知道这是 string
```

---

## 4. 部署策略

### 4.1 蓝绿部署

```
┌─────────────┐     ┌─────────────┐
│    Blue     │     │    Green    │
│  (Current)  │     │    (New)    │
└─────────────┘     └─────────────┘
       ↑                   ↑
       │                   │
  ┌────┴───────────────────┴────┐
  │      Load Balancer           │
  └──────────────────────────────┘
              ↑
         100% Traffic
```

**流程：**
1. 部署新版本到 Green 环境
2. 测试 Green 环境
3. 切换流量到 Green
4. 保留 Blue 环境用于快速回滚

### 4.2 金丝雀部署

```
部署阶段：
  10% → 测试 → 50% → 测试 → 100%

监控指标：
  - 错误率
  - 响应时间
  - CPU/内存使用率
```

**流程：**
1. 部署新版本到 10% 用户
2. 监控关键指标
3. 逐步增加流量
4. 发现问题立即回滚

---

## 5. 回滚流程

### 5.1 快速回滚

```bash
# 方法 1: 使用平台回滚功能（推荐）
vercel rollback

# 方法 2: 重新部署上一个版本
git checkout <previous-commit>
npm run deploy

# 方法 3: 蓝绿部署切换
# 切换负载均衡器到旧版本
```

### 5.2 回滚决策

**立即回滚条件：**
- 生产环境崩溃
- 关键功能不可用
- 数据泄露或安全问题
- 错误率 > 5%

**监控后回滚条件：**
- 响应时间增加 > 50%
- 错误率增加 > 2%
- 用户投诉显著增加

### 5.3 回滚检查清单

**回滚前：**
- [ ] 确认问题严重性
- [ ] 通知团队
- [ ] 准备回滚命令

**回滚中：**
- [ ] 执行回滚
- [ ] 验证旧版本运行正常
- [ ] 检查数据库一致性

**回滚后：**
- [ ] 通知团队和用户
- [ ] 分析问题原因
- [ ] 修复问题
- [ ] 更新部署文档

---

## CI/CD 检查清单

### CI 配置
- [ ] 所有检查自动化
- [ ] 检查在 10 分钟内完成
- [ ] 失败时有清晰的错误信息
- [ ] 覆盖率达标

### CD 配置
- [ ] 多环境配置正确
- [ ] 环境变量已配置
- [ ] 部署流程自动化
- [ ] 有回滚方案

### 监控
- [ ] 部署日志可查询
- [ ] 错误监控已设置
- [ ] 性能监控已设置
- [ ] 告警规则已配置

### 文档
- [ ] 部署文档完整
- [ ] 回滚流程清晰
- [ ] 环境变量文档化
- [ ] 故障排查指南

---

## 故障排查

### 部署失败

```bash
# 1. 查看部署日志
vercel logs

# 2. 检查构建日志
npm run build

# 3. 验证环境变量
echo $DATABASE_URL

# 4. 检查依赖
npm audit
npm outdated
```

### 运行时错误

```bash
# 1. 查看应用日志
tail -f logs/app.log

# 2. 检查数据库连接
psql $DATABASE_URL -c "SELECT 1"

# 3. 检查服务状态
curl https://api.flexistaff.com/health
```

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整 CI/CD 流程规范 |
