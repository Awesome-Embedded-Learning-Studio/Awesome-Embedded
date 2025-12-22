# 核心仓库的工具集合

## Tools脚本使用指南

如果您对这里的脚本存在疑问，访问[文档目录](./documentations/)检索您感兴趣的脚本说明

快速指南: 
- [快速创建工程脚本指南](./documentations/create_project_doc.md)
- [快速创建教程脚本指南](./documentations/create_tutorial_doc.md)


## 静态网站化自动部署指南

> 如果是从0开始创建的，请您直接将您的文档放进tutorial，并且修改分支即可，否则，在您修改好分支后，务必需要自己看下面的手动迁移指南


### 分支更改

这一步记得做，否则的话看不到静态网站的。

> Github `->` Settings `->` 左侧导航栏的`Pages` `->` Branch改成“gh-pages”和`/`即可。部署显示成功后，请您检查在这个页上有没有通知您网站可访问。

## 手动迁移指南

如果您之前没有安装，请您做如下的操作：

运行当前目录下的`sources/create-auto-sites.ps1` 是一个用于**交互式生成 MkDocs 配置文件（mkdocs.yml）**的 PowerShell 脚本。脚本会引导用户输入网站名称、作者、文档目录和联系邮箱等必要信息，也支持通过命令行参数直接传入；在完成输入与校验后，会自动生成完整可用的 `mkdocs.yml` 文件，默认输出到当前目录（也可通过 `-OutputPath` 指定位置），并在生成结束时输出配置摘要，适合用于快速初始化或标准化 MkDocs 文档站点。

你要做的只需要提供：

```
./sources/create-auto-sites.ps1 `
  -SiteName "你打算填入的站点名称" `
  -SiteAuthor "作者" `
  -DocDir "文档目录，指定填写tutorial或者指向你的文档目录根" `
  -Email "你的邮箱" `
  -OutputPath "生成目录的根路径"
```

即可，或者可以自己手动迁移，自行查看脚本分析即可。

> 需要手动迁移的就是复制.github文件夹即可