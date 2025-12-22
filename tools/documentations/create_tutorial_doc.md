# Embedded Tutorial Repository Setup Script — 使用说明（Markdown 教程）

## TR; DR

直接执行这个脚本即可，下面的部分是具体的说明

---

## 目录

* 简介
* 前提条件
* 安装与运行（演示命令）
* 交互式流程与示例会话
* 脚本行为详解（重要功能解读）
* 生成的目录结构与文件说明
* 自定义与自动化提示

---

# 简介

这个 PowerShell 脚本用于在目标路径下创建一个标准化的「嵌入式教程 / 教学仓库」结构（代码、硬件资源、文档、可选 tutorial 文件夹、LICENSE、README 等）。脚本为交互式：会询问项目名称、作者、是否初始化 Git 等，并提供中断（Ctrl+C）回滚选择，降低误操作风险。

---

# 前提条件

在运行脚本前请确认：

1. 你使用的是 Windows PowerShell 5.1 或 PowerShell 7+（脚本使用了常见的 PowerShell cmdlet 和 `Register-EngineEvent`，两者均支持）。
2. 如果希望在脚本内自动 `git init`，请确保 `git` 已安装并在 `PATH` 中（否则脚本会提示初始化失败但继续执行）。
3. 运行脚本时有对目标目录的写权限（脚本会尝试在指定目录创建文件/子目录）。
4. 执行策略允许脚本运行：如果被阻止，可在管理员 PowerShell 中运行：

   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```

   或在单次执行中使用绕过：

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup-embedded.ps1
   ```

---

# 安装与运行

1. 把脚本保存为：`setup-embedded.ps1`（或你喜欢的文件名）。
2. 打开 PowerShell（非受限执行策略，或使用 `-ExecutionPolicy Bypass`）。
3. 在脚本目录运行：

   ```powershell
   # 交互式运行
   powershell -ExecutionPolicy Bypass -File .\setup-embedded.ps1
   ```

   或（在 PowerShell 会话中）：

   ```powershell
   .\setup-embedded.ps1
   ```

> 脚本是纯交互式的 —— 它会逐步询问路径、项目名、作者、是否创建 tutorial、是否初始化 Git 等。

---

# 交互式流程与示例会话

脚本运行后会按照下面顺序与你交互（示例回答用 `>` 标注）：

1. 选择路径：是否在当前目录创建项目？
   `Create project in current directory? (y/n)`

   > `y`（或 `n` 并输入自定义路径）

2. 如果选择自定义路径：脚本会验证路径是否存在、是否可写，若不存在可选创建。

3. 输入项目名（Tutorial Name）：
   `📝 Enter the project name (Tutorial Name)`

   > `Awesome-Embedded-Tutorial`

4. 是否要创建 `tutorial` 文件夹？
   `Do you want to create a 'tutorial' folder? (y/n)`

   > `y`

5. 输入作者名（用于 LICENSE）：
   `📝 Enter the author's name (in English) for MIT License`

   > `Charlie Chen`

6. README 作者 email：
   `📧 Enter the author's email address`

   > `charlie@example.com`

7. 是否使用相同作者姓名写 README：
   `Use the same author name (...) for README? (y/n)`

   > `y`

8. 完成后，会询问是否初始化 Git：
   `🔧 Do you want to initialize a Git repository? (y/n)`

   > `y`

9. 如果中途按 **Ctrl+C**，脚本有中断处理，会询问是否回滚（删除已创建的文件夹）。

**示例完整命令行片段**（交互不展示输入）：

```text
========================================
  Embedded Project Repository Setup
========================================

📂 Select project creation location
   Current directory: C:\Users\you\workspace
Create project in current directory? (y/n) > y
📝 Enter the project name (Tutorial Name) > Awesome-Embedded-Tutorial
📁 Creating 'software_codes' folder...
✅ Created successfully
...
Do you want to initialize a Git repository? (y/n) > y
✅ Git repository initialized successfully!
🎉 All done! Your embedded tutorial repository is ready.
📂 Navigate to: cd Awesome-Embedded-Tutorial
```

---

# 脚本行为详解（重要功能解读）

* **安全回滚（Ctrl+C 处理）**
  脚本注册了 PowerShell 退出事件（`Register-EngineEvent -SourceIdentifier PowerShell.Exiting`），在被中断时调用 `Cleanup-OnCancel`，提示用户是否删除已创建的目录（回滚）。这是防止一半创建一半遗留脏数据的好方法。

