<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';

const props = defineProps<{
  visible: boolean;
  json: unknown;
  header?: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const formattedJson = computed(() => JSON.stringify(props.json, null, 2));

const toast = useToast();

function copyToClipboard() {
  navigator.clipboard.writeText(formattedJson.value);
  toast.add({
    severity: 'success',
    summary: 'Copied!',
    life: 1500,
  });
}
</script>

<template>
  <Dialog :visible="visible" modal :header="header ?? 'JSON Viewer'" :style="{ width: '40rem' }" @update:visible="emit('update:visible', $event)">
    <div class="relative">
      <Button v-tooltip="'Copy JSON'" icon="pi pi-copy" text rounded size="small" class="absolute top-2 right-2 z-10" @click="copyToClipboard" />
      <Textarea :modelValue="formattedJson" readonly autoResize rows="32" class="w-full font-mono text-sm pr-10" />
    </div>
  </Dialog>
</template>
