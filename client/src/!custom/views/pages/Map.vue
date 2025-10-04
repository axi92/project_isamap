<script setup lang="ts">
import type { Map, ImageOverlay, LatLngBoundsExpression } from 'leaflet'
import * as L from 'leaflet'; // for CRS (and other constants)
import 'leaflet/dist/leaflet.css';
import { inject, nextTick, onMounted, ref } from 'vue';
import type { EventService } from '@/!custom/event/event.service';
import { EventType } from '@/!custom/event/event.interface';

const es = inject<EventService>('es')!
const leafletMap = ref<Map>();
const overlay = ref<ImageOverlay>();

const img = new Image()
img.src = '/images/maps/TheIsland_WP.jpg'


onMounted(() => {
  console.log(es.em());
  es.em().on(EventType.MAPDATA, async (data) => {
    console.log('on event data onMounted Map.vue mapdata:', data)
  })
  nextTick(() => {
    leafletMap.value = L.map('map', {
      crs: L.CRS.Simple,
      zoomControl: true,
      minZoom: -3,
      maxZoom: 10,
    });

    img.onload = () => {
      // Define bounds: from [0,0] (bottom-left) to [width, height] (top-right)
      // const imageBounds: LatLngBoundsExpression = [[-5, -5], [105, 105]]
      const bounds: L.LatLngBoundsExpression = [[0, 0], [img.height, img.width]]
      // Then continue with map init
      overlay.value = L.imageOverlay(img.src, bounds).addTo(leafletMap.value!);
      leafletMap.value!.fitBounds(bounds);
      leafletMap.value!.setView([2000, 2000], -2);
    }
    es.requestMapData('fixtures');
  })
})

</script>

<template>
  <!-- <div id="map" style="width: 100%; height: 100vh;"></div> -->

  <div class="map-wrapper relative w-full">
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<style>
.map-wrapper {
  height: calc(100vh - 12rem);
}

#map {
  background-color: transparent;
}
</style>
