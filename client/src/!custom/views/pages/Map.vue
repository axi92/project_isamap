<script setup lang="ts">
import type { EventService } from '@/!custom/event/event.service';
// import L, { map, CRS, imageOverlay, ImageOverlay } from 'leaflet';
// import type { LatLngBoundsExpression, Map } from 'leaflet'
// TODO: imports from leaflet are not working in browser
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { inject, nextTick, onMounted, ref } from 'vue';

const es = inject<EventService>('es')!
const leafletMap  = ref<L.Map>();
const overlay = ref<L.ImageOverlay>();

es.requestMapData('publicID 54654')

const img = new Image()
img.src = '/images/maps/TheIsland_WP.jpg'

// Define bounds: from [0,0] (bottom-left) to [width, height] (top-right)
const imageBounds: L.LatLngBoundsExpression = [[-5, -5], [105, 105]]

onMounted(() => {
  nextTick(() => {
    leafletMap .value = L.map('map', {
      crs: L.CRS.Simple,
      zoomControl: true,
      minZoom: 1,
      maxZoom: 20,
    });

    img.onload = () => {
      const bounds: L.LatLngBoundsExpression = [[0, 0], [img.height, img.width]]
      // Then continue with map init
      // L.imageOverlay(img.src, imageBounds).addTo(map)
      overlay.value = L.imageOverlay(img.src, bounds).addTo(leafletMap .value!);
      leafletMap .value!.fitBounds(bounds);
      leafletMap .value!.setView([50, 50], 3);
    }

  })
})

</script>

<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>
