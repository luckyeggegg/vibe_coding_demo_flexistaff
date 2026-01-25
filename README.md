# FlexiStaff - Casual Staff Management Platform

> 澳洲中小型企业兼职/临时员工资源管理平台  
> **项目状态**: 开发中 | **目标市场**: 澳洲 (Australia) | **使用范围**: 企业内部系统

---

## 📋 项目概述

FlexiStaff 是一个面向澳洲中小型企业（500人以内）的兼职/临时员工 (Casual Staff) 资源管理平台，旨在帮助全职员工快速查询、预定兼职资源，并实现自动化的排班协调与数据分析。

### 核心功能
- 🔍 **实时可用性查询** - 按日期、时间、技能查询兼职员工
- ✅ **一键预定确认** - 自动发送通知邮件
- ⚠️ **智能冲突检测** - 自动检测排班冲突
- 📅 **个人日程管理** - 兼职员工自主管理可用时间
- 📊 **数据报表分析** - 资源使用率、成本分析

---

## 🗂️ 文档结构

```
FlexiStaff/
├── README.md                          # 📍 当前文档 - 项目总览和索引
├── PRD_landing_page.md                # 📄 产品需求文档
├── design/                            # 🎨 设计文档
│   ├── README.md                      # 设计文档目录
│   ├── design-system.md               # 完整设计系统
│   └── color-palette.md               # 色彩快速参考
└── rules/                             # 📏 编码规范
    ├── README.md                      # 规范文档总览
    ├── coding_rules.md                # SOLID、KISS、DRY 原则
    ├── coding-standards.md            # 核心编码标准
    ├── security.md                    # 安全规范
    ├── testing.md                     # 测试规范
    ├── error-handling.md              # 错误处理规范
    ├── performance.md                 # 性能规范
    ├── dependencies.md                # 依赖管理规范
    ├── frontend/                      # 前端开发规范
    │   ├── component.md               # React 组件规范
    │   ├── styling.md                 # 样式规范 (Tailwind CSS)
    │   └── state.md                   # 状态管理规范
    ├── backend/                       # 后端开发规范
    │   ├── api-design.md              # API 设计规范
    │   ├── database.md                # 数据库使用规范
    │   └── platform-adapter.md        # 平台适配器规范
    └── workflow/                      # 工作流规范
        ├── git.md                     # Git 使用规范
        └── ci-cd.md                   # CI/CD 流程规范
```

---

## 🚀 快速开始

### 新成员入职