* **目录验证与写权限检测**
  当用户输入自定义路径时，脚本会检查路径是否存在；若不存在可选择创建；若存在则尝试写入临时文件以检测写权限，避免后续创建失败。

* **交互式输入校验**
  对项目名、作者名、email 等做非空检查，确保关键元数据被填写。

* **生成的 MIT LICENSE**
  LICENSE 使用当前年份自动填充并写入 `LICENSE` 文件。

* **README 模板**
  写入一个基础 README（带项目名、创建时间、作者和联系方式）以及对目录的简单说明。你可在生成后手动补充“快速演示”等章节。

* **可选 Git 初始化**
  如果选择 `git init`，脚本会在项目根创建 `.gitignore`（包含常见嵌入式/IDE 忽略项）。如果系统没有 `git` 或初始化失败，脚本会提示并继续（不会中止整个过程）。

---

# 生成的目录结构（示范）

假设项目名为 `Awesome-Embedded-Tutorial`，脚本会创建如下结构：

```
Awesome-Embedded-Tutorial/
├─ software_codes/
│  └─ index.md
├─ hardware_asset/
│  └─ index.md
├─ documents/
│  └─ index.md
├─ tutorial/           # 可选
│  └─ index.md
├─ LICENSE
├─ README.md
└─ .gitignore          # 如果选择初始化 git
```

**每个文件用途说明**

* `software_codes/index.md`：放置代码示例、说明、使用说明。
* `hardware_asset/index.md`：放置 PCB、原理图、BOM 说明。
* `documents/index.md`：项目设计文档、规格说明、实验记录。
* `tutorial/`：面向学习者的逐步教学内容（可选）。
* `LICENSE`：MIT 许可证，由脚本生成并填入当前年份与作者名。
* `README.md`：项目入口说明，由脚本自动生成模板。

---

# 自定义与自动化提示

1. **修改默认文件/文件夹名**

   * 如果你想改 `software_codes` 为 `src`，把脚本中对应 `New-Item -ItemType Directory -Path $software_codes_folder_path` 的变量名和值替换即可。

2. **添加更多预填文件**

   * 可以在脚本相应位置加 `New-Item -ItemType File -Path (Join-Path $script:projectPath "CODES_OF_CONDUCT.md")` 来自动生成更多模板文件。

3. **无人值守（非交互式）运行**

   * 该脚本设计为交互式。要实现非交互自动化，请在脚本顶部改为读取命令行参数或环境变量（例如 `$args` 或 `Param()`），并把 `Read-Host` 替换为使用传入参数的默认值。
   * 简单示例（改造思路）：

     ```powershell
     Param(
       [string]$TargetPath = (Get-Location),
       [string]$ProjectName = "Awesome-Embedded-Tutorial",
       [string]$AuthorName  = "Charlie Chen",
       [string]$Email       = "charlie@example.com",
       [switch]$CreateTutorial,
       [switch]$InitGit
     )
     # 之后使用这些参数代替 Read-Host 的调用
     ```
   * 然后以：

     ```powershell
     powershell -ExecutionPolicy Bypass -File .\setup-embedded.ps1 -TargetPath "D:\proj" -ProjectName "X" -AuthorName "Y" -Email "z@x" -CreateTutorial -InitGit
     ```

4. **自动提交与远程仓库**

   * 脚本可在 `git init` 后自动 `git add .` 和 `git commit -m "chore: initial repo"`；若要推送到远程，请在脚本中加入 `git remote add origin <url>` 与 `git push -u origin main`（注意处理用户凭据/SSH key）。

---

# 故障排查与常见问题

* **脚本报错“目录已存在”**

  * 脚本会在项目路径已存在时退出（防止覆盖）。请改用不同的项目名或先删除现有目录。

* **写权限错误 / 无法创建文件**

  * 检查目标路径的权限，确认你有写入权限；在有些系统目录（如 `C:\Windows\System32`）需要管理员权限。

* **Git 初始化失败 / 未找到 git**

  * 确认 `git` 已安装并在 `PATH`。在 PowerShell 中运行 `git --version` 验证。如果无法安装，请选择跳过初始化。

* **Ctrl+C 后脚本没有提示**

  * 脚本通过 `Register-EngineEvent` 监听退出事件；在某些 PowerShell 版本或托管环境里，退出事件行为可能不同。若没有触发回滚提示，手动删除生成目录。

* **编码问题（中文/UTF-8）**

  * 脚本使用 `Out-File -Encoding UTF8` 写入 LICENSE/README，通常能保证 UTF-8 编码。如果在老系统中打开出现乱码，请使用支持 UTF-8 的编辑器（如 VSCode）。
