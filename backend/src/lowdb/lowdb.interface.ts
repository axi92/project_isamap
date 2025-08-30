import { ServerEntry } from '@/server/server.interface';
import { UserCreatDto } from '@/user/dto/userCreate.dto';

export interface DataBaseStructure {
  servers: ServerEntry[];
  users: UserCreatDto[];
}
