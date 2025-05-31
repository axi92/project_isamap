import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LowdbService } from '../lowdb/lowdb.service';
import { ServerEntry } from './server.interface';
import { COLLECTION } from '../lowdb/lowdb.constants';
import { v4 as uuidv4 } from "uuid";
import { ServerCreateDto } from './dto/serverCreate.dto';
import { UserService } from '../user/user.service';
import { ERROR_INVALID_OWNER } from './server.constants';

@Injectable()
export class ServerService {
  private readonly logger = new Logger('ServerService');
  constructor(
    private readonly dbService: LowdbService, 
    private readonly userService: UserService
  ) { }

  async getAll() {
    return this.dbService.getAllEntries('servers')
  }

  async create(serverCreateDto: ServerCreateDto): Promise<ServerEntry | BadRequestException> {
    return new Promise(async (resolve, reject) => {
      // check if owner exists
      if(!await this.userService.doesUserExist(serverCreateDto.owner)){
        return reject(new BadRequestException(ERROR_INVALID_OWNER))
      }
      const chain = this.dbService.getDBChain()
      const dbData = chain
        .get(COLLECTION.SERVERS)
        .value() as ServerEntry[];
      const newEntry = {
        owner: serverCreateDto.owner,
        privateId: uuidv4(),
        publicId: uuidv4(),
        description: serverCreateDto.description
      } as ServerEntry;
      dbData.push(newEntry);
      chain.set(COLLECTION.USERS, dbData);
      return resolve(newEntry);
    });
  }

  async findServerByPrivateId(privateId: string): Promise<ServerEntry> {
    return new Promise(async (resolve) => {
      const result = this.dbService.getDBChain()
        .get("servers")
        .find({ privateId: privateId })
        .value();
      resolve(result);
    });
  }

  async findServersByOwner(owner: string): Promise<ServerEntry[]> {
    return new Promise(async (resolve) => {
      const result = this.dbService.getDBChain()
        .get("servers")
        .filter({ owner: owner })
        .value();
      resolve(result);
    });
  }
}
