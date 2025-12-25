import type { MapProperty } from './map.interface';
import { Aberration_WP } from './properties/Aberration_WP';
import { Astraeos_WP } from './properties/Astraeos_WP';
import { Extinction_WP } from './properties/Extinction_WP';
import { Ragnarok_WP } from './properties/Ragnarok_WP';
import { ScorchedEarth_WP } from './properties/ScorchedEarth_WP';
import { TheCenter_WP } from './properties/TheCenter_WP';
import { TheIsland_WP } from './properties/TheIsland_WP';
import { Valguero_WP } from './properties/Valguero_WP';
import { LostCity_WP } from './properties/LostCity_WP';
import { Althemia } from './properties/Althemia';
import { Amissa_WP } from './properties/Amissa_WP';
import { insaluna_WP } from './properties/insaluna_WP';

export const mapProperties = {
  TheIsland_WP: TheIsland_WP,
  TheCenter_WP: TheCenter_WP,
  ScorchedEarth_WP: ScorchedEarth_WP,
  Ragnarok_WP: Ragnarok_WP,
  Aberration_WP: Aberration_WP,
  Extinction_WP: Extinction_WP,
  Astraeos_WP: Astraeos_WP,
  Valguero_WP: Valguero_WP,
  LostCity_WP: LostCity_WP,
  Althemia: Althemia,
  Amissa_WP: Amissa_WP,
  insaluna_WP: insaluna_WP,
} as const satisfies Record<string, MapProperty>;

export type MapKey = keyof typeof mapProperties;
