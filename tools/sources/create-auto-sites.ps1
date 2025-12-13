<#
.SYNOPSIS
    交互式生成 MkDocs 配置文件 (mkdocs.yml)

.DESCRIPTION
    此脚本通过交互式方式收集用户输入，生成完整的 mkdocs.yml 配置文件。
    支持参数传入和输入验证，生成后提供详细报告。

.PARAMETER SiteName
    网站名称（必需）

.PARAMETER SiteAuthor
    网站作者（必需）

.PARAMETER DocDir
    文档目录路径（必需）

.PARAMETER Email
    联系邮箱（必需）

.PARAMETER OutputPath
    输出文件路径（可选，默认为当前目录下的 mkdocs.yml）

.EXAMPLE
    .\Generate-MkDocsConfig.ps1 -SiteName "我的博客" -SiteAuthor "张三" -DocDir "docs" -Email "mailto:zhangsan@example.com"

.NOTES
    作者: Charliechen With Claude
    版本: 1.0
    返回值: 0 表示成功，非0表示失败
#>

param(
    [Parameter(Mandatory = $true, HelpMessage = "请输入网站名称")]
    [ValidateNotNullOrEmpty()]
    [string]$SiteName,
    
    [Parameter(Mandatory = $true, HelpMessage = "请输入网站作者")]
    [ValidateNotNullOrEmpty()]
    [string]$SiteAuthor,
    
    [Parameter(Mandatory = $true, HelpMessage = "请输入文档目录")]
    [ValidateNotNullOrEmpty()]
    [string]$DocDir,
    
    [Parameter(Mandatory = $true, HelpMessage = "请输入联系邮箱")]
    [ValidateNotNullOrEmpty()]
    [string]$Email,
    
    [Parameter(Mandatory = $false)]
    [string]$OutputPath = "mkdocs.yml"
)

# 设置错误处理
$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# 输入验证函数
function Get-ValidatedInput {
    param(
        [string]$Prompt,
        [string]$FieldName,
        [bool]$AllowEmpty = $false
    )
    
    while ($true) {
        Write-Host ""
        Write-ColorOutput "[$FieldName]" -Color Cyan
        $_input = Read-Host $Prompt
        
        if ([string]::IsNullOrWhiteSpace($_input)) {
            if ($AllowEmpty) {
                return ""
            }
            Write-ColorOutput "❌ 错误: 此项不能为空，请重新输入！" -Color Red
            continue
        }
        
        return $_input.Trim()
    }
}

