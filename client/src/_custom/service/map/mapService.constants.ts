import type { MapProperty } from './map.interface';
import { TheIsland_WP } from './properties/theIslandWp';

export const mapProperties = {
  TheIsland_WP: TheIsland_WP,
} as const satisfies Record<string, MapProperty>;

export type MapKey = keyof typeof mapProperties;
