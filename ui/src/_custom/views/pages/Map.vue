<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import type { Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { inject, nextTick, onMounted, ref, reactive, watch, onUnmounted } from 'vue';
import type { EventService } from '@/_custom/event/event.service';
import { EventType } from '@/_custom/event/event.interface';
import { MapService } from '@/_custom/service/map/mapService'; // Maybe implement later when code works and we can refactor
import { useRoute } from 'vue-router';
import type { LiveMapDTO } from '@/_custom/service/map/dto/map.dto';

//TODO: tweak coord system:
// Some sources:
// https://ark.wiki.gg/mw-1.43/extensions/DataMaps/modules/core/CoordinateSystem.js
// https://ark.wiki.gg/mw-1.43/extensions/DataMaps/modules/core/enums.js

const API_BASE_URL = __API_BASE_URL__;
const route = useRoute();
const mapId = route.params.id as string;
const es = inject<EventService>('es')!;
const leafletMap = ref<Map>();
let mapService: MapService;
const errorMessage = ref<Boolean>(false);

const showDebugDialog = ref(false);

const debugBounds = reactive({
  minLat: 0,
  minLng: 0,
  maxLat: 100,
  maxLng: 100,
});

watch(
  () => ({ ...debugBounds }),
  (b) => {
    if (!mapService) return;

    mapService.updateMapBounds([
      [b.minLat, b.minLng],
      [b.maxLat, b.maxLng],
    ]);
  },
  { deep: true }
);

onMounted(() => {
  es.em().on(EventType.MAPDATA, async (data: LiveMapDTO) => {
    // TODO: maybe send mapdata from the backend when the client connects?
    // console.log('on event data onMounted Map.vue mapdata:', data)
    // handle incomming mapdata here
    mapService.updateMarkers(data.tribes, data.players);
  });
  nextTick(async () => {
    const mapData = await fetchMapData(mapId);
    if (mapData.map) {
      mapService = new MapService(mapData); // refaktor to MapService
      leafletMap.value = mapService.mapInstance;
      mapService.updateMarkers(mapData.tribes, mapData.players);
      es.requestMapData(mapId);

      if (mapService.mapBounds) {
        const [[minLat, minLng], [maxLat, maxLng]] = mapService.mapBounds as [[number, number], [number, number]];
        debugBounds.minLat = minLat;
        debugBounds.minLng = minLng;
        debugBounds.maxLat = maxLat;
        debugBounds.maxLng = maxLng;
      }


    } else {
      errorMessage.value = true;
    }
  });
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});

async function fetchMapData(publicID: string): Promise<LiveMapDTO> {
  const res = await fetch(`${API_BASE_URL}/servers/data/${publicID}`);
  const data = await res.json();
  return data as LiveMapDTO;
}



function onKeydown(e: KeyboardEvent) {
  // ignore typing in inputs / dialogs
  const target = e.target as HTMLElement;
  if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

  if (e.key.toLowerCase() === 'd') {
    showDebugDialog.value = !showDebugDialog.value;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Message v-if="errorMessage" severity="error" icon="pi pi-times-circle" class="mb-2">Server not found, or not
      sending data!</Message>
  </div>
  <div v-if="!errorMessage" class="map-wrapper w-full">
    <div id="map" class="w-full h-full"></div>
  </div>

<Dialog
  v-model:visible="showDebugDialog"
  modal
  header="Debug Map Bounds"
  :style="{ width: '28rem' }"
>
  <div class="grid grid-cols-2 gap-3">
    <div>
      <label class="text-sm">Min Lat</label>
      <InputNumber v-model="debugBounds.minLat" inputClass="w-full" />
    </div>

    <div>
      <label class="text-sm">Min Lng</label>
      <InputNumber v-model="debugBounds.minLng" inputClass="w-full" />
    </div>

    <div>
      <label class="text-sm">Max Lat</label>
      <InputNumber v-model="debugBounds.maxLat" inputClass="w-full" />
    </div>

    <div>
      <label class="text-sm">Max Lng</label>
      <InputNumber v-model="debugBounds.maxLng" inputClass="w-full" />
    </div>
  </div>

  <template #footer>
    <Button
      label="Close"
      severity="secondary"
      @click="showDebugDialog = false"
    />
  </template>
</Dialog>
</template>

<style>
.map-wrapper {
  height: calc(100vh);
}

#map {
  background-color: transparent;
}
</style>
