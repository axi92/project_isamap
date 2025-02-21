<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ragnaImage from '@/assets/images/ragnarok.jpg';

const route = useRoute();
const mapTime = ref();
const bounds = [
  [-5, -5],
  [105, 105],
];

// Old view rule
// servers:view
// @collection.servers.owner.id:lower = @request.auth.id:lower

// TODO: add stuff from here
// https://github.com/axi92/arkLiveMap/blob/f017ba0dd09e885e0842a3404194a0572130ad7d/views/js/map.js

let pb = null;
console.log(route.query.server);
onMounted(async () => {
  pb = inject('pocketbase');
  let server = await pb.collection('servers').getOne(route.query.server);
  mapTime.value = server.data.serverclock;
  // console.log(server.data.serverclock);
  var map = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: true,
    minZoom: 1,
    maxZoom: 20,
  });
  map.setView([50, 50], 3);
  L.imageOverlay(ragnaImage, bounds).addTo(map);
});
</script>
<template>
  <div class="largeclock timeofday">
    <div class="timeofday digitalclock" id="clock">{{ mapTime }}</div>
  </div>
  <div id="map"></div>
</template>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css');
@import url('https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css');
/* @import url('ssssssssssssssssss');
@import url('ssssssssssssssssss');
@import url('ssssssssssssssssss');
@import url('ssssssssssssssssss');
@import url('ssssssssssssssssss');
@import url('ssssssssssssssssss'); */
#map {
  z-index: 0;
  width: 100vw;
  height: 100vw;
  overflow: hidden;
  margin: 0 auto;
  background: transparent;
}
</style>
