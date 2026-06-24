<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import AboutZh from './home-about.zh.md'
import AboutEn from './home-about.en.md'

const { lang } = useData()
// Locale-aware: render the about section in the page's language.
const About = computed(() => (lang.value.startsWith('en') ? AboutEn : AboutZh))
</script>

<template>
  <section id="about" class="home-about">
    <div class="vp-doc home-about__inner">
      <component :is="About" />
    </div>
  </section>
</template>

<style scoped>
.home-about {
  max-width: 1152px;
  margin: 0 auto;
  padding: 16px 24px 64px;
}

/* 首页"关于"段字号 —— 全站 .vp-doc 是 0.82rem(~13px,偏小),首页里显得更小。
   这里单独调大更易读。想改大小,改下面这个 font-size 即可。 */
.home-about__inner {
  font-size: 1.1rem;
  line-height: 1.8;
}
</style>
