import { mapProperties, type MapKey } from './mapService.constants';
import * as L from 'leaflet'; // for CRS (and other constants)
import { Marker } from 'leaflet'; // for CRS (and other constants)
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet.awesome-markers';
import type { MarkerColor, MarkerIcon } from './map.interface';
import type { LiveMapDTO, PlayerDTO, TribeDTO } from './dto/map.dto';

export class MapService {
  tribeMarkers = new Map<number, Marker>();
  playerMarkers = new Map<number, Marker>();
  mapInstance = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: true,
    minZoom: -3,
    maxZoom: 10,
  }) as LeafletMap;
  mapImage = new Image();
  currentMapProperties: typeof mapProperties;

  constructor(liveMapDTO: LiveMapDTO) {
    this.currentMapProperties = this.getMapProperties()[liveMapDTO.map as MapKey];
    this.mapImage.src = '/images/maps/TheIsland_WP.jpg';
  }

  getMapProperties(): typeof mapProperties {
    return mapProperties;
  }

  updateMarkers(tribes: TribeDTO[], players: PlayerDTO[]) {
    const updatedTribeIds = new Set<number>();
    for (const tribe of tribes) {
      updatedTribeIds.add(tribe.tribeid);

      // Does this player already have a marker?
      const marker = this.tribeMarkers.get(tribe.tribeid);

      if (marker) {
        // Move existing marker
        marker.setLatLng([tribe.x_pos, tribe.y_pos]);
      } else {
        // Create a new marker
        const newMarker = L.marker([tribe.x_pos, tribe.y_pos]).bindPopup(`Player ${tribe.tribeid}`).addTo(this.mapInstance);

        this.tribeMarkers.set(tribe.tribeid, newMarker);
      }
    }

    // Remove markers for players that disappeared
    for (const [id, marker] of this.tribeMarkers) {
      if (!updatedTribeIds.has(id)) {
        this.mapInstance.removeLayer(marker);
        this.tribeMarkers.delete(id);
      }
    }
  }

  private createMarker(x: number, y: number): Marker {
    const icon = this.createDivIcon('home', 'green', 20);
    const marker = new Marker([x, y], {
      icon: icon,
    });
    return marker;
  }

  private convertColorToSCSSVariable(color: MarkerColor): string {
    switch (color) {
      case 'orange':
        return '--p-button-warn-background';
      case 'red':
        return '--p-button-outlined-danger-border-color';
      default:
        return '--p-button-text-primary-color';
    }
  }

  private createDivIcon(icon: MarkerIcon, color: MarkerColor, size: number): L.DivIcon {
    return L.divIcon({
      html: `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="${size}" height="${size * 1.6}"
            viewBox="0 0 16 26"
            style="display:block;overflow:visible;">
          <!-- Marker pin shape -->
          <path d="M8 25s8-8.5 8-15A8 8 0 0 0 0 10c0 6.5 8 15 8 15z"
                fill="var(${this.convertColorToSCSSVariable(color)})" />

          <!-- Centered PrimeIcons icon -->
          <foreignObject x="0" y="3" width="16" height="12">
            <div xmlns="http://www.w3.org/1999/xhtml"
                style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
              <i class="pi pi-user"
                style="color:var(--p-button-primary-color);font-size:${size * 0.49}px;line-height:1;"></i>
            </div>
          </foreignObject>
        </svg>
      `,
      className: '',
      iconSize: [size, size * 1.5],
      iconAnchor: [size / 2, size * 1.5],
    });
  }
}
