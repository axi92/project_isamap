export interface MapProperty {
  name: string;
  displayName: string;
  mapSrc: string;
  imageLogo?: string;
  obelisks?: Obelisk[];
  bounds: [[number, number], [number, number]];
}

export interface Obelisk {
  description: string;
  color: 'red' | 'green' | 'blue';
  src: string;
  x: number;
  y: number;
}

export type MarkerColor = 'orange' | 'red' | 'green' | 'yellow';

export type MarkerIcon = 'user' | 'home';

export interface PositionDTO {
  x_pos: number;
  y_pos: number;
}
