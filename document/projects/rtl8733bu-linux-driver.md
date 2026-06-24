---
title: "rtl8733bu-linux-driver"
---

## 简介

**rtl8733bu-linux-driver** 是 Realtek **RTL8733BU** USB WiFi+BT combo 芯片（USB id `0bda:b733`）的 **out-of-tree Linux 驱动**，移植到在 **Linux 7.1** 上构建与运行。

这只芯片**没有主线驱动**：主线 `rtw89` 只到 8851/8922，`rtl8xxxu` 不覆盖 8733B，没有任何驱动绑定 `0bda:b733`。本仓库在 wirenboard 的 out-of-tree 驱动基础上，做了向 Linux 7.1 的 API 移植，填补这块空白。

## 来源（provenance）

```
Realtek Semiconductor Corp（原厂驱动，GPL-2.0）
        │
        ▼
wirenboard/rtl8733bu（branch v5.15.12-264_for6.18；上游测到 5.10.x / 6.8.x）
        │
        ▼
本仓库 linux-7.1-port 分支（rk-forge / Awesome-Embedded-Learning-Studio 移植到 7.1）
```

`linux-7.1-port` 分支 = `v5.15.12-264_for6.18` + 下述移植提交。完整 wirenboard 历史保留在分支祖系里（归属），Realtek 的 per-file copyright + GPL-2.0 头在每个源文件中保留。

## 移植改了什么（在 wirenboard base 之上的 3 个提交）

1. **`build: 用静态 Kbuild 替换多芯片 Makefile`** —— 上游 2803 行多芯片 Makefile（其 out-of-tree `M=` 路径在某些 host 上会让 make 段错误）换成静态 Kbuild：`obj-$(CONFIG_RTL8733BU) += 8733bu.o` + 完全展开的 187 项 `8733bu-y` + `ccflags-y`（路径宏 `"`-转义；剥掉 `CONFIG_BR_EXT`——它命中一个 7.x 已删的 API）。走稳定的 in-tree `obj-$()` 构建路径。
2. **`kconfig: depends on USB && CFG80211`** —— 修掉上游 `depends on MMC` 的复制粘贴笔误（这是 USB 设备）+ 加 SPDX + help 文本。
3. **`cfg80211: 6.14+ MLO 漂移的 wdev-ops 包装`** —— Linux ~6.14 把 9 个 `cfg80211_ops` 回调从 `net_device *` 改成 `wireless_dev *`。与其重写 9 个多行 `#if` 门控签名，不如在 ops 结构前加 9 个薄 `_wdev` 转发器（复用驱动已有的 `wdev_to_ndev()`），让结构体指向它们，外加 2 处调用方修改。这是 API 移植的主体。

## 构建

以模块形式 in-tree 构建：把这棵树放进 Linux 7.1 源码树的 `drivers/net/wireless/realtek/rtl8733bu/`，按标准内核模块流程编译加载。

## 与 AELS 的关系

属于 **Embedded Linux** 主线，是驱动 / 移植方向的实战样本，与 [rk-forge](/projects/rk-forge)（Rockchip 平台工作空间）配套——本次 6.8 → 7.1 的 API 移植正是在 rk-forge 语境下完成的。

## 链接

- [GitHub 仓库](https://github.com/Awesome-Embedded-Learning-Studio/rtl8733bu-linux-driver)
