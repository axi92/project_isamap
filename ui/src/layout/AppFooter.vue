<script setup lang="ts">
const commit = __GIT_COMMIT__;
</script>

<template>
  <div class="layout-footer">
    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
      Version: <a :href="`https://github.com/axi92/project_isamap/commit/${commit}`">{{ commit }}</a>
    </span>
  </div>
</template>
