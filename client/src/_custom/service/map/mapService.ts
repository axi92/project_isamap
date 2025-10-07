import { mapData } from "./mapService.constants"
import * as L from 'leaflet'; // for CRS (and other constants)
import { Marker } from 'leaflet'; // for CRS (and other constants)
import 'leaflet.awesome-markers'

export class MapService {

  getData() {
    return mapData;
  }

  createMarker() {
    const marker = new Marker([0, 0], {
      icon: L.AwesomeMarkers.icon({
        icon: 'home',
        prefix: 'fa',
        markerColor: 'green' // this color will be calculated in the future
      })
    })
    // return new Array().push(marker);
    return marker;
  }

  private convertColorToSCSSVariable(color: string): string {
    switch (color) {
      case 'orange':
        return '--p-button-warn-background'
      case 'red':
          return '--p-button-outlined-danger-border-color'
      default:
        return '--p-button-text-primary-color'
    }
  }
}


