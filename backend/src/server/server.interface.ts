import { ServerCreateDto } from './dto/serverCreate.dto';

export class ServerEntry extends ServerCreateDto {
  privateId: string;
  publicId: string;
}
