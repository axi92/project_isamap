<template>
  <div class="supported-maps-widget">
    <h2 class="widget-heading">Supported Maps</h2>
    <div class="map-grid">
      <Card
        v-for="([key, map]) in mapsArray"
        :key="key"
        class="map-card"
        :style="map.imageLogo ? { backgroundImage: `url(${map.imageLogo})` } : {}"
      >
        <template #content>
          <div class="map-name">{{ map.displayName }}</div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapProperties } from '@/_custom/service/map/mapService.constants';
import Card from 'primevue/card';
import type { MapProperty } from '@/_custom/service/map/map.interface';

const mapsArray = Object.entries(mapProperties)
  .filter(([key]) => key !== 'generic') as [string, MapProperty][];
</script>

<style scoped>
.supported-maps-widget {
  padding: 1rem;
}

/* 🎨 Nice heading */
.widget-heading {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;           /* shrink to text width */
  padding-bottom: 0.25rem;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
}

.map-card {
  position: relative;
  width: 12rem;       /* default bigger size */
  height: 12rem;      /* square card */
  min-width: 8rem;    /* won’t shrink below this */
  min-height: 8rem;
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;    /* prevents shrinking in flex container */
}

/* Sm breakpoint */
@media (min-width: 640px) {
  .map-grid {
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  }
}

/* Text overlay in top-left corner */
.map-name {
  position: absolute;
  top: 2px;
  left: 2px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0.25rem;
  font-weight: bold;
  color: white;
  font-size: 0.875rem;
  pointer-events: none;
}
</style>
