# Git 使用规范

> 版本: v2.0
> 更新日期: 2026-01-20

本文档定义 FlexiStaff 项目的 Git 版本控制规范。

---

## 目录

1. [分支策略](#1-分支策略)
2. [提交规范](#2-提交规范)
3. [Pull Request 流程](#3-pull-request-流程)
4. [代码审查](#4-代码审查)
5. [常用命令](#5-常用命令)

---

## 1. 分支策略

### 1.1 分支类型

| 分支类型 | 命名格式 | 用途 | 生命周期 |
|---------|---------|------|---------|
| **main** | `main` | 生产环境代码 | 永久 |
| **develop** | `develop` | 开发主分支 | 永久 |
| **feature** | `feature/描述` | 新功能开发 | 临时 |
| **bugfix** | `bugfix/描述` | Bug 修复 | 临时 |
| **hotfix** | `hotfix/描述` | 紧急修复 | 临时 |
| **release** | `release/版本号` | 发布准备 | 临时 |

### 1.2 分支命名规范

```bash
# ✅ 好的分支名
feature/user-authentication
feature/booking-calendar
bugfix/login-validation-error
hotfix/payment-security-issue
release/v1.2.0

# ❌ 不好的分支名
my-branch
test
fix
new-stuff
```

### 1.3 分支工作流

```
main (生产环境)
  ↑
  ├─ hotfix/critical-bug → (紧急修复) → merge back to main & develop
  │
develop (开发主分支)
  ↑
  ├─ feature/user-auth → (完成) → merge to develop
  ├─ feature/booking   → (完成) → merge to develop
  ├─ bugfix/login-bug  → (完成) → merge to develop
  │
release/v1.2.0 → (测试通过) → merge to main → tag v1.2.0
```

### 1.4 创建分支

```bash
# 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 从 main 创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix
```

---

## 2. 提交规范

### 2.1 提交消息格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| **feat** | 新功能 | `feat(auth): add user login` |
| **fix** | Bug 修复 | `fix(booking): correct date validation` |
| **docs** | 文档更新 | `docs: update API documentation` |
| **style** | 代码格式（不影响功能） | `style: format code with prettier` |
| **refactor** | 重构（不是新功能也不是修 bug） | `refactor(user): simplify user service` |
| **perf** | 性能优化 | `perf(api): improve query performance` |
| **test** | 添加或修改测试 | `test(booking): add unit tests` |
| **chore** | 构建过程或辅助工具变动 | `chore: update dependencies` |
| **ci** | CI 配置文件和脚本变动 | `ci: add GitHub Actions workflow` |

### 2.3 Scope 范围

```
auth      - 认证相关
booking   - 预订相关
user      - 用户相关
ui        - UI 组件
api       - API 相关
db        - 数据库相关
```

### 2.4 提交示例

```bash
# ✅ 好的提交消息
feat(auth): add JWT token authentication

Implement JWT-based authentication with access and refresh tokens.
- Add token generation and verification
- Implement refresh token rotation
- Add authentication middleware

Closes #123

# ✅ 简单提交
fix(booking): correct timezone handling

# ✅ 破坏性变更
feat(api): change user API response format

BREAKING CHANGE: User API now returns snake_case fields instead of camelCase

# ❌ 不好的提交消息
update stuff
fix bug
changes
WIP
```

### 2.5 提交原则

```bash
# ✅ 原子提交（每次提交只做一件事）
git commit -m "feat(auth): add login endpoint"
git commit -m "feat(auth): add logout endpoint"
git commit -m "test(auth): add auth integration tests"

# ❌ 避免：大杂烩提交
git commit -m "add login, fix bugs, update docs, refactor code"

# ✅ 提交前检查
git diff                     # 查看修改
git add -p                   # 交互式添加（选择性提交）
git status                   # 确认状态
git commit                   # 提交
```

---

## 3. Pull Request 流程

### 3.1 创建 PR 前

```bash
# 1. 确保分支最新
git checkout develop
git pull origin develop

# 2. 切换到功能分支并 rebase
git checkout feature/user-auth
git rebase develop

# 3. 解决冲突（如果有）
# 编辑冲突文件
git add <resolved-files>
git rebase --continue

# 4. 运行测试
npm run test
npm run lint
npm run type-check

# 5. 推送分支
git push origin feature/user-auth
```

### 3.2 PR 标题格式

```
[Type] Brief description

示例：
[Feature] Add user authentication
[Bugfix] Fix booking date validation
[Refactor] Simplify user service
[Hotfix] Fix critical security vulnerability
```

### 3.3 PR 描述模板

```markdown
## 📝 Description
Brief description of the changes

## 🎯 Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation update
- [ ] Performance improvement

## 📋 Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No linter errors

## 🧪 Testing
Describe how to test the changes

## 📸 Screenshots (if applicable)
Add screenshots for UI changes

## 🔗 Related Issues
Closes #123
Related to #456

## 📌 Additional Notes
Any additional information
```

### 3.4 PR 大小

```
✅ 小型 PR（推荐）
- 文件修改数: < 10
- 代码行数: < 500
- 审查时间: 15-30 分钟

⚠️ 中型 PR
- 文件修改数: 10-20
- 代码行数: 500-1000
- 审查时间: 1-2 小时

❌ 大型 PR（应拆分）
- 文件修改数: > 20
- 代码行数: > 1000
- 审查时间: > 2 小时
```

---

## 4. 代码审查

### 4.1 审查者职责

**必须检查：**
- [ ] 代码功能正确
- [ ] 遵循编码规范
- [ ] 无明显安全漏洞
- [ ] 有适当的测试
- [ ] 有必要的注释
- [ ] 无硬编码敏感信息

**可选检查：**
- [ ] 性能优化建议
- [ ] 更好的实现方式
- [ ] 代码简化建议

### 4.2 审查反馈

```markdown
# ✅ 建设性反馈
**Suggestion:** Consider using `useMemo` here to optimize performance

```typescript
// Before
const total = items.reduce((sum, item) => sum + item.price, 0);

// Suggested
const total = useMemo(
	() => items.reduce((sum, item) => sum + item.price, 0),
	[items]
);
```

**Reasoning:** This calculation runs on every render, which could be expensive for large lists.

# ❌ 不好的反馈
This is wrong.
Bad code.
Why did you do it this way?
```

### 4.3 审查标签

使用标签标记评论重要性：

- **[MUST]** - 必须修改
- **[SHOULD]** - 建议修改
- **[QUESTION]** - 疑问
- **[NITPICK]** - 小建议（可选）
- **[PRAISE]** - 表扬

```markdown
**[MUST]** Security issue: User input is not validated

**[SHOULD]** Consider extracting this to a separate function

**[QUESTION]** Why are we using setTimeout here?

**[NITPICK]** Missing trailing comma

**[PRAISE]** Excellent error handling! 👍
```

### 4.4 批准标准

**批准前确保：**
1. 所有 **[MUST]** 问题已解决
2. CI/CD 检查全部通过
3. 至少 1 位审查者批准（关键功能需要 2 位）
4. 无未解决的对话

---

## 5. 常用命令

### 5.1 日常操作

```bash
# 查看状态
git status

# 查看修改
git diff                    # 工作区 vs 暂存区
git diff --staged           # 暂存区 vs 最后一次提交
git diff develop            # 当前分支 vs develop

# 添加文件
git add <file>              # 添加特定文件
git add .                   # 添加所有修改
git add -p                  # 交互式添加

# 提交
git commit -m "message"     # 提交
git commit --amend          # 修改最后一次提交
git commit --amend --no-edit # 修改最后一次提交（不改消息）

# 推送
git push origin <branch>    # 推送到远程
git push -f origin <branch> # 强制推送（谨慎使用！）

# 拉取
git pull origin <branch>    # 拉取并合并
git pull --rebase origin <branch> # 拉取并 rebase
```

### 5.2 分支操作

```bash
# 创建分支
git checkout -b feature/new-feature

# 切换分支
git checkout develop

# 查看分支
git branch                  # 本地分支
git branch -a               # 所有分支（包括远程）

# 删除分支
git branch -d feature/old   # 删除本地分支
git push origin --delete feature/old # 删除远程分支

# Rebase
git rebase develop          # 将当前分支 rebase 到 develop
git rebase -i HEAD~3        # 交互式 rebase 最近 3 次提交
```

### 5.3 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file>      # 撤销文件修改
git checkout .              # 撤销所有修改

# 撤销暂存
git reset HEAD <file>       # 取消暂存特定文件
git reset HEAD              # 取消所有暂存

# 撤销提交
git reset --soft HEAD~1     # 撤销提交，保留修改（暂存）
git reset --mixed HEAD~1    # 撤销提交，保留修改（未暂存）
git reset --hard HEAD~1     # 撤销提交，丢弃修改（危险！）

# Revert（推荐用于已推送的提交）
git revert <commit-hash>    # 创建新提交来撤销指定提交
```

### 5.4 查看历史

```bash
# 查看提交历史
git log                     # 完整历史
git log --oneline           # 简洁模式
git log --graph --oneline --all # 图形化显示所有分支

# 查看特定文件历史
git log -- <file>

# 查看谁修改了某行代码
git blame <file>

# 搜索提交
git log --grep="keyword"    # 搜索提交消息
git log -S "function name"  # 搜索代码变更
```

### 5.5 储藏（Stash）

```bash
# 储藏当前修改
git stash                   # 储藏
git stash save "message"    # 储藏并添加消息

# 查看储藏列表
git stash list

# 应用储藏
git stash pop               # 应用最新储藏并删除
git stash apply stash@{0}   # 应用特定储藏（不删除）

# 删除储藏
git stash drop stash@{0}    # 删除特定储藏
git stash clear             # 清空所有储藏
```

---

## Git 工作流检查清单

### 开始新任务
- [ ] 从最新的 develop 创建分支
- [ ] 分支命名符合规范
- [ ] 理解需求和验收标准

### 开发过程
- [ ] 经常提交（小步快跑）
- [ ] 提交消息符合规范
- [ ] 定期 rebase develop 避免冲突

### 提交 PR 前
- [ ] 代码自审
- [ ] 运行所有测试
- [ ] 运行 linter
- [ ] Rebase 最新的 develop
- [ ] PR 描述完整

### 代码审查
- [ ] 及时响应审查意见
- [ ] 修改后通知审查者
- [ ] 所有对话已解决
- [ ] CI 检查通过

### 合并后
- [ ] 删除功能分支
- [ ] 更新本地 develop
- [ ] 通知相关人员

---

## 禁止操作

❌ **绝对禁止：**
- `git push -f origin main`（强制推送到 main）
- `git reset --hard`（在公共分支）
- 修改已推送的提交历史（除非团队协商）
- 提交大文件（> 10MB）
- 提交敏感信息（密码、密钥等）

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-20 | 新增完整 Git 使用规范 |
