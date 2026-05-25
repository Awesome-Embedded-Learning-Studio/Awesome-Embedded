<template>
  <div class="project-grid">
    <slot />
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin: 1.5em 0;
}

@media (max-width: 639px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
