<script setup lang="ts">
import type { Map, ImageOverlay } from 'leaflet'
import * as L from 'leaflet'; // for CRS (and other constants)
import 'leaflet/dist/leaflet.css';
import { inject, nextTick, onMounted, ref } from 'vue';
import type { EventService } from '@/_custom/event/event.service';
import { EventType } from '@/_custom/event/event.interface';
// import { MapService } from '@/!custom/service/map/mapService';

const es = inject<EventService>('es')!
const leafletMap = ref<Map>();
// const mapService = new MapService();
const ICONSIZE: number = 28;

const img = new Image()
img.src = '/images/maps/TheIsland_WP.jpg'


onMounted(() => {
  es.em().on(EventType.MAPDATA, async (data) => {
    // console.log('on event data onMounted Map.vue mapdata:', data)
    // handle incomming mapdata here
  })
  nextTick(() => {
    leafletMap.value = L.map('map', {
      crs: L.CRS.Simple,
      zoomControl: true,
      minZoom: -3,
      maxZoom: 10,
    }) as Map;
    console.log('map initialized')

    img.onload = async () => {
      // Define bounds: from [0,0] (bottom-left) to [width, height] (top-right)
      // const imageBounds: LatLngBoundsExpression = [[-5, -5], [105, 105]]
      const bounds: L.LatLngBoundsExpression = [[0, 0], [img.height, img.width]]
      // Then continue with map init
      const overlay = ref<ImageOverlay>();
      overlay.value = L.imageOverlay(img.src, bounds).addTo(leafletMap.value!);
      leafletMap.value!.fitBounds(bounds);
      leafletMap.value!.setView([2000, 2000], -2);
    }
    es.requestMapData('fixtures');
    createMarker();
  })
})

const ObeliskIcon = L.Icon.extend({
  options: {
    iconSize: [20],
    iconAnchor: [10, 90],
    popupAnchor: [0, -88]
  }
})

// const marker = mapService.createMarker();
// marker.addTo(leafletMap.value as Map)
function createMarker(): null {
  const markers = [
    { lat: 1200, lng: 1200, icon: 'pi-map-marker', color: 'red' },
    { lat: 0, lng: 0, icon: 'pi-map-marker', color: 'pink' },
  ];

  markers.forEach(m => {
    const icon = L.divIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="${ICONSIZE}" height="${ICONSIZE * 1.6}"
            viewBox="0 0 16 26"
            style="display:block;overflow:visible;">
          <!-- Marker pin shape -->
          <path d="M8 25s8-8.5 8-15A8 8 0 0 0 0 10c0 6.5 8 15 8 15z"
                fill="var(--p-button-text-primary-color)" />

          <!-- Centered PrimeIcons icon -->
          <foreignObject x="0" y="3" width="16" height="12">
            <div xmlns="http://www.w3.org/1999/xhtml"
                style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
              <i class="pi pi-star"
                style="color:var(--p-button-primary-color);font-size:${ICONSIZE * 0.49}px;line-height:1;"></i>
            </div>
          </foreignObject>
        </svg>
      `,
      className: '',
      iconSize: [ICONSIZE, ICONSIZE * 1.5],
      iconAnchor: [ICONSIZE / 2, ICONSIZE * 1.5],
      // html: `<svg xmlns="http://www.w3.org/2000/svg" width="${ICONSIZE}" height="${ICONSIZE}" fill="var(--primary-color)" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      //         <path d="M8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10"/>
      //       </svg>`,
      // html: `<i class="pi ${m.icon}" style="color:${m.color}; font-size: 24px;"></i>`,
    });
    console.log('create marker', m.icon, 'to map:', leafletMap.value)
    L.marker([m.lat, m.lng], { icon: icon }).addTo(leafletMap.value!);
  });
  return null;
}



</script>

<template>
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
