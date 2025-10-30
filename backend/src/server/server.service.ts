import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LowdbService } from '@/lowdb/lowdb.service';
import { ServerEntry, ServerInfo } from './server.interface';
import { COLLECTION } from '@/lowdb/lowdb.constants';
import { v4 as uuidv4 } from 'uuid';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { UserService } from '@/user/user.service';
import {
  ERROR_INVALID_OWNER,
  ERROR_SERVER_LIMIT_REACHED,
  MAX_SERVERS_PER_USER,
} from './server.constants';
import { LiveMapDTO } from './dto/server.dto';
import { calibrationServerData } from './server.test.data';
import { ServerData } from './dto/serverData.dto';

@Injectable()
export class ServerService {
  private readonly logger = new Logger('ServerService');
  private serverData = new Map<string, ServerData>();

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
      // Check server limit
      const serverCount = (await this.getByOwner(serverCreateDto.owner)).length;
      if (serverCount >= MAX_SERVERS_PER_USER) {
        return reject(new ForbiddenException(ERROR_SERVER_LIMIT_REACHED));
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

  async delete(publicId: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const result = await this.findServerByPublicId(publicId);
      if (result === null) {
        return resolve(false);
      } else {
        this.dbService.getDb().data.servers = this.dbService
          .getDb()
          .data.servers.filter((item) => item.publicId !== publicId);
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

  async findServerByPublicId(publicId: string): Promise<ServerEntry | null> {
    return new Promise(async (resolve) => {
      const result = this.dbService
        .getDBChain()
        .get('servers')
        .find({ publicId: publicId })
        .value();
      if (!result) {
        return resolve(null);
      } else {
        return resolve(result);
      }
    });
  }

  async getByOwner(owner: string): Promise<ServerInfo[]> {
    // TODO add data from this.serverData like lastUpdate and player count
    return new Promise(async (resolve) => {
      const result = this.dbService
        .getDBChain()
        .get('servers')
        .filter({ owner: owner })
        .value() as ServerEntry[];

      const merged = result.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ privateId, publicId, owner, description }) => {
          //privateId and owner is seperated from the rest and not added later in the return so the data is stripped
          const data = this.serverData.get(publicId);
          return {
            publicId,
            description,
            ...(data
              ? {
                  lastUpdate: data.lastUpdate,
                  playerCount: data.players ? data.players.length : 0,
                  serverName: data.servername,
                  map: data.map,
                }
              : {}),
          };
        },
      );
      resolve(merged);
    });
  }

  async processData(liveMapDto: LiveMapDTO): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.logger.debug(`Processing data for server: ${liveMapDto.servername}`);
      // Store the data in the serverData map
      const result = await this.findServerByPrivateId(liveMapDto.privateid);
      if (result === null) {
        return resolve(false);
      } else {
        const serverData = liveMapDto as ServerData;
        serverData.lastUpdate = new Date().toISOString();
        this.serverData.set(result.publicId, serverData);
        return resolve(true);
      }
    });
  }

  getServerDataByPublicId(publicId: string): LiveMapDTO | null {
    if (publicId == 'fixtures') {
      return calibrationServerData;
    } else {
      return this.serverData.get(publicId) || null;
    }
  }
}
