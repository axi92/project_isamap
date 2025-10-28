<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const props = defineProps<{
  code: string;
}>();

const toast = useToast();

function copyToClipboard() {
  navigator.clipboard.writeText(props.code);
  toast.add({
    severity: 'success',
    summary: 'Copied!',
    life: 1500,
  });
}
</script>

<template>
  <div class="relative rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-300 p-4 font-mono text-sm overflow-x-auto">
    <Button icon="pi pi-copy" text rounded size="small" class="!absolute !top-2 !right-2 hover:bg-surface-200 dark:hover:bg-surface-700" @click="copyToClipboard" />
    <pre class="whitespace-pre-wrap break-words text-sm">{{ code }}</pre>
  </div>
</template>