# 主函数
function Main {
    try {
        # 显示欢迎信息
        Clear-Host
        Write-ColorOutput "╔═══════════════════════════════════════════════════╗" -Color Green
        Write-ColorOutput "║                                                   ║" -Color Green
        Write-ColorOutput "║       MkDocs 配置文件生成器 v1.0                 ║" -Color Green
        Write-ColorOutput "║                                                   ║" -Color Green
        Write-ColorOutput "╚═══════════════════════════════════════════════════╝" -Color Green
        Write-Host ""
        
        # 显示已传入的参数
        Write-ColorOutput "📋 已接收的参数信息:" -Color Yellow
        Write-Host "  • 网站名称: $SiteName"
        Write-Host "  • 作者名称: $SiteAuthor"
        Write-Host "  • 文档目录: $DocDir"
        Write-Host "  • 联系邮箱: $Email"
        Write-Host ""
        
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Gray
        Write-ColorOutput "现在开始收集额外配置信息..." -Color Cyan
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Gray
        
        # 交互式收集信息
        $siteDescription = Get-ValidatedInput -Prompt "请输入网站描述（用于SEO优化）" -FieldName "网站描述" -AllowEmpty $false
        
        # 获取当前年份
        $currentYear = (Get-Date).Year
        
        # 生成 YAML 内容
        Write-Host ""
        Write-ColorOutput "⚙️  正在生成配置文件..." -Color Yellow
        
        $yamlContent = @"
site_name: ${SiteName}的文档  # 网站标题,显示在浏览器标签和页面顶部
site_description: $siteDescription  # 网站描述,用于SEO优化
site_author: $SiteAuthor  # 作者名称,可以改成你的真实姓名或网名

# 版权信息,显示在页面底部
copyright: Copyright &copy; $currentYear $SiteAuthor - 保留所有权利

# 文档源文件夹
docs_dir: "$DocDir"


# ==================== 主题配置 ====================
# Material 是一个现代化的 MkDocs 主题,提供了丰富的功能和美观的界面

theme:
  name: material  # 使用 Material 主题
  language: zh  # 界面语言设置为简体中文
  
  # 自定义网站图标和Logo
  logo: Awesome-Embedded.png  # 网站Logo
  favicon: Awesome-Embedded.ico  # 浏览器标签图标
  
  # 调色板配置 - 支持亮色/暗色模式切换
  palette:
    # 亮色模式
    - media: "(prefers-color-scheme: light)"
      scheme: default  # 使用默认亮色主题
      primary: indigo  # 主色调:靛蓝色(导航栏等)
      accent: indigo  # 强调色(链接、按钮等)
      toggle:
        icon: material/brightness-7  # 切换图标
        name: 切换至暗色模式
    
    # 暗色模式
    - media: "(prefers-color-scheme: dark)"
      scheme: slate  # 使用暗色主题
      primary: black  # 主色调:黑色
      accent: indigo  # 强调色保持一致
      toggle:
        icon: material/brightness-4  # 切换图标
        name: 切换至亮色模式
  
  # 字体配置
  font:
    text: Roboto  # 正文字体
    code: Roboto Mono  # 代码字体
  
  # 功能特性开关
  features:
    # ---------- 导航功能 ----------
    - navigation.instant  # 即时加载,页面切换更流畅(类似SPA)
    - navigation.instant.prefetch  # 预加载链接,提升访问速度
    - navigation.instant.progress  # 显示加载进度条
    - navigation.tracking  # 地址栏自动更新为当前标题的锚点
    - navigation.sections  # 侧边栏显示章节分组
    - navigation.expand  # 默认展开所有章节(方便查看全部内容)
    - navigation.path  # 显示当前页面的完整路径
    - navigation.indexes  # 支持章节索引页
    - navigation.top  # 显示"返回顶部"按钮
    - navigation.footer  # 页面底部显示上一页/下一页导航
    
    # ---------- 目录功能 ----------
    - toc.follow  # 目录自动跟随滚动
    - toc.integrate  # 将右侧目录集成到左侧导航栏(节省空间)
    
    # ---------- 搜索功能 ----------
    - search.suggest  # 搜索时显示建议
    - search.highlight  # 高亮显示搜索结果
    - search.share  # 允许分享搜索结果链接
    
    # ---------- 内容功能 ----------
    - content.code.copy  # 代码块添加复制按钮
    - content.code.select  # 代码块可以选择
    - content.code.annotate  # 代码块支持注释
    - content.tabs.link  # 内容标签页可以链接
    - content.tooltips  # 鼠标悬停显示提示信息
    - content.action.edit  # 显示"编辑此页"按钮
    - content.action.view  # 显示"查看源代码"按钮


# ==================== Markdown 扩展 ====================
# 这些扩展增强了 Markdown 的功能,让你能写出更丰富的内容

markdown_extensions:
  # ---------- 基础扩展 ----------
  - abbr  # 支持缩写定义
  - attr_list  # 允许为元素添加HTML属性
  - def_list  # 支持定义列表
  - footnotes  # 支持脚注
  - md_in_html  # 允许在HTML中使用Markdown
  - tables  # 表格支持(标准Markdown已支持,这里确保启用)
  
  # 目录扩展
  - toc:
      permalink: true  # 标题旁显示永久链接符号(#)
      permalink_title: 链接到此章节  # 永久链接的提示文字
      slugify: !!python/object/apply:pymdownx.slugs.slugify
        kwds:
          case: lower  # URL中的标题转为小写
  
  # 警告框扩展 - 可以创建提示、警告、危险等样式的信息框
  - admonition  # 基础警告框支持
  
  # ---------- PyMdown 扩展(强大的Markdown增强) ----------
  
  # 细节折叠块 - 可折叠的内容区域
  - pymdownx.details
  
  # 代码高亮
  - pymdownx.highlight:
      anchor_linenums: true  # 代码行号可以被链接
      line_spans: __span  # 每行代码单独包装
      pygments_lang_class: true  # 添加语言类名
      linenums: true  # 显示行号
      linenums_style: pymdownx-inline  # 行号样式
  
  # 行内代码高亮
  - pymdownx.inlinehilite
  
  # 代码块和其他内容的围栏支持
  - pymdownx.superfences:
      custom_fences:
        # 支持 Mermaid 图表
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  
  # 内容标签页 - 可以创建多个标签切换的内容区域
  - pymdownx.tabbed:
      alternate_style: true  # 使用替代样式
      combine_header_slug: true  # 合并标签头的slug
      slugify: !!python/object/apply:pymdownx.slugs.slugify
        kwds:
          case: lower
  
  # Emoji 支持 - 可以使用 :smile: 这样的表情符号
  - pymdownx.emoji:
      emoji_index: !!python/name:material.extensions.emoji.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
  
  # 其他实用扩展
  - pymdownx.caret  # 支持上标 ^text^
  - pymdownx.mark  # 支持高亮标记 ==text==
  - pymdownx.tilde  # 支持删除线 ~~text~~ 和下标 ~text~
  - pymdownx.keys  # 支持键盘按键显示 ++ctrl+alt+del++
  - pymdownx.smartsymbols  # 智能符号替换
  - pymdownx.snippets  # 支持包含其他文件的代码片段
  - pymdownx.critic  # 支持批注和修订标记
  - pymdownx.betterem  # 改进的强调语法


# ==================== 插件配置 ====================
# 插件为网站添加额外功能

plugins:
  # 搜索插件 - 提供全站搜索功能
  - search:
      separator: '[\s\u200b\-_,:!=\[\]()"`/]+|\.(?!\d)|&[lg]t;|(?!\b)(?=[A-Z][a-z])'  # 中文分词支持
      lang:
        - zh  # 中文搜索
        - en  # 英文搜索
      pipeline:
        - stemmer
        - stopWordFilter
        - trimmer
  
  # Awesome Pages 插件 - 灵活的页面组织方式
  - awesome-pages
  
  # Git 修订日期插件 - 自动显示文章的创建和更新时间
  - git-revision-date-localized:
      enable_creation_date: true  # 显示创建日期
      fallback_to_build_date: true  # 如果Git历史不可用,使用构建日期
      type: datetime  # 日期格式: datetime(日期+时间) / date(仅日期) / iso_date / iso_datetime
      timezone: Asia/Shanghai  # 时区设置
      locale: zh  # 本地化语言


# ==================== 额外配置 ====================

# 社交媒体链接 - 显示在页面右上角
extra:
  # 社交媒体图标
  social:
    - icon: fontawesome/brands/github  # GitHub图标
      link: https://github.com/Awesome-Embedded-Learning-Studio  # 你的GitHub主页
      name: GitHub
    - icon: fontawesome/solid/paper-plane  # 邮件图标
      link: $Email
      name: 发送邮件


# ==================== 额外的CSS和JavaScript ====================
# 可以添加自定义样式和脚本

extra_javascript:
  # 数学公式支持(MathJax)
  - javascripts/mathjax.js
  - https://polyfill.io/v3/polyfill.min.js?features=es6
  - https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js


# ==================== 注意事项 ====================
# 本地预览命令:
#    mkdocs serve  # 启动本地服务器,访问 http://127.0.0.1:8000
#
# ==================== 配置结束 ====================
"@

        $OutputPath = Join-Path -Path $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath) -ChildPath "mkdocs.yml"
        
        Write-ColorOutput "📝 正在写入文件到: $OutputPath" -Color Gray
        
        try {
            # 确保目标目录存在
            $outputDir = Split-Path -Path $OutputPath -Parent
            if ($outputDir -and -not (Test-Path $outputDir)) {
                New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
                Write-ColorOutput "  创建目录: $outputDir" -Color Gray
            }
            
            # 使用 Set-Content 替代 Out-File，更可靠
            Set-Content -Path $OutputPath -Value $yamlContent -Encoding UTF8 -Force
            
            # 验证文件是否创建成功
            if (-not (Test-Path -LiteralPath $OutputPath)) {
                throw "配置文件写入后无法找到！"
            }
            
            # 验证文件大小
            $fileSize = (Get-Item $OutputPath).Length
            if ($fileSize -eq 0) {
                throw "配置文件为空！"
            }
            
            Write-ColorOutput "  文件写入成功 ($fileSize 字节)" -Color Gray
            
        }
        catch {
            throw "文件写入失败: $($_.Exception.Message)"
        }
        
        # 生成报告
        Write-Host ""
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Green
        Write-ColorOutput "✅ 配置文件生成成功！" -Color Green
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Green
        Write-Host ""
        
        Write-ColorOutput "📊 生成报告" -Color Cyan
        Write-Host ""
        
        Write-ColorOutput "【基本信息】" -Color Yellow
        Write-Host "  • 网站名称: ${SiteName}的文档"
        Write-Host "  • 网站描述: $siteDescription"
        Write-Host "  • 作者名称: $SiteAuthor"
        Write-Host "  • 版权年份: $currentYear"
        Write-Host "  • 文档目录: $DocDir"
        Write-Host "  • 联系邮箱: $Email"
        Write-Host ""
        
        Write-ColorOutput "【文件信息】" -Color Yellow
        $fileInfo = Get-Item $OutputPath
        Write-Host "  • 文件路径: $($fileInfo.FullName)"
        Write-Host "  • 文件大小: $([math]::Round($fileInfo.Length/1KB, 2)) KB"
        Write-Host "  • 创建时间: $($fileInfo.CreationTime.ToString('yyyy-MM-dd HH:mm:ss'))"
        Write-Host ""
        
        Write-ColorOutput "【配置内容】" -Color Yellow
        Write-Host "  • 主题: Material for MkDocs"
        Write-Host "  • 语言: 简体中文 (zh)"
        Write-Host "  • 颜色方案: 支持亮色/暗色模式切换"
        Write-Host "  • 导航特性: 已启用即时加载、标签导航等 18+ 项功能"
        Write-Host "  • Markdown扩展: 已启用 25+ 项扩展（代码高亮、表格、Emoji等）"
        Write-Host "  • 插件: search、awesome-pages、git-revision-date-localized"
        Write-Host "  • 数学公式: 已配置 MathJax 支持"
        Write-Host ""
        
        Write-ColorOutput "【下一步操作】" -Color Yellow
        Write-Host ""
        Write-Host "  请参考本目录下的static-sites-helps来了解更多细节"
        Write-Host "  如果你需要运行本地预览:"
        Write-Host "     mkdocs serve"
        Write-Host ""
        Write-Host ""
        
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Green
        
        return 0
        
    }
    catch {
        Write-Host ""
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Red
        Write-ColorOutput "❌ 错误: 配置文件生成失败！" -Color Red
        Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Red
        Write-Host ""
        Write-ColorOutput "错误详情:" -Color Yellow
        Write-Host "  $($_.Exception.Message)"
        Write-Host ""
        Write-Host "  发生位置: 第 $($_.InvocationInfo.ScriptLineNumber) 行"
        Write-Host ""
        
        Write-ColorOutput "按任意键退出..." -Color Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        return 1
    }
}

# 执行主函数
exit (Main)