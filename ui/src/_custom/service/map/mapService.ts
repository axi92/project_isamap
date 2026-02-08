import { mapProperties, type MapKey } from './mapService.constants';
import * as L from 'leaflet'; // for CRS (and other constants)
import { Marker } from 'leaflet'; // for CRS (and other constants)
import type { Map as LeafletMap } from 'leaflet';
import type { MapProperty, MarkerColor, MarkerIcon, Obelisk, PositionDTO } from './map.interface';
import type { LiveMapDTO, PlayerDTO, TribeDTO } from './dto/map.dto';

export class MapService {
  private ICONSIZE: number = 24;
  tribeMarkers = new Map<number, Marker>();
  playerMarkers = new Map<number, Marker>();
  private CustomCRS = L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(1, 0, 1, 0),
    // override the project/unproject to flip Y if needed
    // Longitude is X and increases to the right
    // Latitude is Y and increases down
    unproject: function (point: L.Point) {
      // flip X and Y
      return new L.LatLng(point.y, point.x);
    },
  });
  private mapInstance = L.map('map', {
    crs: this.CustomCRS,
    zoomControl: true,
    minZoom: 2,
    maxZoom: 8,
  }) as LeafletMap;
  private mapImage = new Image();
  private mapBounds: L.LatLngBoundsExpression = [
    [-1, -1],
    [101, 101],
  ];
  private mapOverlay?: L.ImageOverlay;
  currentMapProperties: MapProperty;
  private tribePinColor = 'green';
  private tribePinColorExpired = 'red';
  private tribePinColorExpiredCount = 17;
  private tribePinColorOrange = 'orange';
  private tribePinColorOrangeCount = 10;

  constructor(liveMapDTO: LiveMapDTO) {
    this.currentMapProperties = this.getMapProperties()[liveMapDTO.map as MapKey] as MapProperty;
    if (undefined === this.currentMapProperties) {
      this.currentMapProperties = this.getMapProperties()['generic'] as MapProperty;
    }
    this.mapImage.src = this.currentMapProperties.mapSrc;

    this.mapImage.onload = async () => {
      // Define bounds: from [0,0] (bottom-left) to [width, height] (top-right)
      this.mapBounds = this.currentMapProperties.bounds;
      // Then continue with map init
      this.mapOverlay = L.imageOverlay(this.mapImage.src, this.mapBounds).addTo(this.mapInstance);
      this.mapInstance.fitBounds(this.mapBounds);
      this.mapInstance.setView([50, 50], 3);
      if (this.currentMapProperties.obelisks) {
        this.createObelisks(this.currentMapProperties.obelisks);
      }
    };
  }

  getMapProperties(): typeof mapProperties {
    return mapProperties;
  }

  updateMapBounds(bounds: L.LatLngBoundsExpression) {
    this.mapBounds = bounds;

    if (!this.mapOverlay) {
      this.mapOverlay = L.imageOverlay(this.mapImage.src, bounds).addTo(this.mapInstance);
    } else {
      this.mapOverlay.setBounds(bounds);
    }

    // Fit map to new bounds
    this.mapInstance.fitBounds(this.mapBounds);

    // Refresh all marker positions
    this.repositionAllMarkers();
  }

  private repositionAllMarkers() {
    for (const marker of this.tribeMarkers.values()) {
      const pos = marker.getLatLng();
      marker.setLatLng([pos.lat, pos.lng]);
    }

    for (const marker of this.playerMarkers.values()) {
      const pos = marker.getLatLng();
      marker.setLatLng([pos.lat, pos.lng]);
    }
  }

  private projectLogicalToLatLng(
    y: number,
    x: number,
    bounds: L.LatLngBoundsExpression
  ): L.LatLng {
    const [[minLat, minLng], [maxLat, maxLng]] = bounds as [
      [number, number],
      [number, number]
    ];

    const lat = minLat + (y / 100) * (maxLat - minLat);
    const lng = minLng + (x / 100) * (maxLng - minLng);

    return L.latLng(lat, lng);
  }


  updateMarkers(tribes: TribeDTO[], players: PlayerDTO[]) {
    if (tribes != undefined) {
      this.updateMarkersGeneric<TribeDTO>(
        tribes,
        (t) => t.tribeid,
        (t) => {
          const lastStructureUpdateTime = Math.trunc((Math.trunc(t.elapsedTime) - Math.trunc(t.lastInAllyRangeTime)) / 60 / 60 / 24); // convert seconds to days
          return `Tribe: ${t.tribename}<br>
Last update: ${lastStructureUpdateTime} days<br>
cheat SetPlayerPos ${t.x_ue4} ${t.y_ue4} ${t.z_ue4}`;
        },
        this.tribeMarkers,
        'home',
        (t) => {
          const lastStructureUpdateTime = this.getLastStructureUpdateTimeInDays(t.elapsedTime, t.lastInAllyRangeTime);
          return this.getTribePinColor(lastStructureUpdateTime) as MarkerColor;
        }
      );
    }

    if (players != undefined) {
      this.updateMarkersGeneric<PlayerDTO>(
        players,
        (p) => p.steamid,
        (p) => `Player: ${p.playername}<br>
        Tribe: ${p.tribename}<br>
        cheat SetPlayerPos ${p.x_ue4} ${p.y_ue4} ${p.z_ue4}`,
        this.playerMarkers,
        'user',
        (p) => 'yellow'
      );
    }
  }

  updateMarkersGeneric<T extends PositionDTO>(
    data: T[],
    // eslint-disable-next-line no-unused-vars
    getId: (_item: T) => string | number,
    // eslint-disable-next-line no-unused-vars
    getPopupText: (_item: T) => string,
    markerMap: Map<string | number, L.Marker>,
    icontype: MarkerIcon,
    markerColor: (_item: T) => MarkerColor
  ) {
    const updatedIds = new Set<string | number>();
    console.log(data);
    console.log(icontype);
    for (const item of data) {
      const id = getId(item);
      updatedIds.add(id);

      const marker = markerMap.get(id);

      if (marker) {
        // Move existing marker
        marker.setLatLng([item.y_pos, item.x_pos]);
      } else {
        // Create new marker
        // TODO: create all marker with projectLogicalToLatLng()
        const newMarker = this.createMarker(item.y_pos, item.x_pos, icontype, markerColor(item)).bindPopup(getPopupText(item)).addTo(this.mapInstance);

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

  private createMarker(x: number, y: number, icontype: MarkerIcon, markerColor: MarkerColor): Marker {
    const icon = this.createDivIcon(icontype, markerColor, this.ICONSIZE);
    const marker = new Marker([x, y], {
      icon: icon,
    });
    return marker;
  }

  private convertColorToSCSSVariable(color: MarkerColor): string {
    const colorMap: Record<MarkerColor, string> = {
      orange: '--p-orange-400',
      red: '--p-rose-600',
      green: '--p-primary-color',
      yellow: '--p-yellow-300',
    };
    return colorMap[color] ?? '--p-text-primary-color';
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
              <i class="pi pi-${icon}"
                style="color:var(--p-primary-contrast-color);font-size:${size * 0.49}px;line-height:1;"></i>
            </div>
          </foreignObject>
        </svg>
      `,
      className: '',
      iconSize: [size, size * 1.5],
      iconAnchor: [size / 2, size * 1.5],
    });
  }

  createObelisks(obelisks: Obelisk[]) {
    for (const obelisk of obelisks) {
      const icon = L.icon({
        iconUrl: obelisk.src,
        iconSize: [30, 128],
        iconAnchor: [10, 90],
        popupAnchor: [0, -88],
      });
      new Marker([obelisk.x, obelisk.y], {
        icon: icon,
      }).addTo(this.mapInstance);
    }
  }

  private getLastStructureUpdateTimeInDays(elapsedTime: number, lastInAllyRangeTime: number): number {
    return Math.trunc((Math.trunc(elapsedTime) - Math.trunc(lastInAllyRangeTime)) / 60 / 60 / 24); // convert seconds to days
  }

  private getTribePinColor(lastStructureUpdateTime: number) {
    if (lastStructureUpdateTime < this.tribePinColorOrangeCount) {
      // green
      return this.tribePinColor;
    } else if (lastStructureUpdateTime < this.tribePinColorExpiredCount) {
      // orange
      return this.tribePinColorOrange;
    } else {
      return this.tribePinColorExpired;
    }
  }
}
