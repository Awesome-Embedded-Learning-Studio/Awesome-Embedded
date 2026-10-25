<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { isDark } = useData()

/* 明暗两版是两张独立的动画 SVG，跟着主题换。
   动效写在 SVG 内部的 prefers-reduced-motion 里，系统关掉动效就是静态图。 */
const src = computed(() =>
  withBase(
    isDark.value
      ? '/brand/aels-core-dark-animated.svg'
      : '/brand/aels-core-light-animated.svg',
  ),
)
</script>

<template>
  <div class="aels-mark">
    <img
      :src="src"
      width="512"
      height="512"
      alt="AELS CORE 组织标识"
      decoding="async"
    />
  </div>
</template>

<style scoped>
.aels-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 360px;
  margin: 0 auto;
}

.aels-mark img {
  width: 100%;
  height: auto;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
}
</style>
