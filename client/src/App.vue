<script setup>
import { ref, onMounted, provide } from 'vue';
import PocketBase from 'pocketbase';

let pb = null;
let currentUser = ref();

onMounted(async () => {
  pb = new PocketBase('http://127.0.0.1:8090');
  currentUser.value = pb.authStore.record;
  // console.log(pb.authStore.record);
  pb.authStore.onChange(() => {
    currentUser.value = pb.authStore.record;
  }, true);
  // console.log(pb.files.getURL(pb.authStore.record, 'd4c868f13345db8c809bcfbe786aec94_a5gxszys5z_edwqfdi9qt.png'));
  // console.log(pb.getFile(pb.authStore.record, pb.authStore.record.avatar));
  provide('pocketbase', pb);
  provide('currentUser', currentUser.value);
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
