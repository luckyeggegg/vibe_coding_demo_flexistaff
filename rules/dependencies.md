# 依赖管理规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的依赖管理规范，遵循 **Minimal Dependencies** 和 **YAGNI** 原则。

---

## 目录

1. [核心原则](#1-核心原则)
2. [依赖选型](#2-依赖选型)
3. [版本管理](#3-版本管理)
4. [安全审计](#4-安全审计)
5. [依赖更新](#5-依赖更新)
6. [包大小控制](#6-包大小控制)

---

## 1. 核心原则

### 1.1 Minimal Dependencies

**最小化依赖，每个依赖都应该有充分的理由。**

### 1.2 YAGNI (You Aren't Gonna Need It)

**不要为假设性需求添加依赖，只添加当前需要的。**

### 1.3 依赖管理原则

1. **优先使用标准库** - 能用原生 API 就不引入依赖
2. **评估必要性** - 每个依赖都要经过评估
3. **考虑大小** - 权衡功能与包大小
4. **检查维护状态** - 选择活跃维护的库
5. **定期审计** - 及时更新和清理依赖

---

## 2. 依赖选型

### 2.1 评估清单

在引入新依赖前，回答以下问题：

| 评估项 | 问题 |
|--------|------|
| **必要性** | 能否用原生 API 或现有依赖实现？ |
| **维护状态** | 最近一次更新是什么时候？Issue 活跃度如何？ |
| **社区支持** | GitHub stars 数量？npm 周下载量？ |
| **包大小** | bundle size 多大？是否支持 tree-shaking？ |
| **类型支持** | 是否有 TypeScript 类型定义？ |
| **许可证** | 许可证是否与项目兼容？ |
| **安全性** | 是否有已知漏洞？ |
| **替代方案** | 是否有更轻量的替代品？ |

### 2.2 推荐依赖列表

#### 核心依赖

| 依赖 | 用途 | 说明 |
|------|------|------|
| **React 18** | UI 框架 | 核心框架 |
| **Next.js** | React 框架 | SSR + 路由 |
| **TypeScript** | 类型系统 | 必需 |
| **Tailwind CSS** | 样式框架 | 官方选择 |

#### 数据处理

| 依赖 | 用途 | 说明 |
|------|------|------|
| **zod** | 数据验证 | 类型安全的验证 |
| **date-fns** | 日期处理 | 轻量级（推荐） |
| ~~moment.js~~ | ~~日期处理~~ | ❌ 过大，已弃用 |

#### HTTP 请求

| 依赖 | 用途 | 说明 |
|------|------|------|
| **fetch (native)** | HTTP 请求 | ✅ 优先使用原生 |
| **axios** | HTTP 请求 | 仅在需要高级功能时 |

#### 工具库

| 依赖 | 用途 | 说明 |
|------|------|------|
| **lodash-es** | 工具函数 | 支持 tree-shaking |
| ~~lodash~~ | ~~工具函数~~ | ❌ 不支持 tree-shaking |

### 2.3 何时不需要依赖

```typescript
// ❌ 不需要：安装 lodash 只为了用 isEmpty
import { isEmpty } from 'lodash';
if (isEmpty(obj)) { /* ... */ }

// ✅ 自己实现（很简单）
function isEmpty(obj: object): boolean {
	return Object.keys(obj).length === 0;
}

// ❌ 不需要：安装 left-pad
import leftPad from 'left-pad';
const padded = leftPad(str, 5, '0');

// ✅ 使用原生方法
const padded = str.padStart(5, '0');

// ❌ 不需要：安装 is-promise
import isPromise from 'is-promise';
if (isPromise(value)) { /* ... */ }

// ✅ 自己实现
function isPromise(value: any): boolean {
	return value && typeof value.then === 'function';
}
```

### 2.4 依赖大小对比

使用 [Bundlephobia](https://bundlephobia.com/) 检查包大小：

```bash
# 安装包大小分析工具
npm install -g cost-of-modules

# 分析项目依赖成本
cost-of-modules
```

```typescript
// ❌ moment.js: 72.9kB (minified + gzipped)
import moment from 'moment';
const formatted = moment().format('YYYY-MM-DD');

// ✅ date-fns: 仅导入需要的函数 ~1kB
import { format } from 'date-fns';
const formatted = format(new Date(), 'yyyy-MM-dd');

// ✅ 原生 API: 0kB
const formatted = new Date().toISOString().split('T')[0];
```

---

## 3. 版本管理

### 3.1 语义化版本 (SemVer)

```
主版本号.次版本号.修订号
MAJOR.MINOR.PATCH

1.2.3
```

- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向后兼容的功能新增
- **PATCH**: 向后兼容的问题修复

### 3.2 版本范围控制

```json
{
	"dependencies": {
		// ✅ 推荐：锁定主版本，允许小版本和补丁更新
		"react": "^18.2.0",
		
		// ✅ 关键依赖：完全锁定版本
		"next": "14.0.4",
		
		// ⚠️ 谨慎使用：允许小版本更新
		"zod": "~3.22.0",
		
		// ❌ 不推荐：允许任何版本
		"lodash": "*"
	},
	"devDependencies": {
		// 开发依赖可以更宽松
		"typescript": "^5.3.0",
		"eslint": "^8.56.0"
	}
}
```

### 3.3 使用 package-lock.json

```bash
# ✅ 始终提交 package-lock.json 到版本控制
git add package-lock.json

# ✅ CI/CD 中使用 ci 命令（更快，确保一致性）
npm ci

# ❌ 不要在 CI/CD 中使用 install
npm install  # 可能安装不同版本
```

### 3.4 依赖分类

```json
{
	"dependencies": {
		// 生产环境需要的依赖
		"react": "^18.2.0",
		"next": "14.0.4"
	},
	"devDependencies": {
		// 仅开发环境需要
		"typescript": "^5.3.0",
		"eslint": "^8.56.0",
		"@types/react": "^18.2.0"
	},
	"peerDependencies": {
		// 由使用方提供的依赖（库开发）
		"react": ">=18.0.0"
	}
}
```

---

## 4. 安全审计

### 4.1 定期审计

```bash
# 检查已知漏洞
npm audit

# 查看详细报告
npm audit --audit-level=moderate

# 自动修复（谨慎使用）
npm audit fix

# 强制修复（可能引入破坏性更新）
npm audit fix --force
```

### 4.2 使用 Snyk

```bash
# 安装 Snyk CLI
npm install -g snyk

# 认证
snyk auth

# 测试项目
snyk test

# 监控项目（持续监控）
snyk monitor
```

### 4.3 GitHub Dependabot

在项目根目录创建 `.github/dependabot.yml`:

```yaml
version: 2
updates:
	- package-ecosystem: "npm"
	  directory: "/"
	  schedule:
	    interval: "weekly"
	  open-pull-requests-limit: 10
	  versioning-strategy: increase
```

### 4.4 安全策略

```json
// package.json
{
	"scripts": {
		"security:audit": "npm audit",
		"security:check": "snyk test",
		"security:fix": "npm audit fix && snyk fix"
	}
}
```

---

## 5. 依赖更新

### 5.1 更新策略

| 更新类型 | 频率 | 说明 |
|---------|------|------|
| **安全补丁** | 立即 | 修复已知漏洞 |
| **补丁版本** | 每周 | Bug 修复 |
| **小版本** | 每月 | 新功能 |
| **大版本** | 按需 | 破坏性更新，需充分测试 |

### 5.2 检查过时依赖

```bash
# 检查过时的依赖
npm outdated

# 输出示例：
# Package      Current  Wanted  Latest  Location
# react        18.2.0   18.2.0  18.3.1  node_modules/react
# typescript   5.2.2    5.3.3   5.3.3   node_modules/typescript
```

### 5.3 更新工具

```bash
# 安装 npm-check-updates
npm install -g npm-check-updates

# 检查可更新的依赖
ncu

# 交互式更新
ncu -i

# 更新 package.json
ncu -u

# 安装更新后的依赖
npm install
```

### 5.4 更新流程

1. **查看变更日志** - 了解更新内容
2. **创建分支** - 不要在主分支直接更新
3. **更新依赖** - 逐个或批量更新
4. **运行测试** - 确保没有破坏性变更
5. **手动测试** - 测试关键功能
6. **提交 PR** - 代码审查
7. **合并** - 合并到主分支

```bash
# 更新流程示例
git checkout -b update-dependencies

# 更新特定依赖
npm update react react-dom

# 运行测试
npm run test
npm run type-check
npm run lint

# 手动测试
npm run dev

# 提交
git add package.json package-lock.json
git commit -m "chore: update react to 18.3.1"
git push origin update-dependencies
```

---

## 6. 包大小控制

### 6.1 分析工具

```bash
# 安装 webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# 在 Next.js 中使用
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
	// Next.js 配置
});
```

```bash
# 分析 bundle
ANALYZE=true npm run build
```

### 6.2 Tree Shaking

```typescript
// ❌ 导入整个库
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ 只导入需要的函数
import debounce from 'lodash/debounce';
debounce(fn, 300);

// ✅ 使用支持 tree-shaking 的库
import { debounce } from 'lodash-es';
debounce(fn, 300);
```

### 6.3 动态导入

```typescript
// ✅ 按需加载大型库
async function processImage(file: File) {
	// 只在需要时加载图片处理库
	const sharp = await import('sharp');
	return sharp(file).resize(200, 200).toBuffer();
}

// ✅ 条件加载
if (process.env.NODE_ENV === 'development') {
	import('why-did-you-render').then(whyDidYouRender => {
		whyDidYouRender(React);
	});
}
```

### 6.4 移除未使用的依赖

```bash
# 安装 depcheck
npm install -g depcheck

# 检查未使用的依赖
depcheck

# 输出示例：
# Unused dependencies
# * lodash
# * moment
#
# Missing dependencies
# * react-dom
```

---

## 依赖管理检查清单

### 添加依赖
- [ ] 评估必要性（不能用原生 API 实现）
- [ ] 检查包大小
- [ ] 检查维护状态
- [ ] 检查安全漏洞
- [ ] 考虑替代方案
- [ ] 团队讨论（大型依赖）

### 版本管理
- [ ] 使用语义化版本
- [ ] 锁定关键依赖版本
- [ ] 提交 package-lock.json
- [ ] 生产和开发依赖分类正确

### 安全
- [ ] 每周运行 npm audit
- [ ] 启用 Dependabot
- [ ] 及时修复安全漏洞
- [ ] 使用 Snyk 监控

### 维护
- [ ] 定期检查过时依赖
- [ ] 每月更新小版本
- [ ] 大版本更新充分测试
- [ ] 移除未使用的依赖
- [ ] 监控 bundle 大小

---

## 常用命令速查

```bash
# 依赖安装
npm install <package>          # 安装生产依赖
npm install -D <package>       # 安装开发依赖
npm ci                         # CI 环境安装

# 依赖更新
npm update                     # 更新所有依赖
npm update <package>           # 更新特定依赖
npm outdated                   # 查看过时依赖
ncu -u                         # 更新 package.json

# 安全审计
npm audit                      # 审计漏洞
npm audit fix                  # 自动修复
snyk test                      # Snyk 扫描

# 依赖分析
npm ls                         # 查看依赖树
npm ls <package>               # 查看特定依赖
depcheck                       # 检查未使用依赖
cost-of-modules                # 依赖成本分析
```

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整依赖管理规范 |
