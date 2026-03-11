import { mapProperties, type MapKey } from './mapService.constants';
import * as L from 'leaflet'; // for CRS (and other constants)
import { Marker } from 'leaflet'; // for CRS (and other constants)
import type { Map as LeafletMap } from 'leaflet';
import type { MapProperty, MarkerColor, MarkerIcon, Obelisk, PositionDTO } from './map.interface';
import type { LiveMapDTO, PlayerDTO, TribeDTO } from './dto/map.dto';

export class MapService {
  private ICONSIZE: number = 24;
  tribeMarkers = new Map<string, Marker>();
  playerMarkers = new Map<string, Marker>();
  private tribeLogicalPositions = new Map<string, { x: number; y: number }>();
  private playerLogicalPositions = new Map<string, { x: number; y: number }>();
  logicalTransform = {
    offsetX: 0.7,     // logical units
    offsetY: 0.7,     // logical units
    scaleX: 0.99,      // usually 1
    scaleY: 0.99,      // usually 1
    invertY: false,  // common for image coords
  };
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
  mapInstance = L.map('map', {
    crs: this.CustomCRS,
    zoomControl: true,
    minZoom: 2,
    maxZoom: 8,
  }) as LeafletMap;
  private mapImage = new Image();
  mapBounds: L.LatLngBoundsExpression = [
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
      console.log('imageOverlay.addTo in onload')
      this.updateMapBounds(this.currentMapProperties.bounds);
      this.mapInstance.setView([50, 50], 3);
      if (this.currentMapProperties.obelisks) {
        this.createObelisks(this.currentMapProperties.obelisks);
      }
      this.updateMarkers(liveMapDTO.tribes, liveMapDTO.players);
    };
  }

  getMapProperties(): typeof mapProperties {
    return mapProperties;
  }

  updateMapBounds(bounds: L.LatLngBoundsExpression) {
    this.mapBounds = bounds;
    if (!this.mapOverlay) {
      console.log('updateMapBounds - imageOverlay.addTo')
      this.mapOverlay = L.imageOverlay(this.mapImage.src, bounds).addTo(this.mapInstance);
    } else {
      this.mapOverlay.setBounds(bounds);
    }

    // Fit map to new bounds
    this.mapInstance.fitBounds(this.mapBounds);

    // TODO: Refresh all marker positions
    this.repositionAllMarkers();
  }

  private repositionAllMarkers() {
    for (const [id, marker] of this.tribeMarkers) {
      const pos = this.tribeLogicalPositions.get(id);
      if (!pos) continue;

      marker.setLatLng(
        this.projectLogicalToLatLng(pos.y, pos.x, this.mapBounds)
      );
    }

    for (const [id, marker] of this.playerMarkers) {
      const pos = this.playerLogicalPositions.get(id);
      if (!pos) continue;

      marker.setLatLng(
        this.projectLogicalToLatLng(pos.y, pos.x, this.mapBounds)
      );
    }
  }

  private projectLogicalToLatLng(
    logicalY: number,
    logicalX: number,
    bounds: L.LatLngBoundsExpression
  ): L.LatLng {
    const [[minLat, minLng], [maxLat, maxLng]] = bounds as [
      [number, number],
      [number, number]
    ];

    const width = maxLng - minLng;
    const height = maxLat - minLat;

    // Apply offset & scale
    let x = (logicalX + this.logicalTransform.offsetX) * this.logicalTransform.scaleX;
    let y = (logicalY + this.logicalTransform.offsetY) * this.logicalTransform.scaleY;

    // Normalize (0-100 → 0-1)
    x /= 100;
    y /= 100;

    // Flip Y if needed
    if (this.logicalTransform.invertY) {
      y = 1 - y;
    }

    const lng = minLng + x * width;
    const lat = minLat + y * height;

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
        this.tribeLogicalPositions,
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
        this.playerLogicalPositions,
        'user',
        (p) => 'yellow'
      );
    }
  }

  private updateMarkersGeneric<T extends PositionDTO>(
    data: T[],
    // eslint-disable-next-line no-unused-vars
    getId: (_item: T) => string,
    // eslint-disable-next-line no-unused-vars
    getPopupText: (_item: T) => string,
    markerMap: Map<string, L.Marker>,
    logicalMap: Map<string, { x: number; y: number }>,
    icontype: MarkerIcon,
    markerColor: (_item: T) => MarkerColor
  ) {
    const updatedIds = new Set<string>();
    console.log(data);
    console.log(icontype);
    for (const item of data) {
      const id = getId(item);
      updatedIds.add(id);

      // ✅ SOURCE OF TRUTH
      logicalMap.set(id, {
        x: item.x_pos,
        y: item.y_pos,
      });

      const projected = this.projectLogicalToLatLng(
        item.y_pos,
        item.x_pos,
        this.mapBounds
      );

      const marker = markerMap.get(id);

      if (marker) {
        // Move existing marker
        marker.setLatLng(projected);
      } else {
        // Create new marker
        // TODO: create all marker with projectLogicalToLatLng()
        const newMarker = this.createMarker(projected.lat, projected.lng, icontype, markerColor(item)).bindPopup(getPopupText(item)).addTo(this.mapInstance);

        markerMap.set(id, newMarker);
      }
    }

    // Remove old markers
    for (const [id, marker] of markerMap) {
      if (!updatedIds.has(id)) {
        this.mapInstance.removeLayer(marker);
        markerMap.delete(id);
        logicalMap.delete(id);
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
