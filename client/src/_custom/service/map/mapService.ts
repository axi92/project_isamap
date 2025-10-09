import { mapProperties, type MapKey } from './mapService.constants';
import * as L from 'leaflet'; // for CRS (and other constants)
import { Marker } from 'leaflet'; // for CRS (and other constants)
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet.awesome-markers';
import type { MarkerColor, MarkerIcon, PositionDTO } from './map.interface';
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
    this.updateMarkersGeneric<TribeDTO>(
      tribes,
      (t) => t.tribeid,
      (t) => `Tribe: ${t.tribename}`,
      this.tribeMarkers
    );

    this.updateMarkersGeneric<PlayerDTO>(
      players,
      (p) => p.steamid,
      (p) => `Player: ${p.playername}`,
      this.playerMarkers
    );
  }

  updateMarkersGeneric<T extends PositionDTO>(
    data: T[],
    // eslint-disable-next-line no-unused-vars
    getId: (_item: T) => string | number,
    // eslint-disable-next-line no-unused-vars
    getPopupText: (_item: T) => string,
    markerMap: Map<string | number, L.Marker>
  ) {
    const updatedIds = new Set<string | number>();

    for (const item of data) {
      const id = getId(item);
      updatedIds.add(id);

      const marker = markerMap.get(id);

      if (marker) {
        // Move existing marker
        marker.setLatLng([item.x_pos, item.y_pos]);
      } else {
        // Create new marker
        const newMarker = this.createMarker(item.x_pos, item.y_pos).bindPopup(getPopupText(item)).addTo(this.mapInstance);

        markerMap.set(id, newMarker);
      }
    }

    // Remove old markers
    for (const [id, marker] of markerMap) {
      if (!updatedIds.has(id)) {
        this.mapInstance.removeLayer(marker);
        markerMap.delete(id);
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
    const colorMap: Record<MarkerColor, string> = {
      orange: '--p-button-warn-background',
      red: '--p-button-outlined-danger-border-color',
      green: '--p-button-text-primary-color',
    };
    return colorMap[color] ?? '--p-button-text-primary-color';
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
