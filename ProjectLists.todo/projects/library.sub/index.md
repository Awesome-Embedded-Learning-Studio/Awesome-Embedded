# 库工程

> PS：库工程是我们后面快速开展做快速迭代产品的重要基石，所以，将我们的产品预备役一些库，和从过去的产品中制作一些库是非常重要的。

## 单片机层次

### 常见驱动

> 常见驱动包括基于C和C++版本的高性能驱动，涵盖GPIO, UART, SPI/IIC等 

**目标**：基于 C/C++ 的高性能封装，**强制要求 DMA 和 中断 (IRQ) 支持**，不能仅仅是轮询。

- **基础通信类**：
  - **GPIO**: 输入/输出，中断模式（上升/下降/双边），去抖动逻辑（软件/硬件）。
  - **UART/USART**: 支持 RingBuffer 的中断接收/发送，**DMA 接收/发送**（解决高速数据丢包），波特率自适应。
  - **SPI**: 主/从模式，DMA 传输，支持多片选管理 (Software CS)。
  - **I2C (IIC)**: 硬件 I2C (DMA 支持) + **高健壮性模拟 I2C**（防止死锁，带超时复位机制）。
  - **CAN/CAN-FD**: 过滤器配置，FIFO 管理，针对汽车/工业场景的协议解析基础。
  - **USB Device/Host**: 虚拟串口 (CDC), 模拟U盘 (MSC), HID (键盘鼠标)。
- **定时与控制类**：
  - **TIM (Timer)**: 基础定时，PWM 输出 (互补波形/死区控制 - 电机用)，输入捕获 (编码器模式)。
  - **RTC**: 实时时钟，支持闹钟中断，Unix 时间戳转换。
  - **WDT**: 看门狗 (独立/窗口)，提供“喂狗”回调接口。
- **模拟与转换类**：
  - **ADC**: 多通道扫描，DMA 自动搬运，内部温度/电压参考计算。
  - **DAC**: 波形输出，音频播放基础。
- **系统级**：
  - **Flash (Internal)**: 片内 Flash 读写（带扇区擦除保护）。
  - **CRC/RNG**: 硬件 CRC 校验，真随机数生成。

### 常见器件驱动

> 编写常见器件的驱动：包含但是不限于SSD13*系列芯片，LCD，常见ROM存储器，SD卡等驱动

**目标**：模块化设计，也就是“驱动对象化”，支持同一类设备挂载多个。

- **人机交互 (HMI)**：
  - **显示屏**:
    - OLED: SSD1306, SSD1315, SH1106 (I2C/SPI).
    - TFT LCD: ST7789, ILI9341, ST7735, LTDC (RGB接口屏).
    - 墨水屏: e-Paper 驱动 (局部刷新/全局刷新).
  - **输入设备**:
    - 按键: 矩阵按键，长按/短按/双击事件封装。
    - 旋钮编码器 (EC11)。
    - 触摸: 电容触摸 (GT911, FT6236), 电阻触摸 (XPT2046).
  - **指示**: WS2812/SK6812 (RGB LED)，状态机控制的 LED 闪烁库。
- **存储器 (Storage)**：
  - **EEPROM**: AT24Cxx 系列。
  - **NOR Flash**: W25Qxx 系列 (SPI/QSPI)。
  - **NAND Flash**: 坏块管理，磨损均衡 (FTL层基础)。
  - **SD Card**: SDIO 模式 (高速) 与 SPI 模式兼容。
- **传感器 (Sensors) - 工业与消费级**：
  - **IMU (姿态)**: MPU6050, LSM6DS3, ICM20602 (带简单的姿态解算滤波算法如互补滤波/卡尔曼)。
  - **环境**: 温湿度 (DHT11/22, AHT10, SHT30), 气压 (BMP280, SPL06).
  - **光/距**: 光照 (BH1750), 距离 (VL53L0X ToF, 超声波 HC-SR04).
- **连接模组 (Connectivity)**：
  - **WiFi/BT**: ESP8266/ESP32 AT 指令集封装，Air724 (4G Cat.1).
  - **IoT**: LoRa (SX1278/SX1262), NBIoT (BC26).

### 其他重要的Middlewares

