<script setup lang="ts">
// import L, { map, CRS, imageOverlay, ImageOverlay } from 'leaflet';
// import type { LatLngBoundsExpression, Map } from 'leaflet'
// TODO: imports from leaflet are not working in browser
import type { Map, ImageOverlay, LatLngBoundsExpression } from 'leaflet'
import * as L from 'leaflet'; // for CRS (and other constants)
// import L from 'leaflet'; // for CRS (and other constants)
import 'leaflet/dist/leaflet.css';
import { inject, nextTick, onMounted, ref } from 'vue';
import type { EventService } from '@/!custom/event/event.service';

const es = inject<EventService>('es')!
const leafletMap = ref<Map>();
const overlay = ref<ImageOverlay>();

es.requestMapData('publicID 54654')

const img = new Image()
img.src = '/images/maps/TheIsland_WP.jpg'

// Define bounds: from [0,0] (bottom-left) to [width, height] (top-right)
const imageBounds: LatLngBoundsExpression = [[-5, -5], [105, 105]]

onMounted(() => {
  nextTick(() => {
    console.log(L);
    leafletMap.value = L.map('map', {
      crs: L.CRS.Simple,
      zoomControl: true,
      minZoom: -2,
      maxZoom: 10,
    });

    img.onload = () => {
      const bounds: L.LatLngBoundsExpression = [[0, 0], [img.height, img.width]]
      // Then continue with map init
      // L.imageOverlay(img.src, imageBounds).addTo(map)
      overlay.value = L.imageOverlay(img.src, bounds).addTo(leafletMap.value!);
      leafletMap.value!.fitBounds(bounds);
      leafletMap.value!.setView([2000, 2000], -2);
    }

  })
})

</script>

<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>

  <div class="map-wrapper relative w-full h-full">
    <!-- <div id="map" class="absolute inset-0"></div> -->
  </div>
</template>
