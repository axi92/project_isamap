import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LowdbService } from '../lowdb/lowdb.service';
import { ServerEntry } from './server.interface';
import { COLLECTION } from '../lowdb/lowdb.constants';
import { v4 as uuidv4 } from 'uuid';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { UserService } from '../user/user.service';
import { ERROR_INVALID_OWNER } from './server.constants';
import { LiveMapDTO } from './dto/server.dto';

@Injectable()
export class ServerService {
  private readonly logger = new Logger('ServerService');
  private serverData = new Map<string, LiveMapDTO>();

  constructor(
    private readonly dbService: LowdbService,
    private readonly userService: UserService,
  ) {}

  async getAll() {
    return this.dbService.getAllEntries('servers');
  }

  async create(
    serverCreateDto: ServerCreateDto,
  ): Promise<ServerEntry | BadRequestException> {
    return new Promise(async (resolve, reject) => {
      // check if owner exists
      if (!(await this.userService.doesUserExist(serverCreateDto.owner))) {
        return reject(new BadRequestException(ERROR_INVALID_OWNER));
      }
      const chain = this.dbService.getDBChain();
      const dbData = chain.get(COLLECTION.SERVERS).value() as ServerEntry[];
      const newEntry = {
        owner: serverCreateDto.owner,
        privateId: uuidv4(),
        publicId: uuidv4(),
        description: serverCreateDto.description,
      } as ServerEntry;
      dbData.push(newEntry);
      chain.set(COLLECTION.USERS, dbData);
      this.dbService.flushDataToDisk = true;
      return resolve(newEntry);
    });
  }

  async delete(privateId: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const result = await this.findServerByPrivateId(privateId);
      if (result === null) {
        return resolve(false);
      } else {
        this.dbService.getDb().data.servers = this.dbService
          .getDb()
          .data.servers.filter((item) => item.privateId !== privateId);
        this.dbService.flushDataToDisk = true;
        return resolve(true);
      }
    });
  }

  async findServerByPrivateId(privateId: string): Promise<ServerEntry | null> {
    return new Promise(async (resolve) => {
      const result = this.dbService
        .getDBChain()
        .get('servers')
        .find({ privateId: privateId })
        .value();
      if (!result) {
        return resolve(null);
      } else {
        return resolve(result);
      }
    });
  }

  async findServersByOwner(owner: string): Promise<ServerEntry[]> {
    return new Promise(async (resolve) => {
      const result = this.dbService
        .getDBChain()
        .get('servers')
        .filter({ owner: owner })
        .value();
      resolve(result);
    });
  }

  async processData(liveMapDto: LiveMapDTO): Promise<ServerEntry | null> {
    return new Promise(async (resolve) => {
      this.logger.debug(`Processing data for server: ${liveMapDto.servername}`);
      // Store the data in the serverData map
      const result = await this.findServerByPrivateId(liveMapDto.privateid);
      if (result === null) {
        return resolve(result);
      } else {
        this.serverData.set(result.publicId, liveMapDto);
        this.logger.verbose(this.serverData);
        return resolve(result);
      }
    });
  }

  getServerDataByPublicId(publicId: string): LiveMapDTO | null {
    return this.serverData.get(publicId) || null;
  }
}
