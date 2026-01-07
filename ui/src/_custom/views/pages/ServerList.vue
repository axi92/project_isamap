<!--
 Feature:
 - DataView
 - add new server with custom description (limit characters so that its json save)
 - delete a server
 - show logo depending on map
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/_custom/stores/auth.store';
import CodeBlock from '@/_custom/components/CodeBlock.vue';
import { createServer, getServerList, deleteServerEntry, resolveMapLogo, calculateProgress } from '@/_custom/service/serverService';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import { Dialog } from 'primevue';
import { useDebugStore } from '@/_custom/stores/debug.store';

const userStore = useUserStore();
const debugStore = useDebugStore();

// Create Server Feature
const visibleModal = ref(false);
const visibleConfig = ref(false);
const modalServerDescription = ref();
const privateId = ref();
const exampleCode = computed(() => {
  return `[HTTPLocation]
privateid="${privateId.value}"
URL="https://apiasamap.axi92.at/api/v1/servers/data"`;
});

// Serverlist Feature
const serverList = ref();
const publicLinkPrefix = `${__API_ORIGIN__}/map/`;
const confirm = useConfirm();
const toast = useToast();
const MAX_SERVERS_PER_USER = 20;
const countServers = ref();
const progressBarValue = computed(() => {
  if (0 == countServers.value) return 0;
  return calculateProgress(countServers.value, MAX_SERVERS_PER_USER);
});

onMounted(async () => {
  await loadData();
});

async function handleCreateServer() {
  const result = await createServer(modalServerDescription, userStore.user!.userId);
  if (result != null) {
    // Only show config if the backend responded successfully
    privateId.value = result.privateId;
    visibleConfig.value = true;
    await loadData();
  } else {
    console.error('Server creation failed');
  }
}

function convertDate(input: string) {
  if (input == undefined) return 'unknown';
  const date = new Date(input);
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

async function loadData() {
  await getServerList(debugStore.enabled).then((data) => {
    countServers.value = data?.length;
    serverList.value = data;
  });
}

const confirmDelete = (event: Event, publicId: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Do you want to delete this record?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      const deleteStatus = await deleteServerEntry(publicId);
      if (deleteStatus == true) {
        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record deleted', life: 5000 });
        await loadData();
      }
    },
    reject: () => {},
  });
};
</script>

<!-- https://primevue.org/dataview/ -->
<template>
  <Toast />
  <div class="card">
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
      <div class="mt-2 md:mt-0 flex items-center">
        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-40" style="height: 8px">
          <div class="p-progressbar-value h-full" :style="{ width: progressBarValue + '%', backgroundColor: 'var(--p-primary-color)' }"></div>
        </div>
        <span class="text-surface-500 dark:text-surface-400 text-sm ml-4 font-medium">{{ countServers }}/{{ MAX_SERVERS_PER_USER }}</span>
      </div>
      <div v-if="userStore.user && countServers < MAX_SERVERS_PER_USER" class="flex flex-col md:items-end gap-8">
        <Button type="button" label="Create config" icon="pi pi-plus" @click="visibleModal = true" />
      </div>
    </div>
    <DataView :value="serverList">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
              <div class="w-24 sm:w-40 relative">
                <img class="block xl:block mx-auto rounded w-full" :src="`/images/logo/${resolveMapLogo(item.map)}`" :alt="item.name" />
              </div>
              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                  <div>
                    <div class="text-lg font-medium mt-2">{{ item.serverName ?? 'No data received yet' }}</div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.description }}</span>
                  </div>
                  <div class="bg-surface-100 p-1" style="border-radius: 30px">
                    <div
                      class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                      style="
                        border-radius: 30px;
                        box-shadow:
                          0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                          0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                      "
                    >
                      <span class="text-surface-900 font-medium text-sm">{{ item.playerCount ?? '?' }}</span>
                      <i class="pi pi-user" style="color: var(--p-primary-color)"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">last Update {{ convertDate(item.lastUpdate) }}</span>
                  <span class="text-xl font-semibold">{{ item.map }}</span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button as="a" label="Map" :href="publicLinkPrefix + item.publicId" icon="pi pi-link" variant="outlined"></Button>
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-trash" label="Delete" severity="danger" class="flex-auto md:flex-initial whitespace-nowrap" @click="confirmDelete($event, item.publicId)"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
  <!-- TODO: remove close icon closable="false" should be the prop but it does nothing -->
  <Dialog v-model:visible="visibleModal" modal header="Add Server" :style="{ width: '32rem' }" pt:mask:class="backdrop-blur-sm">
    <form @submit.prevent="handleCreateServer">
      <div v-if="!visibleConfig" class="flex items-center gap-4 mb-4">
        <label for="description" class="font-semibold w-24">Description</label>
        <InputText id="description" v-model="modalServerDescription" class="flex-auto" autocomplete="off" maxlength="64" autofocus />
      </div>
      <Message v-if="visibleConfig" class="mb-2" severity="warn">This is the only time you will see the <b>privateid</b>! Save it!</Message>
      <CodeBlock v-if="visibleConfig" :code="exampleCode" />
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Close"
          severity="secondary"
          @click="
            modalServerDescription = '';
            visibleConfig = false;
            visibleModal = false;
          "
        ></Button>
        <Button v-if="!visibleConfig" type="submit" label="Create"></Button>
      </div>
    </form>
  </Dialog>
</template>

<style scoped></style>
