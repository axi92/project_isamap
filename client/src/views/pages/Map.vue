<script setup lang="ts">
import type { EventService } from '@/event/event.service';
import * as L from 'leaflet'
import { inject, onMounted } from 'vue';

const es = inject<EventService>('es')!
es.requestMapData('publicID 54654')

const img = new Image()
img.src = '/images/maps/TheIsland_WP.jpg'

// Define bounds: from [0,0] (bottom-left) to [width, height] (top-right)
const imageBounds: L.LatLngBoundsExpression = [[-5, -5], [105, 105]]

onMounted(() => {
  const map = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: true,
    minZoom: 1,
    maxZoom: 20,
  })

  img.onload = () => {
    const bounds: L.LatLngBoundsExpression = [[0, 0], [img.height, img.width]]
    // Then continue with map init
    L.imageOverlay(img.src, imageBounds).addTo(map)
  }

  map.setView([50, 50], 3);

})

</script>

<template>
  <div id='map'></div>
</template>