> 这一部分迁移和完善之前的[CCUtilCommons/CCBasicCore: CCBasicCore is the center library of CCUtilsCommons, which attempts to provide simple DataStructure And Simple Algorithm for Any Platform](https://github.com/CCUtilCommons/CCBasicCore)

- **数据结构**: 线程安全的 RingBuffer, LinkedList, Queue.
- **格式解析**: cJSON (精简版), XML (Mini), IniParser.
- **调试**: 基于宏定义的日志系统 (Log_Debug/Info/Error)，支持重定向到串口/RTT/USB。
- **OS抽象层 (OSAL)**: 封装 Task, Mutex, Semaphore, Queue，统一 FreeRTOS, RT-Thread 和裸机的接口。



### 上层框架

#### 显示库驱动

> 做一个炫酷的嵌入式UI框架，可以轻量级的开箱即用

**目标**：在资源受限（如 STM32F1/F4）芯片上实现高帧率动画，或在高性能芯片上实现类手机体验。

- **渲染引擎 (Render Core)**：
  - 实现基本的 2D 绘图原语 (点, 线, 圆, 矩形, 填充)。
  - **DMA2D/GPU 加速接口**: 如果芯片支持，自动使用硬件加速。
  - **双缓冲 (Double Buffering)**: 防止画面撕裂。
- **控件系统 (Widget System)**：
  - **基础控件**: Label (支持多字体), Button (带按下动效), Switch, Slider, ProgressBar.
  - **高级控件**: List/Wheel (滚轮选择), Chart (波形图), Image (支持 PNG 解码/RLE 压缩).
- **动画引擎 (Animation Engine)**：
  - 提供 **缓动函数 (Easing Functions)**: 实现弹跳、渐入渐出、惯性滑动等效果。
  - **页面管理器 (Page Manager)**: 页面栈管理，负责页面切换时的转场动画（推入、覆盖、淡入）。
- **工具链**:
  - PC 端模拟器 (基于 SDL2 或 Windows API)，允许在电脑上开发 UI。
  - 字体/图片转换工具 (脚本化)。



## 嵌入式Linux层级

### 系统编程库

> 目的：这一部分是熟悉和讲解系统编程的几个非常重要的概念，以及为了之后快速的起一些嵌入式Or上位机联动调试的时候方便检查时做的

#### 3.1 系统编程库 (System Programming Lib)

**目标**：封装 POSIX 标准 API，提供现代 C++ (C++11/14/17) 风格的接口，方便上位机联动调试。

- **硬件访问封装 (HW Access)**：
  - **GPIO**: 封装 `sysfs` 或新版 `libgpiod`，实现类似单片机的操作风格。
  - **Serial**: 封装 `termios`，处理粘包/分包，提供阻塞/非阻塞读写。
  - **I2C/SPI Userspace**: 封装 `/dev/i2c-x` 和 `spidev`，方便在应用层驱动外设。
- **进程间通信 (IPC)**：
  - **Shared Memory**: 高速数据共享封装。
  - **Unix Domain Socket**: 本地进程高效通信，用于 Daemon 和 UI 交互。
  - **Message Queue**: 封装 POSIX MQ 或 System V MQ。
- **并发与线程 (Concurrency)**：
  - **ThreadPool**: 高性能线程池，避免频繁创建销毁线程。
  - **Timer**: 基于 `timerfd` 的高精度定时器封装。
- **网络通信 (Network)**：
  - **TCP/UDP Socket**: 封装 Server/Client 类，处理断线重连、心跳包。
  - **HTTP Client**: 简单的 REST API 请求封装 (GET/POST/Upload)。
  - **MQTT Client**: 针对物联网场景的封装。
- **调试与诊断工具 (Debug Utils)**：
  - **Backtrace**: 程序崩溃时自动打印堆栈信息（Segment Fault 捕获）。
  - **Performance Monitor**: 统计 CPU 占用率、内存使用情况的类。
  - **Log Daemon**: 统一日志服务，支持日志轮转 (Log Rotation)、存文件、网络上报。
- 其他常见的 SysAPI

### 简单的桌面系统

> 目的：重写一下CCIMXDesktop项目，使其成为完整的迷你嵌入式桌面系统。

**目标**：不仅是一个 Demo，而是一个**可扩展的 Mini OS 框架**，适用于工控屏、智能家居中控等场景。

#### 4.1 核心架构 (Core Architecture)

采用Qt，迁移之前使用的[Charliechen114514/CCIMXDesktop: This is a Simple Desktop with Common Utilities for Embedded Device System using Qt6](https://github.com/Charliechen114514/CCIMXDesktop)，不过这一次是改成挂靠，然后重新开一个分支搞新的

#### 4.1 桌面环境组件 (Desktop Components)

- **System Bar (状态栏)**：
  - 显示时间、WiFi 信号、CPU 温度、内存占用。
  - 下拉菜单（快捷开关：亮度、音量、网络）。
- **Launcher (应用启动器)**：
  - 网格化图标布局，支持滑屏翻页。
  - 应用生命周期管理（启动 App、杀掉 App、切换前后台）。
- **Settings (系统设置)**：
  - **网络管理**: 扫描 WiFi，输入密码连接 (调用 `wpa_supplicant` 或 `NetworkManager` DBus 接口)。
  - **显示/声音**: 调节背光亮度 (写 `/sys/class/backlight`)，调节音量 (ALSA API)。
  - **系统信息**: 版本号、存储空间管理。

#### 4.3 必备 App 套件

- **File Explorer (文件管理器)**: 浏览 U 盘/SD 卡，复制粘贴。
- **Terminal (简易终端)**: 在屏幕上直接执行 Shell 命令（虚拟键盘支持）。
- **Process Manager (任务管理器)**: 查看并结束占用高的进程。

#### 4.4 交互逻辑 (Interaction)

- **全局手势**: 边缘滑入返回，底部上滑回主页。
- **输入法框架**: 简易的虚拟键盘（中英文支持）。
