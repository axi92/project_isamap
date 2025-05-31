import { Injectable, Logger } from '@nestjs/common';
import { LowdbService } from '../lowdb/lowdb.service';
import { ServerEntry } from './server.interface';
import { COLLECTION } from '../lowdb/lowdb.constants';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ServerService {
  private readonly logger = new Logger('ServerService');
  constructor(private readonly dbService: LowdbService) { }

  async getAll() {
    return this.dbService.getAllEntries('servers')
  }

  async create(owner: number, description: string): Promise<ServerEntry> {
    return new Promise(async (resolve) => {
      const chain = this.dbService.getDBChain()
      const dbData = chain
        .get(COLLECTION.SERVERS)
        .value() as ServerEntry[];
      const newEntry = {
        owner: owner,
        privateId: uuidv4(),
        publicId: uuidv4(),
        description: description
      } as ServerEntry;
      dbData.push(newEntry);
      chain.set(COLLECTION.USERS, dbData);
      resolve(newEntry);
    });
  }

  async creatServer(owner: number, description: string): Promise<ServerEntry> {
    return new Promise(async (resolve) => {
      const dbData = this.dbService.getDBChain()
        .get(COLLECTION.SERVERS)
        .value() as ServerEntry[];
      const newEntry = {
        owner: owner,
        privateId: uuidv4(),
        publicId: uuidv4(),
        description: description
      } as ServerEntry;
      dbData.push(newEntry);
      this.dbService.getDBChain().set(COLLECTION.USERS, dbData);
      resolve(newEntry);
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

  async findServersByOwner(owner: number): Promise<ServerEntry[]> {
    return new Promise(async (resolve) => {
      const result = this.dbService.getDBChain()
        .get("servers")
        .filter({ owner: owner })
        .value();
      resolve(result);
    });
  }
}
