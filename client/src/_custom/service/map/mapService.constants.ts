import type { MapProperty } from './map.interface';
import { Ragnarok_WP } from './properties/Ragnarok_WP';
import { ScorchedEarth_WP } from './properties/ScorchedEarth_WP';
import { TheCenter_WP } from './properties/TheCenter_WP';
import { TheIsland_WP } from './properties/TheIsland_WP';

export const mapProperties = {
  TheIsland_WP: TheIsland_WP,
  TheCenter_WP: TheCenter_WP,
  ScorchedEarth_WP: ScorchedEarth_WP,
  Ragnarok_WP: Ragnarok_WP,
} as const satisfies Record<string, MapProperty>;

export type MapKey = keyof typeof mapProperties;
