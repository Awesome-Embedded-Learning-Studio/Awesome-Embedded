# Embedded Tutorial Repository Setup Script — 使用教程

---

## TR; DR

直接执行这个脚本即可，下面的部分是具体的说明

## 概览

该脚本用于在 Windows 环境下交互式创建一个用于嵌入式系统教学/实验的仓库目录结构（包含 `software_codes`、`hardware_asset`、`documents`、可选的 `tutorial` 等），并自动生成 `README.md`、`LICENSE`、`.gitignore`（可选）等常用文件。脚本包含取消（Ctrl+C）回滚逻辑、输入校验、路径检测与写权限测试、以及可选的 Git 初始化流程。

## 前提条件

1. Windows（PowerShell 环境）。建议使用 Windows PowerShell 5.1 或 PowerShell 7+。
2. 若要使用脚本内的 Git 初始化功能，请先安装并配置 Git（可选）。
3. 需要对目标路径具有写权限。
4. 如果在受限策略下运行，可能需要以管理员权限或通过 `-ExecutionPolicy Bypass` 运行脚本。

## 保存脚本

将你提供的脚本内容保存为 `setup-embedded-repo.ps1`（或你喜欢的文件名，以 `.ps1` 结尾）。示例：

1. 在记事本或 VSCode 中新建文件，粘贴脚本内容。
2. 保存为 `setup-embedded-repo.ps1`。

## 如何运行

### 交互式运行（推荐）

在 PowerShell 窗口中运行：

```powershell
# 当前目录下运行（如果脚本与当前工作目录不同，请 cd 到脚本所在目录或使用完整路径）
powershell -ExecutionPolicy Bypass -File .\setup-embedded-repo.ps1
```

或者在 PowerShell (已切换到脚本所在目录) 里：

```powershell
./setup-embedded-repo.ps1
```

> 注意：如果出现执行策略阻止运行的错误，请使用 `-ExecutionPolicy Bypass` 或先运行 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`（需谨慎）。

### 非交互或自动化运行（高级用法）

脚本为交互式设计，直接自动化需要对源码做小改动（例如通过参数或预先设置变量来跳过 `Read-Host`）。如果你希望我提供非交互脚本版本，我可以基于当前脚本生成一个支持命令行参数的版本。

## 脚本行为详解（关键段落说明）

下面按脚本执行流程逐步讲解，便于理解与调试。

### 1. Ctrl+C / 退出时的回滚 `Cleanup-OnCancel`

* 脚本注册了 `PowerShell.Exiting` 事件，并绑定 `Cleanup-OnCancel` 函数。该函数在脚本被中断（如 Ctrl+C）或 PowerShell 退出时询问是否回滚（删除已创建的项目目录）。
* 回滚逻辑：如果用户确认，脚本会删除整个 `$script:projectPath` 目录（强制递归删除）。如果不确认，则保留已创建内容。
* 注意：在某些 PowerShell 版本或运行环境（比如某些 CI 容器）中，事件处理语义略有差异，测试退出行为以验证回滚是否按预期触发。

### 2. 选择项目路径与权限检测

* 脚本允许在当前目录创建项目或指定一个自定义路径。
* 若自定义路径不存在，脚本会询问是否创建目录。
* 为判断目标目录是否可写，脚本会创建临时文件（`.write_test_<随机>`）并马上删除。
* 若没有写权限，会提示并要求输入其它路径。

### 3. 项目名校验与目录创建

* 要求输入非空的 `projectName`，并会确保目标目录不存在（避免覆盖现有目录）。
* 若目录已存在，脚本会失败并退出（以避免误删数据）。

### 4. 创建标准目录结构

脚本默认创建并初始化：

* `software_codes/`（含 `index.md`）—— 放置代码示例与工程代码。
* `hardware_asset/`（含 `index.md`）—— 放置 PCB、原理图、Gerber 等硬件文件。
* `documents/`（含 `index.md`）—— 放置设计文档、规范、笔记。
* 可选 `tutorial/`（含 `index.md`）—— 教学用的教程材料（通过交互询问是否要创建）。

这些 `index.md` 文件为空白（占位），便于后续用 MkDocs、GitHub Pages 或静态站点生成工具直接使用。

### 5. 生成 LICENSE（MIT）

* 脚本会要求输入作者名（英文），并创建带年份与作者的 `LICENSE` 文件，内容为 MIT 协议模版。
* 若你需要其它许可证模版（例如 Apache-2.0、GPLv3），可以手动替换 `LICENSE` 文件，或我可以帮你把脚本改为支持多种 License 选择。

### 6. 生成 README.md

* 脚本会基于项目名、作者与邮箱生成一个基础 `README.md`，包含项目结构概览与快速说明。
* `README.md` 内有示例链接（相对路径）方便初次浏览者了解结构。

### 7. Git 初始化

* 脚本会询问是否初始化 Git 仓库；如果选择 `y`：

  * 运行 `git init`（要求环境中已安装 Git）。
  * 创建基础 `.gitignore`（包含常见构建文件、IDE 临时文件与系统文件）。
* 如果 Git 不可用或初始化失败，脚本会给出警告并继续（不停止整个流程）。

## 样例交互（示例）

下面是一个模拟的交互步骤（你的输入以 `>` 表示）：

```
========================================
  Embedded Project Repository Setup
