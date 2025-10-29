<!--
 TODO:
 Feature:
 - DataView in grid style
 - add new server with custom description (limit characters so that its json save)
 - delet a server
 - show logo depending on map
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/_custom/stores/auth.store';
import CodeBlock from '@/_custom/components/CodeBlock.vue';
import { createServer, getServerList } from '@/_custom/service/serverService';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';

const userStore = useUserStore();

// Create Server Feature
const visibleModal = ref(false);
const visibleConfig = ref(false);
const modalServerDescription = ref();
const privateId = ref();
const exampleCode = computed(() => {
  return `[HTTPLocation]
  privateid="${privateId.value}"
URL="https://arkmap.axi92.at/rest/v1"`;
});

// Serverlist Feature
const serverList = ref();
const publicLinkPrefix = 'http://localhost:5173/map/';
const confirm = useConfirm();
const toast = useToast();

onMounted(() => {
  getServerList().then((data) => (serverList.value = data));
});

async function handleCreateServer() {
  const result = await createServer(modalServerDescription, userStore.user!.userId);
  if (result != null) {
    // Only show config if the backend responded successfully
    privateId.value = result.privateId;
    visibleConfig.value = true;
  } else {
    console.error('Server creation failed');
  }
}

function convertDate(input: string) {
  if (input == undefined) return 'unknown';
  const date = new Date(input);
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

const confirmDelete = (event: Event) => {
  console.log(event);
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
      // TODO: Delete Server
      toast.add({ severity: 'error', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => {},
  });
};
</script>

<!-- https://primevue.org/dataview/ -->
<template>
  <Toast />
  <div v-if="userStore.user">
    <Button type="button" label="Create server..." icon="pi pi-plus" @click="visibleModal = true" />
  </div>
  <div v-else>
    <div class="flex flex-col gap-4">
      <Message severity="error" icon="pi pi-times-circle" class="mb-2">Nothing to show.</Message>
    </div>
  </div>
  <div class="card">
    <DataView :value="serverList">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
              <div class="md:w-40 relative">
                <img class="block xl:block mx-auto rounded w-full" :src="`/images/logo/ASA_Logo_transparent.png`" :alt="item.name" />
                <div class="absolute bg-black/70 rounded-border" style="left: 4px; top: 4px">
                  <!-- <Tag :value="item.inventoryStatus" :severity="warn"></Tag> -->
                </div>
              </div>
              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">last Update {{ convertDate(item.lastUpdate) }}</span>
                    <div class="text-lg font-medium mt-2">{{ item.serverName }}</div>
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
                      <span class="text-surface-900 font-medium text-sm">{{ item.playerCount }}</span>
                      <i class="pi pi-user" style="color: var(--p-primary-color)"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end gap-8">
                  <span class="text-xl font-semibold">{{ item.map }}</span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <Button as="a" label="Map" :href="publicLinkPrefix + item.publicId" icon="pi pi-link" variant="outlined"></Button>
                    <Button icon="pi pi-eye" label="Raw data" variant="outlined"></Button>
                    <!-- <Button as="a" label="External" href="https://vuejs.org/" target="_blank" rel="noopener" /> -->
                    <ConfirmPopup></ConfirmPopup>
                    <Button icon="pi pi-trash" label="Delete" severity="danger" class="flex-auto md:flex-initial whitespace-nowrap" @click="confirmDelete($event)"></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
  <Dialog v-model:visible="visibleModal" modal header="Add Server" :style="{ width: '32rem' }">
    <div v-if="!visibleConfig" class="flex items-center gap-4 mb-4">
      <label for="description" class="font-semibold w-24">Description</label>
      <InputText id="description" v-model="modalServerDescription" class="flex-auto" autocomplete="off" maxlength="64" autofocus />
    </div>
    <CodeBlock v-if="visibleConfig" :code="exampleCode" />
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="
          modalServerDescription = '';
          visibleConfig = false;
          visibleModal = false;
        "
      ></Button>
      <Button v-if="!visibleConfig" type="button" label="Create" @click="handleCreateServer"></Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
