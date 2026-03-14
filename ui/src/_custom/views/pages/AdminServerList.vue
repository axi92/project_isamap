<script setup lang="ts">
import { onMounted, ref } from 'vue';
import JsonDataDialog from '@/_custom/components/JsonDataDialog.vue';
import { getAdminServerList, getServerData, resolveMapLogo } from '@/_custom/service/serverService';
import type { AdminServerInfo } from '@/_custom/service/serverService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const serverList = ref<AdminServerInfo[]>([]);
const loading = ref(true);

const showJson = ref(false);
const serverData = ref<unknown>(null);
const inspectingServerId = ref<string | null>(null);
const inspectingLabel = ref('');

onMounted(async () => {
  await loadData();
});

async function loadData() {
  loading.value = true;
  const data = await getAdminServerList();
  serverList.value = data ?? [];
  loading.value = false;
}

function convertDate(input: string | undefined) {
  if (!input) return 'no data yet';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(input));
}

async function inspectServer(item: AdminServerInfo) {
  inspectingServerId.value = item.publicId;
  inspectingLabel.value = item.serverName ?? item.description ?? item.publicId;
  try {
    const data = await getServerData(item.publicId);
    serverData.value = data;
    showJson.value = true;
  } catch (err) {
    console.error('Failed to inspect server', err);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load server data', life: 5000 });
  } finally {
    inspectingServerId.value = null;
  }
}
</script>

<template>
  <Toast />
  <div class="card">
    <div class="flex items-center gap-3 mb-6">
      <i class="pi pi-shield text-2xl" style="color: var(--p-primary-color)"></i>
      <div>
        <h2 class="text-xl font-semibold m-0">Admin - All Servers</h2>
        <span class="text-surface-500 dark:text-surface-400 text-sm">
          {{ loading ? 'Loading…' : `${serverList.length} server${serverList.length !== 1 ? 's' : ''} total` }}
        </span>
      </div>
    </div>

    <DataView :value="serverList" :loading="loading">
      <template #empty>
        <div class="text-center py-12 text-surface-400">No servers found.</div>
      </template>
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="item.publicId">
            <div
              class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
              :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
            >
              <div class="w-24 sm:w-32 shrink-0">
                <img
                  class="block mx-auto rounded w-full"
                  :src="`/images/logo/${resolveMapLogo(item.map ?? '')}`"
                  :alt="item.map ?? 'unknown'"
                />
              </div>

              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                <div class="flex flex-col gap-1">
                  <div class="text-lg font-semibold">
                    {{ item.serverName ?? 'No data received yet' }}
                  </div>
                  <div class="text-sm text-surface-500 dark:text-surface-400">{{ item.description }}</div>
                  <div class="flex items-center gap-1 mt-1">
                    <i class="pi pi-user text-xs" style="color: var(--p-primary-color)"></i>
                    <span class="text-xs font-medium">{{ item.ownerUsername ?? item.ownerUserId }}</span>
                    <span class="text-xs text-surface-400 font-mono">({{ item.ownerUserId }})</span>
                  </div>
                </div>

                <div class="flex flex-col md:items-end gap-2">
                  <span class="text-sm text-surface-500 dark:text-surface-400">
                    Last update: {{ convertDate(item.lastUpdate) }}
                  </span>
                  <span class="text-sm font-semibold">{{ item.map ?? '-' }}</span>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700 text-sm">
                      <span class="font-medium">{{ item.playerCount ?? '?' }}</span>
                      <i class="pi pi-user" style="color: var(--p-primary-color)"></i>
                    </div>
                    <Button
                      as="a"
                      label="Map"
                      :href="`/map/${item.publicId}`"
                      icon="pi pi-link"
                      variant="outlined"
                      size="small"
                    />
                    <Button
                      label="Inspect"
                      variant="outlined"
                      size="small"
                      :icon="inspectingServerId === item.publicId ? 'pi pi-spin pi-spinner' : 'pi pi-search'"
                      :disabled="inspectingServerId === item.publicId"
                      @click="inspectServer(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>

  <JsonDataDialog
    v-model:visible="showJson"
    :json="serverData"
    :header="`Payload - ${inspectingLabel}`"
    @update:visible="(v) => !v && (serverData = null)"
  />
</template>

<style scoped></style>