========================================

📂 Select project creation location
   Current directory: C:\Users\you\projects
Create project in current directory? (y/n)
> n
📝 Enter the full path where you want to create the project
> C:\Users\you\workspaces
✅ Using directory: C:\Users\you\workspaces

📝 Enter the project name (Tutorial Name)
> Awesome-Embedded-Tutorial
✅ Created project directory: Awesome-Embedded-Tutorial

📁 Creating 'software_codes' folder...
   Purpose: This folder will store all software code files
✅ Created successfully

...

📝 Enter the author's name (in English) for MIT License
> ChenGuanhao
📧 Enter the author's email address
> charlie@example.com

✅ Created README.md

🔧 Do you want to initialize a Git repository? (y/n)
> y
✅ Git repository initialized successfully!
✅ Created .gitignore file

🎉 All done! Your embedded tutorial repository is ready.
📂 Navigate to: cd Awesome-Embedded-Tutorial
```

## 常见问题与排错指南

1. **脚本运行时报错：`ExecutionPolicy` 阻止脚本运行。**

   * 解决方法：以管理员权限运行 PowerShell 或使用：

     ```powershell
     powershell -ExecutionPolicy Bypass -File .\setup-embedded-repo.ps1
     ```

2. **无写权限或 `New-Item` 权限不足。**

   * 确认目标路径是否为系统保护目录（如 `C:\Windows`）或网络盘权限受限。
   * 尝试以更高权限（管理员）运行，或选择用户目录下的路径（如 `C:\Users\<you>\Projects`）。

3. **`git init` 失败或 `git` 未找到。**

   * 安装 Git（[https://git-scm.com/），并确保](https://git-scm.com/），并确保) `git` 可在命令行中执行。

4. **脚本中断后未触发回滚（Cleanup-OnCancel）。**

   * 事件处理在不同 PowerShell 版本上可能表现不同。你可以手动删除项目目录，或改写回滚逻辑为在捕获 `Ctrl+C` 时直接调用 `Cleanup-OnCancel`。

5. **想要自定义生成的 README 或 LICENSE 模板。**

   * 直接修改脚本中 `$readme` 或 `$mitLicense` 多行字符串，或者将模板外置为 `.tpl` 文件从脚本中读取。

## 可选增强建议（供脚本改进）

* **参数化运行模式**：支持 `-ProjectPath`, `-ProjectName`, `-Author`, `-Email`, `-SkipGit` 等参数，实现无交互运行。
* **选择 License 模版**：通过参数或菜单支持 MIT / Apache-2.0 / GPLv3 等许可证选择。
* **自动初始化 README 内容**：基于 `projectName` 生成更详细的 README 结构（例如贡献指南、目录树、示例命令）。
* **集成 MkDocs / Docusaurus 模板**：自动产生 `mkdocs.yml` 或 `docusaurus` 配置，以便一键发布文档站点。
* **模板化 index.md**：在 `software_codes/index.md`、`tutorial/index.md` 中插入示例目录结构和使用指南。
* **安全回滚策略**：在删除前列出将要删除的文件清单并要求更明确的确认。

## 输出示例（执行后目录树）

```
Awesome-Embedded-Tutorial/
├─ software_codes/
│  └─ index.md
├─ hardware_asset/
│  └─ index.md
├─ documents/
│  └─ index.md
├─ tutorial/  (如果选择创建)
│  └─ index.md
├─ README.md
├─ LICENSE
└─ .gitignore  (如果初始化 Git)
```