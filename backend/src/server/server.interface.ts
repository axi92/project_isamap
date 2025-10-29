import { ServerCreateDto } from './dto/serverCreate.dto';

export class ServerEntryNoPrivateId extends ServerCreateDto {
  publicId: string;
}
export class ServerEntry extends ServerEntryNoPrivateId {
  privateId: string;
}
