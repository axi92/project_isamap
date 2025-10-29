import { ServerCreateDto } from './dto/serverCreate.dto';

export class ServerInfo {
  publicId: string;
  description: string;
  lastUpdate?: string;
  playerCount?: number;
  serverName?: string;
  map?: string;
}
export class ServerEntry extends ServerCreateDto {
  publicId: string;
  privateId: string;
}
