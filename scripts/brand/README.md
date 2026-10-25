# AELS CORE · 动态图标样片 v1

沿用已确认的 CORE 矢量轮廓制作，3.2 秒无限循环，25 fps。
内核先点亮并短促地闪一下，接着四根引脚各送出一道脉冲：光从机体边缘出发，
一路走到引脚尖端，到尖端散掉就不再折回。上侧一对先走，下侧一对跟上，
随后内核沉回静息，等下一轮开始。
芯片主体保持静止，轮廓和比例与静态图标一致。

## 文件

- `gif/aels-core-light-512.gif`：浅底，512 × 512。
- `gif/aels-core-dark-512.gif`：深底，512 × 512。
- `gif/aels-core-{light,dark}-256.gif`：体积更小的 256 像素版本。
- `svg/aels-core-{light,dark}-animated.svg`：网页用动画矢量版。
- `posters/`：静态替代图，取内核点满、引脚未起的那一帧。
- `preview.html`：本地预览，含暂停按钮，由 `export.py` 生成。
- `timeline.png`：从编码后的浅底 GIF 抽取的十个节拍点。
- `source/`：已确认的静态矢量源文件。
- `export.py`：可复现的动画导出脚本。

GIF 使用实色背景，以保留轮廓边缘的平滑效果。GIF 本身不能响应
系统的减少动态效果偏好；网页使用动画 SVG 时会响应该偏好并显示静态标识。
本地预览也会按该偏好显示静态替代图，并可手动播放。

## 重新导出

需要 Python 3、`rsvg-convert`、`ffmpeg` 和 `gifsicle`，无需额外 Python 包：

```sh
python scripts/brand/export.py
```

脚本直接渲染 SVG 帧，再用 FFmpeg 生成调色板和 GIF，用 gifsicle 优化。
动画通过内核明暗、点火闪光和引脚扫出来实现，不重新生成图标。
`manifest.json` 记录文件校验值，压缩包写到 `scripts/aels-core-motion-v1.zip`。

## 调节拍

时间表都在 `export.py` 顶部，改完直接重跑脚本：

- `CORE_TIMES`：内核的起亮、点满、开始回落、归位。
- `FLASH_TIMES`：点火闪光叠在内核上的起落。
- `UPPER_LEFT` / `UPPER_RIGHT` / `LOWER_LEFT` / `LOWER_RIGHT`：每根引脚的四个时刻，
  分别是脉冲离开机体、抵达尖端、保持满亮、尖端散尽，左右相差 0.08 秒。
- `DURATION` 与 `FPS`：循环时长和帧率。

动画 SVG 的关键帧由同一组曲线采样得出，缓动为 `linear`，所以矢量版和 GIF
的节拍一致。改时间表不需要另外维护 CSS。

## 重跑之后

脚本所有产物都写在它自己那一层（`scripts/brand/`），也就是 `gif/`、`svg/`、
`posters/`、`preview.html`、`timeline.png`、`manifest.json`，压缩包写到上一级的
`scripts/aels-core-motion-v1.zip`。

站点实际引用的是另一份拷贝，改完调拍以后记得把它们对过去：

```sh
cp scripts/brand/gif/*.gif            site/.vitepress/public/brand/gif/
cp scripts/brand/svg/*-animated.svg   site/.vitepress/public/brand/
```

静态 PNG 与头像由另一套导出流程产生，站点用的是
`site/.vitepress/public/brand/png/` 里那四张 512。

小灯泡 `aels-mark.png` 是从 `site/.vitepress/public/Awesome-Embedded.png`
按底色抠出来的，缩到 256，不是这套脚本的产物。
