# Awesome-Embedded-Learning-Studio-Bootstrap

把组织的学习仓库一键克隆/更新到你指定的目录 —— Awesome-Embedded 学习站的**实际入口**。

## 用法

```bash
# 首次:克隆核心起步集(EmbedBox + C-Journey),然后打印学习地图
python boot/bootstrap.py --dest ~/aels

# 按支柱扩展(首次或后续都可以)
python boot/bootstrap.py --dest ~/aels --track fundamentals   # P0 全员 7 个
python boot/bootstrap.py --dest ~/aels --track mcu             # 单片机
python boot/bootstrap.py --dest ~/aels --track linux           # 嵌入式 Linux
python boot/bootstrap.py --dest ~/aels --track specialty       # 专题(Cinux 线)
python boot/bootstrap.py --dest ~/aels --track all             # 全部支柱

# 后续运行:默认就是更新(dest 下所有 git 仓 git pull --ff-only)
python boot/bootstrap.py --dest ~/aels

# 预览(不联网、不写盘,只打印将执行的 git 命令)
python boot/bootstrap.py --dest ~/aels --dry-run --track all

# 完整历史(默认 --depth 1 浅克隆)
python boot/bootstrap.py --dest ~/aels --track all --full
```

`--dest` **必填**,没有默认值，是说明您计划克隆到哪里的参数
