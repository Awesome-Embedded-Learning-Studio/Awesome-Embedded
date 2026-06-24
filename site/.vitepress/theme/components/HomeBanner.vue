<script setup lang="ts">
import { withBase } from 'vitepress'

// AELS brand banner (top of homepage). Dark/light variants are toggled via CSS
// in custom.css (.dark on <html>). Images live in public/images/logo/.
const light = withBase('/images/logo/AELS-Header-Logo-Light.png')
const dark = withBase('/images/logo/AELS-Header-Logo-Dark.png')
</script>

<template>
  <div class="home-banner">
    <img class="home-banner__img light" :src="light" alt="Awesome Embedded Learning Studio" />
    <img class="home-banner__img dark" :src="dark" alt="Awesome Embedded Learning Studio" />
  </div>
</template>
