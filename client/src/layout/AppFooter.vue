<script setup lang="ts">
const commit = __GIT_COMMIT__;
</script>

<template>
  <div class="layout-footer">
    SAKAI by
    <a href="https://primevue.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">PrimeVue</a>
    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
      <a :href="`https://github.com/axi92/project_isamap/commit/${commit}`">{{ commit }}</a>
    </span>
  </div>
</template>
