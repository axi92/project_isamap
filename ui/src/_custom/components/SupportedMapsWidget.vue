<template>
  <div class="supported-maps-widget">
    Supported Maps:
    <div class="map-grid">
      <Card
        v-for="([key, map]) in mapsArray"
        :key="key"
        class="map-card"
        :style="map.imageLogo ? { backgroundImage: `url(${map.imageLogo})` } : {}"
      >
        <div class="map-name">{{ map.displayName }}</div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapProperties, type MapKey } from '@/_custom/service/map/mapService.constants';
import Card from 'primevue/card';
import type { MapProperty } from '@/_custom/service/map/map.interface';

// Convert mapProperties object to array for iteration
const mapsArray = Object.entries(mapProperties) as [string, MapProperty][];
</script>

<style scoped>
.supported-maps-widget {
  padding: 1rem;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.map-card {
  position: relative;
  text-align: center;
  color: white;
  height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.map-name {
  width: 100%;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  text-align: center;
}
</style>
