import type { Ref } from 'vue';
import type { LiveMapDTO } from './map/dto/map.dto';
import { mapProperties, type MapKey } from './map/mapService.constants';
import type { MapProperty } from './map/map.interface';

export async function createServer(modalServerDescription: Ref, owner: string): Promise<ServerEntry | null> {
  modalServerDescription.value;
  const serverCreatePayload: ServerCreateDto = {
    description: modalServerDescription.value,
    owner: owner,
  };
  const res = await fetch('http://localhost:3000/api/v1/servers/create', {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(serverCreatePayload),
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 201) {
    const response = (await res.json()) as ServerEntry;
    return response; // server info
  } else {
    console.error('res.status:', res.status);
    return null; // not logged in
  }
}

export async function getServerList(debug: boolean = false): Promise<ServerInfo[] | null> {
  const res = await fetch('http://localhost:3000/api/v1/servers/list', {
    credentials: 'include',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status === 200) {
    let response = (await res.json()) as ServerInfo[];
    if (true === debug) {
      const serverListFixtures = getServerListFixtures();
      response = [...serverListFixtures, ...response];
    }
    return response; // server info
  } else {
    console.error('res.status:', res.status);
    return null; // not logged in
  }
}

function getServerListFixtures(): ServerInfo[] {
  const serverListFixtures = [] as ServerInfo[];
  for (const [key, value] of Object.entries(mapProperties) as [MapKey, MapProperty][]) {
    const serverEntry = {
      description: `description of fixture: ${key}`,
      publicId: `fixtures_${value.name}`,
      map: value.name,
      serverName: `Fixture: ${value.displayName}`,
      lastUpdate: new Date().toISOString(),
      playerCount: 0,
    } as ServerInfo;
    serverListFixtures.push(serverEntry);
  }
  return serverListFixtures;
}

export async function deleteServerEntry(publicId: string): Promise<Boolean> {
  const res = await fetch('http://localhost:3000/api/v1/servers/delete', {
    credentials: 'include',
    method: 'DELETE',
    body: JSON.stringify({ publicId: publicId }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status === 200) {
    return true;
  } else {
    console.error('res.status:', res.status);
    return false;
  }
}

export function resolveMapLogo(mapName: string): string {
  switch (mapName) {
    case 'TheCenter_WP':
      return 'center.png';
    case 'ScorchedEarth_WP':
      return 'scorched.png';
    case 'Ragnarok_WP':
      return 'ragna.png';
    case 'Aberration_WP':
      return 'aberration.png';
    case 'Extinction_WP':
      return 'extinction.png';
    case 'Valguero_WP':
      return 'valguero.png';
    case 'Astraeos_WP':
      return 'astraeos.png';
    case 'LostColony_WP':
      return 'lost_colony.png';
    case 'BobsMissions_WP':
      return 'bobstalltales.png';
    case 'LostCity_WP':
      return 'LostCity_WP.png';
    case 'Althemia':
      return 'althemia.png';
    case 'Amissa_WP':
      return 'Amissa.png';
    case 'insaluna_WP':
      return 'insaluna.png';
    default:
      return 'ASA_Logo_transparent.png';
  }
}

export function calculateProgress(current: number, max: number): number {
  if (max <= 0) return 0; // avoid division by zero
  const value = (current / max) * 100;
  return Math.min(Math.max(value, 0), 100); // clamp between 0-100
}

export interface ServerCreateDto {
  owner: string;
  description: string;
}

export interface ServerEntry extends ServerCreateDto {
  publicId: string;
  privateId: string;
  lastUpdate?: string;
  playerCount?: number;
}

export interface ServerInfo {
  publicId: string;
  description: string;
  lastUpdate?: string;
  playerCount?: number;
  serverName?: string;
  map?: string;
}

export interface ServerData extends LiveMapDTO {
  lastUpdate: string;
}