#### 1. 了解项目
📄 **阅读顺序**:
1. [项目概述](#项目概述) (本文档)
2. [产品需求文档](./PRD_landing_page.md) - 了解产品定位和功能
3. [设计系统](./design/design-system.md) - 了解视觉设计规范

#### 2. 学习编码规范
📏 **必读文档**:
1. [编码规范总览](./rules/README.md) - 规范体系概览
2. [核心原则](./rules/coding_rules.md) - SOLID、KISS、DRY
3. [编码标准](./rules/coding-standards.md) - 命名、类型、注释、代码风格

#### 3. 根据角色阅读对应规范

**前端开发者** 👨‍💻:
- [React 组件开发规范](./rules/frontend/component.md)
- [样式编写规范](./rules/frontend/styling.md)
- [状态管理规范](./rules/frontend/state.md)
- [设计系统](./design/design-system.md)

**后端开发者** 👩‍💻:
- [API 设计规范](./rules/backend/api-design.md)
- [数据库使用规范](./rules/backend/database.md)
- [平台适配器规范](./rules/backend/platform-adapter.md)

**全栈开发者** 🦄:
- 阅读前端 + 后端所有规范

**所有开发者必读** ⭐:
- [安全规范](./rules/security.md)
- [测试规范](./rules/testing.md)
- [错误处理规范](./rules/error-handling.md)
- [Git 使用规范](./rules/workflow/git.md)

---

## 📚 文档导航

### 📄 产品与设计

| 文档 | 说明 | 适用人员 |
|------|------|---------|
| [PRD - Landing Page](./PRD_landing_page.md) | Landing Page 产品需求文档，包含功能定义、用户流程、系统架构 | 全员 |
| [设计系统](./design/design-system.md) | 完整设计系统：莫兰迪色系、字体、间距、组件规范、Tailwind 配置 | 设计师、前端开发 |
| [色彩快速参考](./design/color-palette.md) | 色彩调色板快速查询，包含使用示例和代码 | 设计师、前端开发 |

### 📏 编码规范 - 核心原则

| 文档 | 说明 | 重点内容 |
|------|------|---------|
| [规范总览](./rules/README.md) | 所有编码规范的索引和导航 | 文档结构、快速查找 |
| [SOLID/KISS/DRY 原则](./rules/coding_rules.md) | 三大核心原则详解 | 单一职责、开闭原则、保持简单、避免重复 |
| [核心编码标准](./rules/coding-standards.md) | 命名、类型、注释、代码风格、**文件长度限制** | **文件不超过 1000 行**、命名规范、TypeScript 类型规范 |

### 🔒 质量保障

| 文档 | 说明 | 关键规范 |
|------|------|---------|
| [安全规范](./rules/security.md) | 敏感信息管理、认证授权、输入验证 | 禁止硬编码敏感信息、使用环境变量、SSO 集成 |
| [测试规范](./rules/testing.md) | TDD、单元测试、集成测试、E2E 测试 | 测试驱动开发、测试覆盖率要求 |
| [错误处理规范](./rules/error-handling.md) | 错误类型、日志规范、用户反馈 | 显式错误处理、自定义错误类 |
| [性能规范](./rules/performance.md) | 性能边界、优化策略、监控 | 响应时间要求、性能预算 |
| [依赖管理规范](./rules/dependencies.md) | 依赖选型、版本控制、安全审计 | 最小化依赖、定期审计 |

### 💻 前端开发规范

| 文档 | 说明 | 核心内容 |
|------|------|---------|
| [React 组件开发](./rules/frontend/component.md) | 组件结构、Props 设计、状态管理、生命周期 | 组件拆分、Hooks 使用、性能优化 |
| [样式编写规范](./rules/frontend/styling.md) | Tailwind CSS 使用、响应式设计、主题系统 | 莫兰迪色系应用、组件样式、动画过渡 |
| [状态管理规范](./rules/frontend/state.md) | 本地状态、全局状态、服务器状态、URL 状态 | useState、Zustand、TanStack Query |

### 🔧 后端开发规范

| 文档 | 说明 | 核心内容 |
|------|------|---------|
| [API 设计规范](./rules/backend/api-design.md) | RESTful API 设计、URL 命名、状态码 | URL 设计、HTTP 方法、错误响应、分页 |
| [数据库使用规范](./rules/backend/database.md) | Prisma ORM、查询优化、事务处理 | Schema 设计、索引策略、N+1 问题 |
| [平台适配器规范](./rules/backend/platform-adapter.md) | 存储、通知、支付等适配器模式 | 依赖倒置、工厂模式、环境配置 |

### 🔄 工作流规范

| 文档 | 说明 | 核心内容 |
|------|------|---------|
| [Git 使用规范](./rules/workflow/git.md) | 分支策略、提交规范、PR 流程、代码审查 | Git Flow、Conventional Commits、PR 模板 |
| [CI/CD 流程规范](./rules/workflow/ci-cd.md) | 持续集成、持续部署、回滚方案 | 自动化测试、部署策略、监控告警 |

---

## 🔍 快速查找指南

### 我想知道...

| 问题 | 查看文档 | 章节 |
|------|---------|------|
| **文件太大如何拆分？** | [核心编码标准](./rules/coding-standards.md#43-文件长度限制) | 4.3 文件长度限制 |
| **如何命名变量/函数/类？** | [核心编码标准](./rules/coding-standards.md#1-命名规范) | 1. 命名规范 |
| **TypeScript 类型怎么写？** | [核心编码标准](./rules/coding-standards.md#2-typescript-类型规范) | 2. TypeScript 类型规范 |
| **如何管理敏感信息？** | [安全规范](./rules/security.md#1-敏感信息管理) | 1. 敏感信息管理 |
| **如何处理错误？** | [错误处理规范](./rules/error-handling.md) | 全文 |
| **如何编写测试？** | [测试规范](./rules/testing.md) | 全文 |
| **如何拆分 React 组件？** | [React 组件开发](./rules/frontend/component.md#6-组件拆分) | 6. 组件拆分 |
| **Tailwind CSS 如何使用？** | [样式编写规范](./rules/frontend/styling.md) | 全文 |
| **如何设计 API？** | [API 设计规范](./rules/backend/api-design.md) | 全文 |
| **数据库查询如何优化？** | [数据库使用规范](./rules/backend/database.md#2-查询优化) | 2. 查询优化 |
| **Git 分支如何管理？** | [Git 使用规范](./rules/workflow/git.md#1-分支策略) | 1. 分支策略 |
| **代码如何提交？** | [Git 使用规范](./rules/workflow/git.md#2-提交规范) | 2. 提交规范 |
| **色彩如何搭配？** | [色彩快速参考](./design/color-palette.md) | 全文 |
| **设计规范是什么？** | [设计系统](./design/design-system.md) | 全文 |

### 按场景查找

#### 🎨 开始设计
1. [设计系统](./design/design-system.md) - 了解完整设计规范
2. [色彩快速参考](./design/color-palette.md) - 查询颜色代码
3. [PRD 文档](./PRD_landing_page.md) - 了解功能需求

#### 💻 开始编码
1. [核心编码标准](./rules/coding-standards.md) - 掌握基础规范
2. [前端/后端规范](./rules/) - 查阅对应的技术规范
3. [安全规范](./rules/security.md) - 确保安全性

#### ✅ 提交代码前
1. [代码审查清单](./rules/README.md#代码审查清单) - 自检
2. [Git 使用规范](./rules/workflow/git.md#3-pull-request-流程) - PR 流程
3. [测试规范](./rules/testing.md) - 确保测试通过

#### 🐛 遇到问题
1. [错误处理规范](./rules/error-handling.md) - 如何处理错误
2. [性能规范](./rules/performance.md) - 性能问题排查
3. [Git 使用规范](./rules/workflow/git.md#5-常用命令) - Git 命令参考

---

## 📐 核心规范速查

### 代码质量标准

| 规范 | 要求 | 文档 |
|------|------|------|
| **文件长度** | **≤ 1000 行（强制）** | [编码标准](./rules/coding-standards.md#43-文件长度限制) |
| **函数长度** | ≤ 50 行 | [编码标准](./rules/coding-standards.md) |
| **嵌套深度** | ≤ 3 层 | [编码标准](./rules/coding-standards.md) |
| **参数数量** | ≤ 3 个 | [编码标准](./rules/coding-standards.md) |
| **测试覆盖率** | 业务逻辑 ≥ 80% | [测试规范](./rules/testing.md#5-测试覆盖率) |
| **API 响应时间** | < 500ms | [性能规范](./rules/performance.md#2-性能边界) |

### 必须遵守的原则

- ✅ **所有导出值必须有显式类型** (TypeScript)
- ❌ **禁止使用 `any` 类型**（除非白名单）
- ❌ **禁止硬编码敏感信息**（API 密钥、密码等）
- ✅ **所有错误必须显式处理**
- ✅ **代码文件不得超过 1000 行**
- ✅ **遵循 Conventional Commits 提交规范**

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + Next.js
- **语言**: TypeScript
- **样式**: Tailwind CSS (莫兰迪色系)
- **状态管理**: Zustand + TanStack Query
- **UI 组件**: Headless UI / Radix UI

### 后端
- **语言**: TypeScript / Node.js
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: Azure AD / Okta SSO

### 开发工具
- **包管理**: npm
- **代码质量**: ESLint + Prettier
- **测试**: Vitest + Playwright
- **版本控制**: Git (Git Flow)
- **CI/CD**: GitHub Actions

---

## 🎨 设计风格

**简约现代 + 莫兰迪色系**

- **主色调**: 莫兰迪蓝 (#7C9CB5)
- **辅助色**: 莫兰迪绿/橙/红/紫
- **设计理念**: 功能优先、视觉舒适、一致性、可访问性
- **字体**: Inter
- **间距系统**: 8px 基准网格

👉 详见 [设计系统文档](./design/design-system.md)

---

## 📝 提交代码前检查清单

### 代码质量
- [ ] **文件长度 ≤ 1000 行**
- [ ] 遵循命名规范
- [ ] 所有导出值有显式类型
- [ ] 无 `any` 类型
- [ ] 无硬编码敏感信息
- [ ] 函数长度 ≤ 50 行
- [ ] 嵌套深度 ≤ 3 层

### 测试与文档
- [ ] 有单元测试
- [ ] 测试通过
- [ ] 复杂逻辑有注释
- [ ] 公共 API 有 JSDoc

### Git 提交
- [ ] 提交消息符合 Conventional Commits
- [ ] 分支命名符合规范
- [ ] PR 描述完整
- [ ] 代码已自审

### 安全与性能
- [ ] 输入已验证
- [ ] 错误已处理
- [ ] 无明显性能问题
- [ ] 通过 ESLint 检查

👉 完整清单见 [代码审查清单](./rules/README.md#代码审查清单)

---

## 🔗 外部资源

### 设计参考
- [Figma 设计文件](#) (待创建)
- [Lucide Icons](https://lucide.dev/)
- [Inter 字体](https://fonts.google.com/specimen/Inter)

### 技术文档
- [React 官方文档](https://react.dev/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)

### 规范参考
- [Conventional Commits](https://www.conventionalcommits.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Australian Privacy Principles](https://www.oaic.gov.au/privacy/australian-privacy-principles)

---

## 👥 团队协作

### 沟通渠道
- **代码相关**: GitHub Issues / Pull Requests
- **设计讨论**: 设计评审会议
- **技术问题**: 技术分享会
- **日常沟通**: Slack / Teams

### 会议
- **每日站会**: 同步进度和阻碍
- **Sprint Planning**: 规划迭代任务
- **Code Review**: 代码审查
- **Retrospective**: 回顾改进

---

## 📞 联系方式

### 遇到问题？

| 问题类型 | 联系方式 |
|---------|---------|
| **技术问题** | 技术负责人 / 开发团队 |
| **设计问题** | 设计团队 |
| **产品问题** | 产品经理 |
| **规范疑问** | 在团队会议讨论 |

---

## 📈 项目状态

### 当前阶段
🔵 **需求分析与设计阶段**

### 已完成
- ✅ Landing Page PRD 文档
- ✅ 完整设计系统（莫兰迪色系）
- ✅ 编码规范体系（16 个文档）
- ✅ 项目文档索引

### 进行中
- 🔄 Figma 设计稿制作
- 🔄 技术栈搭建
- 🔄 开发环境配置

### 下一步
- ⏳ Landing Page 开发
- ⏳ Dashboard 设计与开发
- ⏳ 核心功能开发

---

## 📅 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0 | 2026-01-20 | 创建项目文档索引 README，整合所有文档导航 |

---

## 📄 许可证

**Internal Use Only** - 企业内部系统，仅供公司内部使用

---

**FlexiStaff** - Simplify Casual Staff Management  
© 2026 [Company Name] - All Rights Reserved
