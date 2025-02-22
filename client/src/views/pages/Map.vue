<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ragnaImage from '@/assets/images/ragnarok.jpg';
import obelisk_green from '@/assets/images/obelisk_green.png';
import obelisk_red from '@/assets/images/obelisk_red.png';
import obelisk_blue from '@/assets/images/obelisk_blue.png';

const route = useRoute();
const mapTime = ref();
const bounds = [
  [-5, -5],
  [105, 105],
];
let serverData = {};

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
  serverData = server.data;

  // Subscribe to changes only in the specified record
  pb.collection('servers').subscribe(
    route.query.server,
    function (e) {
      // console.log('subscription event');
      // console.log(e.action);
      // console.log(e.record.data);
      serverData = e.record.data;
    },
    {
      /* other options like: filter, expand, custom headers, etc. */
    }
  );

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
  // Handle window resize
  window.addEventListener('resize', () => {
    map.invalidateSize();
  });

  const obelIcon = L.Icon.extend({
    options: {
      iconSize: [20],
      iconAnchor: [10, 90],
      popupAnchor: [0, -88],
    },
  });

  const greenObelIcon = new obelIcon({
      iconUrl: obelisk_green,
    }),
    redObelIcon = new obelIcon({
      iconUrl: obelisk_red,
    }),
    blueObelIcon = new obelIcon({
      iconUrl: obelisk_blue,
    });

  let markerLength = mark.length;
  for (i = 0; i < markerLength; i++) {
    var m = L.marker([100 - mark[i][0], mark[i][1]], {
      icon: L.AwesomeMarkers.icon({
        icon: mark[i][2],
        prefix: 'fa',
        markerColor: mark[i][3],
      }),
    }).bindPopup(mark[i][4] + '<br />cheat setplayerpos ' + Math.trunc(mark[i][6]) + ' ' + Math.trunc(mark[i][7]) + ' ' + (parseInt(Math.trunc(mark[i][8])) + parseInt(1000)) + '<br />' + mark[i][5]); // .addTo(map)
  }
});
</script>
<template>
  <div class="largeclock timeofday">
    <div class="timeofday digitalclock" id="clock">{{ mapTime }}</div>
  </div>
  <div id="map" class="map-container"></div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css');

#map {
  z-index: 0;
  /* width: 100vw; */
  /* height: 100vw; */
  overflow: hidden;
  margin: 0 auto;
  background: transparent;
}

.map-container {
  width: 100%;
  /* height: 100%; */
  height: 80vh;
  overflow: hidden;
}
</style>
