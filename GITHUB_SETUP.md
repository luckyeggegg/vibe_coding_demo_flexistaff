# GitHub 仓库设置指南

## ✅ 已完成的步骤

1. ✅ 创建了 `.gitignore` 文件
2. ✅ 初始化了 Git 仓库 (`git init`)
3. ✅ 添加了所有文件 (`git add .`)
4. ✅ 创建了初始提交 (`git commit`)

## 📋 接下来需要执行的步骤

### 步骤 1: 在 GitHub 上创建新仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 **"+"** 按钮，选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `flexistaff` (或您喜欢的名称)
   - **Description**: `Casual Staff Management Platform for Australian SMEs`
   - **Visibility**: 选择 **Public** 或 **Private**
   - ⚠️ **重要**: **不要**勾选以下选项：
     - ❌ "Add a README file"
     - ❌ "Add .gitignore"
     - ❌ "Choose a license"
   - (因为本地已有这些文件)
4. 点击 **"Create repository"**

### 步骤 2: 关联远程仓库并推送

在项目根目录执行以下命令（请将 `YOUR_USERNAME` 替换为您的 GitHub 用户名）：

```bash
# 1. 添加远程仓库（替换 YOUR_USERNAME 和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/flexistaff.git

# 2. 查看远程仓库是否添加成功
git remote -v

# 3. 推送到 GitHub（首次推送）
git push -u origin main
```

**如果您的默认分支是 `master` 而不是 `main`，使用：**
```bash
git push -u origin master
```

### 步骤 3: 验证推送结果

1. 在浏览器中访问您的 GitHub 仓库页面
2. 确认所有文件都已上传
3. 确认 README.md 正确显示

## 🔐 如果遇到认证问题

### 方法 1: 使用 Personal Access Token (推荐)

如果提示需要用户名和密码：

1. **创建 Personal Access Token**:
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 设置名称: `FlexiStaff Project`
   - 选择权限: 至少勾选 `repo` (完整仓库访问权限)
   - 点击 "Generate token"
   - **复制生成的 token**（只显示一次！）

2. **使用 token 推送**:
   ```bash
   # 当提示输入密码时，使用 token 而不是 GitHub 密码
   git push -u origin main
   # Username: 您的 GitHub 用户名
   # Password: 粘贴刚才复制的 token
   ```

### 方法 2: 使用 SSH (更安全，推荐长期使用)

1. **生成 SSH 密钥**（如果还没有）:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # 按 Enter 使用默认路径
   # 设置密码（可选）
   ```

2. **复制公钥**:
   ```bash
   # Windows (Git Bash)
   cat ~/.ssh/id_ed25519.pub
   
   # 或使用
   clip < ~/.ssh/id_ed25519.pub
   ```

3. **添加到 GitHub**:
   - 访问: https://github.com/settings/keys
   - 点击 "New SSH key"
   - Title: `FlexiStaff Development`
   - Key: 粘贴刚才复制的公钥
   - 点击 "Add SSH key"

4. **使用 SSH URL 添加远程仓库**:
   ```bash
   # 先删除之前的 HTTPS 远程仓库
   git remote remove origin
   
   # 添加 SSH 远程仓库
   git remote add origin git@github.com:YOUR_USERNAME/flexistaff.git
   
   # 推送
   git push -u origin main
   ```

## 📝 常用 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull origin main

# 推送代码
git push origin main

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main
```

## ⚠️ 注意事项

1. **不要提交敏感信息**:
   - ✅ `.env` 文件已在 `.gitignore` 中
   - ✅ `node_modules/` 已忽略
   - ✅ 确保没有硬编码的 API 密钥

2. **提交规范**:
   - 遵循 Conventional Commits 格式
   - 详见: [`rules/workflow/git.md`](./rules/workflow/git.md)

3. **分支策略**:
   - `main` - 主分支（生产环境）
   - `develop` - 开发分支
   - `feature/*` - 功能分支
   - 详见: [`rules/workflow/git.md`](./rules/workflow/git.md#1-分支策略)

## 🎉 完成后的检查清单

- [ ] GitHub 仓库已创建
- [ ] 远程仓库已关联
- [ ] 代码已成功推送
- [ ] README.md 在 GitHub 上正确显示
- [ ] 所有文档文件都已上传
- [ ] `.gitignore` 正常工作（没有提交不必要的文件）

## 📞 遇到问题？

- **认证失败**: 检查用户名和 token/密码是否正确
- **推送被拒绝**: 检查远程仓库是否为空，或使用 `git push -u origin main --force`（谨慎使用）
- **网络问题**: 检查网络连接，或使用代理

---

**祝您上传顺利！** 🚀
