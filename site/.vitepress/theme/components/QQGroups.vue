<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

// 首页 Hero 下方的 QQ 群入口横幅。挂在 theme/index.ts 的 home-hero-after 槽（DataStrip 之后）。
// QR 是白底 SVG（内嵌白色背景矩形），明暗模式统一用白卡 + 细边框承托，不做反色。
// 根节点 id="aels-qq-groups" 供首页 hero 按钮锚点跳转。

const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))

const groups = computed(() => [
  {
    img: withBase('/images/qq/aels-embeded.svg'),
    alt: 'QQ QR — AELS 645248275',
    name: en.value ? 'AELS Community' : 'AELS 交流群',
    number: '645248275',
    link: 'https://github.com/orgs/Awesome-Embedded-Learning-Studio/discussions/7',
  },
  {
    img: withBase('/images/qq/aels-tamcpp.svg'),
    alt: 'QQ QR — TAMCPP 1107100989',
    name: en.value ? 'TAMCPP (Modern C++ Tutorial)' : 'TAMCPP（Modern C++ 教程）群',
    number: '1107100989',
    link: 'https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP',
  },
])
</script>

<template>
  <section id="aels-qq-groups" class="aels-qq" aria-label="QQ Groups">
    <span class="aels-qq__tag">§ COMMUNITY</span>
    <h3 class="aels-qq__title">{{ en ? '💬 Join our QQ Groups' : '💬 加入 QQ 交流群' }}</h3>

    <div class="aels-qq__row">
      <a
        v-for="g in groups"
        :key="g.number"
        class="aels-qq__card"
        :href="g.link"
        target="_blank"
        rel="noreferrer"
      >
        <img class="aels-qq__qr" :src="g.img" :alt="g.alt" loading="lazy" width="150" height="150" />
        <span class="aels-qq__name">{{ g.name }}</span>
        <span class="aels-qq__number">{{ g.number }}</span>
      </a>
    </div>

    <p class="aels-qq__hint">
      {{ en ? 'Scan to join, or search the group number in QQ.' : '扫码进群，或在 QQ 中直接搜索群号。' }}
    </p>
  </section>
</template>

<style scoped>
.aels-qq {
  max-width: 1152px;
  margin: 44px auto 8px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  /* 锚点跳转时避开粘性导航遮挡 */
  scroll-margin-top: calc(var(--vp-nav-height, 56px) + 24px);
}

.aels-qq__tag {
  font-family: var(--aels-font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--aels-copper);
  border: 1px solid var(--aels-copper);
  border-radius: 6px;
  padding: 3px 10px;
  background: color-mix(in srgb, var(--aels-copper) 10%, transparent);
  white-space: nowrap;
}

.aels-qq__title {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.aels-qq__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
}

.aels-qq__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

/* 白底 QR 统一用白卡承托：亮色模式靠边框分层，暗色模式白卡即视觉锚点 */
.aels-qq__qr {
  width: 150px;
  height: 150px;
  box-sizing: border-box;
  padding: 10px;
  background: #ffffff;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: border-color 0.39s ease, box-shadow 0.39s ease, transform 0.39s ease;
}

.aels-qq__card:hover .aels-qq__qr {
  border-color: var(--aels-copper);
  box-shadow: var(--aels-shadow-lift);
  transform: translateY(-2px);
}

.aels-qq__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
}

.aels-qq__number {
  font-family: var(--aels-font-mono);
  font-size: 13px;
  letter-spacing: 1px;
  color: var(--aels-amber);
}

.aels-qq__hint {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

/* 站点既有断点先例：DataStrip / HomePlaque 均用 639px */
@media (max-width: 639px) {
  .aels-qq {
    margin-top: 34px;
    gap: 12px;
  }
  .aels-qq__row {
    flex-direction: column;
    gap: 20px;
  }
  .aels-qq__qr {
    width: 132px;
    height: 132px;
  }
}
</style>
