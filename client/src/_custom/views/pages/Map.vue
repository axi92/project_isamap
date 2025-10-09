<script setup lang="ts">
import type { Map } from 'leaflet';
import * as L from 'leaflet'; // for CRS (and other constants)
import 'leaflet/dist/leaflet.css';
import { inject, nextTick, onMounted, ref } from 'vue';
import type { EventService } from '@/_custom/event/event.service';
import { EventType } from '@/_custom/event/event.interface';
import { MapService } from '@/_custom/service/map/mapService'; // Maybe implement later when code works and we can refactor
import { useRoute } from 'vue-router';
import type { LiveMapDTO } from '@/_custom/service/map/dto/map.dto';

//TODO: tweak coord system:
// Some sources:
// https://ark.wiki.gg/mw-1.43/extensions/DataMaps/modules/core/CoordinateSystem.js
// https://ark.wiki.gg/mw-1.43/extensions/DataMaps/modules/core/enums.js

const route = useRoute();
const mapId = route.params.id as string;
const es = inject<EventService>('es')!;
const leafletMap = ref<Map>();
let mapService: MapService;

onMounted(() => {
  es.em().on(EventType.MAPDATA, async (data: LiveMapDTO) => {
    // TODO: maybe send mapdata from the backend when the client connects?
    // console.log('on event data onMounted Map.vue mapdata:', data)
    // handle incomming mapdata here
    mapService.updateMarkers(data.tribes, data.players);
  });
  nextTick(async () => {
    const mapData = await fetchMapData(mapId);
    mapService = new MapService(mapData); // refaktor to MapService
    leafletMap.value = mapService.mapInstance;
    mapService.updateMarkers(mapData.tribes, mapData.players);
    es.requestMapData(mapId);
  });
});

const ObeliskIcon = L.Icon.extend({
  options: {
    iconSize: [20],
    iconAnchor: [10, 90],
    popupAnchor: [0, -88],
  },
});

async function fetchMapData(publicID: string): Promise<LiveMapDTO> {
  const res = await fetch(`http://localhost:3000/api/v1/servers/data/${publicID}`);
  const data = await res.json();
  return data as LiveMapDTO;
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
