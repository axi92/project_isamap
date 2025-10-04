export interface MapProperties {
  name: string;
  displayName: string;
  mapSrc: string;
  obelisks?: Obelisk[];
  bounds: [[number, number], [number, number]];
}

interface Obelisk {
  description: string;
  color: 'red' | 'green' | 'blue';
  x: number;
  y: number;
}
