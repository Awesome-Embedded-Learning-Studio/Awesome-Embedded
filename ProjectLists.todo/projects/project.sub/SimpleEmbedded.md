# IMX6ULL

## 起步建议（必读，2 行）

- 硬件：优先拿到 NXP 的 MCIMX6ULL-EVK 或常见 i.MX6ULL SoM/评估板作为开发平台，省去硬件 bring-up。([NXP半导体](https://www.nxp.jp/design/design-center/development-boards-and-designs/i-mx-evaluation-and-development-boards/evaluation-kit-for-the-i-mx-6ull-and-6ulz-applications-processor%3AMCIMX6ULL-EVK?utm_source=chatgpt.com))
- 软件：快速原型用 **Buildroot**（上手快），要做产品级镜像/定制 BSP 推荐 **Yocto**。相关上手资料很多。([Andrew’s Tinker Blog](https://run-parallel.sh/posts/embedded-linux-part-1-buildroot/?utm_source=chatgpt.com))

------

## 初级（入门，适合 1–2 周）

1. **串口/LED/按键驱动练手（Baremetal / Linux 驱动）**
   - 目标：从串口控制 LED、读按键；实现简单交互 shell。
   - 学到：UART、GPIO 驱动、交叉编译、串口调试。
   - 硬件：开发板 + USB-TTL。
   - 软件栈：交叉编译的 Linux 用户态程序或裸机。
2. **U-Boot 启动流程解读 + 自定义环境变量**
   - 目标：在 u-boot 中添加自定义启动脚本、实现从 SD 卡启动镜像。
   - 学到：启动链（ROM->SPL->U-Boot->kernel）、环境、烧写镜像。
   - 硬件：EVK 即可。
3. **Buildroot 上快速跑 Hello World Rootfs & SSH**
   - 目标：用 Buildroot 构建最小系统并通过 SSH 登录。
   - 学到：交叉工具链、rootfs 配置、BusyBox、systemd/sysv。
   - 软件：Buildroot。([Andrew’s Tinker Blog](https://run-parallel.sh/posts/embedded-linux-part-1-buildroot/?utm_source=chatgpt.com))
4. **I²C 温湿度传感器采集并上报（MQTT）**
   - 目标：读取 I²C 传感器（例如 SHT3x），并把数据通过 MQTT 发到本地服务器。
   - 学到：I²C 使用、libcurl/mosquitto 客户端、简单守护进程。
   - 硬件：传感器、网线或 Wi-Fi（通过 USB dongle）。

------

## 中级（适合 2–6 周）

1. **Web-based HMI：LCD + Touch + Web UI（Chromium/Light Browser 或 QtWebEngine）**
   - 目标：在 7–10″ LCD 上跑一个控制面板（温度曲线、控制开关）。
   - 学到：framebuffer/DRM、触摸输入、交叉编译 Qt/浏览器、硬件加速（若有）。
   - 硬件：带 LCD 接口的 EVK 或带 LCD 的 SoM。
2. **工业网关：Modbus RTU（串口）到 Modbus TCP（以太网）桥接**
   - 目标：实现协议转发、设备管理页面与日志。
   - 学到：串口调度、多线程、协议解析、网络编程。
   - 硬件：RS-485 转串口模块、以太网。
3. **音频采集与回放（ALSA + simple DSP）**
   - 目标：用板载音频外设做录音/回放，加入降噪或回声消除 demo。
   - 学到：ALSA 驱动/PCM、采样率转换、简单 DSP 算法。
4. **低功耗数据采集节点（休眠唤醒、RTC、DMA）**
   - 目标：实现周期唤醒采样、数据缓存、批量上传，最大化电池寿命。
   - 学到：SoC 的 PM（suspend/resume）、RTC、外设时钟管理、DMA。
5. **容器化边缘应用（Docker 或 balena）在 i.MX6ULL 上的尝试**
   - 目标：将应用封装为容器便于部署与升级（资源受限，需优化）。
   - 学到：交叉构建容器镜像、overlayfs、资源隔离。

------

## 高级（适合 1–3 个月）

1. **摄像头 + OpenCV 的本地视觉（目标检测或 OCR）**
   - 目标：实现车牌/包裹识别、或简单目标检测（YOLO-lite / tflite）。
   - 学到：V4L2、DMA、图像预处理、轻量级推理加速（NEON）。
   - 挑战：性能与内存受限，需要模型量化与优化。
2. **安全引导 + 镜像签名（U-Boot/Tee/Trust）**
   - 目标：实现签名验证的 boot 流程，防止未授权固件启动。
   - 学到：公钥/私钥签名、u-boot 验证机制、TrustZone（若支持）。
3. **自研小型 RTOS 与 Linux 双核/协同（或 microservice on Linux）**
   - 目标：把硬实时任务放入轻量 RTOS 或隔离进程，Linux 处理上层服务。
   - 学到：任务隔离、IPC、内存保护。
4. **完整 OTA 系统（差分升级、回滚、验证、断点续传）**
   - 目标：实现可靠的设备端 OTA，包括 A/B 分区与回滚策略。
   - 学到：分区管理、升级策略、网络断点续传、镜像校验。

------

## 大型/作品集级（可作为简历/校招项目，3 个月+）

1. **智能工业监控网关（含 Web UI、边缘推理、MQTT/HTTPS、设备管理）**
   - 要点：集成 Modbus、摄像头/传感器、Edge 推理、日志与远程管理。能线上演示设备拓扑、告警与历史曲线。
2. **基于 i.MX6ULL 的定制 Linux 产品（从硬件原理图到生产镜像）**
   - 要点：从自定义板卡 (SCH/PCB)、电源设计、DDR/EMI 调试，到 BSP（U-Boot、Kernel、Device Tree、Yocto 配方）和生产流程（测试夹具、烧录脚本）。这是最全面也最吃力的项目。([NXP Community](https://community.nxp.com/t5/i-MX-Processors/i-MX6ULL-eMMC-Flash-and-Boot/m-p/2006053?utm_source=chatgpt.com))

------

## 项目 A — 快速上手：用 Buildroot 在 i.MX6ULL EVK 上跑最小 Linux（目标：可 SSH 登录 + 串口控制台）

目标：用 Buildroot 生成 SD 卡镜像（kernel + u-boot + rootfs），能从 SD 启动并通过 SSH 登录。适合作为后面所有项目的基础镜像。

必备硬件

- i.MX6ULL EVK（或兼容开发板）
- microSD 卡（8GB+），USB-TTL 线（串口控制台），网线。

软件栈与工具

- Host：Linux（Ubuntu/Fedora）
- Buildroot（官方），交叉工具链（buildroot 会自动）、u-boot/kernel 源

详细步骤（可复制）

1. 获取 Buildroot（示例目录 `~/imx6-build`）

```bash
mkdir -p ~/imx6-build && cd ~/imx6-build
git clone https://git.buildroot.org/buildroot.git
cd buildroot
# 可选切到稳定版本
git checkout 2024.02
```

1. 选择或创建 imx6ullevk 配置并编译（Buildroot 自带板级支持）

```bash
make board/freescale/imx6ullevk_defconfig
make -j$(nproc)
```

生成的镜像位于 `output/images/` （sdcard.img、u-boot.bin、zImage 等）。Buildroot 对 i.MX6ULL EVK 有示例配置（可据此微调）。([fossies.org](https://fossies.org/linux/buildroot/board/freescale/imx6ullevk/readme.txt?utm_source=chatgpt.com))

1. 刷写 SD 卡（Linux）

```bash
sudo dd if=output/images/sdcard.img of=/dev/sdX bs=4M status=progress && sync
```

把 SD 插到板上，串口打开（115200, 8N1），上电观察 u-boot 输出并确认 Linux 启动。

1. 常见要调整的点

- Device Tree：如果你用自定义板，需修改 device tree (.dts) 中 pinmux、spi/i2c/eth 等节点。
- u-boot environment：常用 `setenv` / `saveenv` 编辑 bootargs / bootcmd（如果需要从 SD 启动或从网络启动）。
- 如果需要 factory flash（批量写入），可以参考 U-Boot + fastboot / mfgtool 流程做工厂刷写。([bootlin.com](https://bootlin.com/blog/factory-flashing-with-u-boot-and-fastboot-on-freescale-i-mx6/?utm_source=chatgpt.com))

测试/验证

- 串口能看到 kernel 启动日志。
- 能用 `ifconfig`/`ip addr` 看到以太网，能 `ssh root@<ip>` 登录（如果你在 rootfs 中启用了 sshd）。

常见坑

- sdcard.img 分区/文件系统类型不匹配（用 `fdisk -l` 和 `mount` 检查）。
- Device tree pinmux 错误导致外设不工作（看 dmesg）。

------

## 项目 B — I²C 温湿度采集并通过 MQTT 上报（目标：传感器->i.MX6ULL->MQTT Broker）

目标：把 SHT3x（或类似 I²C 温湿度传感器）接到 i.MX6ULL，用 Linux i2c-dev 读数据，写成守护进程并通过 MQTT（mosquitto）上报到 Broker（本地或云端）。

必备硬件

- SHT3x I²C 传感器模块（3.3V）
- 若板子没有 I²C 引脚暴露，需跳线到对应 I2C 总线（参考 EVK 的 pinout）

软件栈

- Buildroot/Yocto 构建的 rootfs，含 `i2c-tools`、`python3`、`pip`（或你编写 C 程序）
- Python：`smbus2` 或 C 使用 `/dev/i2c-X`（libi2c）

连接与 DT（Device Tree）

- 确认实际连接到哪个 I2C 控制器（通常是 `/dev/i2c-1` 或 `/dev/i2c-2`）。
- 如果设备需要在 DT 中声明（可选，通常 i2c-dev + user-space poll 即可），确保内核配置启用了 I²C 驱动与 i2c-dev 接口。

示例：Python 读 SHT3x 并发 MQTT（文件 `sht3_mqtt.py`）

```python
#!/usr/bin/env python3
from smbus2 import SMBus
import time
import struct
import paho.mqtt.client as mqtt

I2C_BUS = 1
SHT3_ADDR = 0x44

def read_sht3(bus):
    # 单次测量命令（高精度）
    bus.write_i2c_block_data(SHT3_ADDR, 0x2C, [0x06])
    time.sleep(0.015)
    data = bus.read_i2c_block_data(SHT3_ADDR, 0, 6)
    # 解析温度和湿度
    t_raw = data[0] << 8 | data[1]
    rh_raw = data[3] << 8 | data[4]
    temp = -45 + 175 * (t_raw / 65535.0)
    rh = 100 * (rh_raw / 65535.0)
    return temp, rh

if __name__ == "__main__":
    client = mqtt.Client()
    client.connect("192.168.1.100", 1883, 60)  # 改成你的 broker
    with SMBus(I2C_BUS) as bus:
        while True:
            t, h = read_sht3(bus)
            payload = {"temp": round(t,2), "hum": round(h,2)}
            client.publish("devices/imx6ull/env", str(payload))
            time.sleep(10)
```

如何把这个程序做成服务

- 使用 systemd unit（`/etc/systemd/system/sht3-mqtt.service`），或用 BusyBox `init` 启动脚本。

测试/验证

- `i2cdetect -y 1` 能看到传感器地址（例如 `44`）。
- `python3 sht3_mqtt.py` 运行后，broker 上能收到消息（用 `mosquitto_sub -t devices/imx6ull/env` 验证）。

常见坑与调试

- I²C 电平不对（必须是 3.3V）；线长与上拉电阻问题。
- 没启用 i2c-dev：`CONFIG_I2C_CHARDEV` 在 kernel 中必选。
- 若用 DT 绑定驱动，请确保 driver 名与 compatible 匹配。

参考与延伸阅读（Buildroot / i2c 在 i.MX6 的实作范例）：Buildroot 上 i.MX6ULL 的入门教程 & 硬件说明可参考。([Andrew’s Tinker Blog](https://run-parallel.sh/posts/embedded-linux-part-1-buildroot/?utm_source=chatgpt.com))

------

## 项目 C — 工业网关：Modbus RTU（RS-485）到 Modbus TCP（以太网）桥接

目标：用 i.MX6ULL 实现一个稳定的 Modbus RTU -> Modbus TCP 网关（支持多个 RTU 设备，外部通过 TCP 访问）。适合工业侧项目、可用于远程采集。

必备硬件

- RS-485 转 USB/TTL 或直接板载 RS-485 收发器（MAX485 等）
- 以太网连通

软件栈（两种实现方式）

- C 实现：使用 libmodbus（成熟稳定，C 库）。([libmodbus.org](https://libmodbus.org/reference/?utm_source=chatgpt.com))
- Python 实现：使用 `pyModbusTCP` + `pyserial`（开发快，易调试）。([pymodbustcp.readthedocs.io](https://pymodbustcp.readthedocs.io/en/latest/examples/server_serial_gw.html?utm_source=chatgpt.com))

C / libmodbus 示例（核心思路）

- 建立 RTU backend（`modbus_new_rtu("/dev/ttyS1", 115200, 'N', 8, 1)`）
- 建立 TCP backend（`modbus_new_tcp(NULL, 502)`）或写一个 TCP server 把收到的请求转换为 RTU 并转发。libmodbus 官网有示例 API。([libmodbus.org](https://libmodbus.org/reference/?utm_source=chatgpt.com))

Python 参考实现（pyModbusTCP 的网关示例）

- repo/示例中有完整 server->serial gateway 示例（把 TCP 请求转发到 serial device）。可直接用并扩展。([pymodbustcp.readthedocs.io](https://pymodbustcp.readthedocs.io/en/latest/examples/server_serial_gw.html?utm_source=chatgpt.com))

详细步骤（Python 快速原型）

1. 在 rootfs 上安装 Python 与依赖（smbus、pyserial、pyModbusTCP）
2. 用 pyModbusTCP 的 `server_serial_gw.py` 模板，配置串口（如 `/dev/ttyUSB0`）与监听端口（502 或自定义）
3. 启动并在另一台机器上用 `modpoll` 或 `pymodbus` 客户端测试读取寄存器

测试/验证

- 使用 `modpoll` 或 `mbpoll` 模拟 TCP 客户端访问，看是否能读取 RTU 设备寄存器。
- 并发测试：用脚本模拟多个并发连接，确认串口访问排队/锁机制正确（单串口同时多请求需排队处理）。

常见坑

- RS-485 半双工需要正确的 DE/RE 控制（硬件或驱动处理）。
- 并发与超时：RTU 响应慢时，需合理设置超时并做重试策略。
- Unit ID 与 TCP Unit Identifier 的映射问题（文档里有解释）。

参考：libmodbus API 与 pyModbusTCP 的 serial gateway 示例。([libmodbus.org](https://libmodbus.org/reference/?utm_source=chatgpt.com))

------

## 项目 D — 设备级 OTA（A/B 分区 + Mender / swupdate）——实现可靠的远程升级

目标：在 i.MX6ULL 上实现可靠 OTA：设备能下载新镜像、校验签名、写入备用分区并回滚（若新镜像启动失败）。

为什么要用现成方案？因为 OTA 涉及 bootloader、分区布局、回滚策略、断点续传与签名验签，开源项目（Mender / swupdate）已经实现成熟方案，可以节省大量时间。Mender 在很多 i.MX 平台上已有集成指南（需要 Yocto 层协同）。([hub.mender.io](https://hub.mender.io/t/incomplete-i-mx-6ull-evk/635?utm_source=chatgpt.com))

总体流程（A/B）

1. 分区规划：两个 rootfs 分区（A/B）+ u-boot env 存放 active slot + recovery partition（可选）。
2. 下载镜像到临时存储（或直接写入备用分区），对镜像签名验签。
3. 切换 bootcmd 指向备用分区并标记为“pending”，重启；若新系统启动成功，标记为“accepted”，否则回滚到旧分区。

实现路径（两条推荐路线）

- Yocto + Mender：如果你愿意用 Yocto 构建镜像并集成 Mender layer（适合产品化，支持 delta updates、验证与回滚）。Mender 有 imx 集成教程/社区帖子。([hub.mender.io](https://hub.mender.io/t/incomplete-i-mx-6ull-evk/635?utm_source=chatgpt.com))
- Buildroot + swupdate：swupdate 可与 Buildroot 集成，实现 A/B 或 raw image 更新。需要在 u-boot 上实现支持（写入分区与 u-boot env 切换）。

具体操作要点（以 Mender + Yocto 为例，概要步骤）

1. 准备 Yocto 环境并加入 NXP imx manifest（repo init…），选择合适 branch（imx-linux-xxx）。([ftp.icop.com.tw](https://ftp.icop.com.tw/api/public/dl/zDCZJN1X?utm_source=chatgpt.com))
2. 添加 mender layers 并配置 `MENDER_FEATURES`、`MENDER_SERVER_URL` 等，设置分区布局（`mender-image` 配方自动处理）。参见 Mender 官方 & 社区指南（有 imx6 示例）。([hub.mender.io](https://hub.mender.io/t/incomplete-i-mx-6ull-evk/635?utm_source=chatgpt.com))
3. 构建镜像并在设备上进行第一次部署（手动或通过 mender server）。
4. 验证回滚：在测试镜像中人为触发 boot faillure，看是否能回滚到上一个 accepted 镜像。

测试/验证

- 对比两次升级的镜像 hash，开启 fail-safe 场景（例如内核 panic）确认设备能回滚。
- 检查 u-boot env 项（`bootcmd`, `mender_bootenv_*`）确保逻辑正确。

常见坑

- Mender 在旧 Yocto 分支或 imx 版本上的集成不总是开箱即用，需要按社区文档调整。([hub.mender.io](https://hub.mender.io/t/incomplete-i-mx-6ull-evk/635?utm_source=chatgpt.com))
- 分区对齐、fstab 与 fstab UUID 混乱会导致启动失败；建议用 mender 提供的示例布局并谨慎修改。