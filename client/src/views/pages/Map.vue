<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let pb = null;
console.log(route.query.server);
onMounted(async () => {
  pb = inject('pocketbase');
});
</script>

<template>
  <div className="map">
    <h5>Empty Page</h5>
    <p>Use this page to start from scratch and place your custom content.</p>
  </div>
</template>
