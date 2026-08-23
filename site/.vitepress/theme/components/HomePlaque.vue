<script setup lang="ts">
// 首页区块铭牌：§ ROADMAP / § APPROACH / § ABOUT 统一的"挂牌"。
defineProps<{
  tag: string
  title: string
  note?: string
  center?: boolean
}>()
</script>

<template>
  <div class="aels-plaque" :class="{ 'aels-plaque--center': center }">
    <span class="aels-plaque__tag">{{ tag }}</span>
    <span class="aels-plaque__title">{{ title }}</span>
    <span v-if="note" class="aels-plaque__note">{{ note }}</span>
  </div>
</template>

<style scoped>
.aels-plaque {
  max-width: 1152px;
  margin: 56px auto 22px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.aels-plaque--center {
  justify-content: center;
}

.aels-plaque__tag {
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

.aels-plaque__title {
  font-size: 21px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.aels-plaque__note {
  margin-left: auto;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media (max-width: 639px) {
  .aels-plaque__note {
    display: none;
  }
}
</style>
