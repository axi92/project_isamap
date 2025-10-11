// This file is a copy from backend/src/server/dto/server.dto.ts without the class validation

export interface TribeDTO {
  tribeid: number;
  x_pos: number;
  y_pos: number;
  x_ue4: number;
  y_ue4: number;
  z_ue4: number;
  tribename: string;
  decayDestructionTime: number;
  lastInAllyRangeTime: number;
  elapsedTime: number;
}

interface DinoDTO {
  class: string;
  x_pos: number;
  y_pos: number;
  x_ue4: number;
  y_ue4: number;
  z_ue4: number;
  id: number;
  level: number;
}

export interface PlayerDTO {
  steamid: string;
  x_pos: number;
  y_pos: number;
  x_ue4: number;
  y_ue4: number;
  z_ue4: number;
  playername: string;
  tribename: string;
}

export interface LiveMapDTO {
  privateid: string;
  map: string;
  servername: string;
  serverclock: string;
  tribes: TribeDTO[];
  dinos?: DinoDTO[];
  players: PlayerDTO[];
}
