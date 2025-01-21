import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

import { v4 as uuidv4 } from "uuid";
import {
  DataBaseStructure,
  ServerEntry,
  UserDetails,
} from "./lowdb.interface.js";
import { LowWithLodash } from "./lowWithLodash.js";
import { JSONFile } from "lowdb/node";
import { Collection } from "typeorm";
import { Server } from "http";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler.js";

const COLLECTION = {
  SERVERS: "servers",
  USERS: "users",
};
const defaultData: DataBaseStructure = { users: [], servers: [] };

@Injectable()
export class LowdbService implements OnModuleInit {
  private db: LowWithLodash<DataBaseStructure>;
  private readonly logger = new Logger(LowdbService.name);

  constructor() {}

  async onModuleInit() {
    await this.initDatabase();
  }

  private async initDatabase() {
    // Read or create db.json
    const adapter = new JSONFile<DataBaseStructure>("db.json");
    this.db = new LowWithLodash(adapter, defaultData);
    await this.db.read();

    const listEntries = this.db.chain.value();
    if (listEntries.servers.length < 1) {
      // If there are no entries read than the db is not there or empty so create one.
      await this.db.write();
    }
    this.logger.log("DB initiated!");
    // TODO: move this to tests:
    // await this.creatUser({
    //   discordId: 0,
    //   bot: false,
    //   discriminator: 'discriminator',
    //   global_name: 'global_name',
    //   locale: 'locale',
    //   username: 'username',
    //   verified: true,
    // })

    // TODO: move this to tests:
    // const findResult = await this.findUserById(0)
    // this.logger.log(findResult);

    // TODO: move this to tests:
    // const createdServer = await this.creatServer(0, 'first test');
    // this.logger.log(createdServer);

    // TODO: move this to tests:
    const findResult = await this.findServerByPrivateId('b92d8f0f-2bd2-4358-b991-0f2ce2f2160e');
    this.logger.log(findResult);
  }

  async creatUser(details: UserDetails): Promise<UserDetails> {
    return new Promise(async (resolve) => {
      await this.db.read();
      const dbData = this.db.chain
        .get(COLLECTION.USERS)
        .value() as UserDetails[];
      // this.logger.log(dbData);
      const newEntry = {
        discordId: details.discordId,
        bot: details.bot,
        discriminator: details.discriminator,
        global_name: details.global_name,
        locale: details.locale,
        username: details.username,
        verified: details.verified,
        level: 1,
      } as UserDetails;

      dbData.push(newEntry);
      this.db.chain.set(COLLECTION.USERS, dbData);
      await this.db.write();
      resolve(newEntry);
    });
  }

  async creatServer(owner: number, notes: string): Promise<ServerEntry> {
    return new Promise(async (resolve) => {
      await this.db.read();
      const dbData = this.db.chain
        .get(COLLECTION.SERVERS)
        .value() as ServerEntry[];
      const newEntry = {
        owner: owner,
        privateId: uuidv4(),
        publicId: uuidv4(),
        notes: notes
      } as ServerEntry;
      dbData.push(newEntry);
      this.db.chain.set(COLLECTION.USERS, dbData);
      await this.db.write();
      resolve(newEntry);
    });
  }

  async findUserById(discordId: number): Promise<UserDetails> {
    return new Promise(async (resolve) => {
      const result = this.db.chain
        .get("users")
        .find({ discordId: discordId })
        .value();
      resolve(result);
    });
  }

  async findServerByPrivateId(privateId: string): Promise<ServerEntry> {
    return new Promise(async (resolve) => {
      const result = this.db.chain
        .get("servers")
        .find({ privateId: privateId })
        .value();
      resolve(result);
    });
  }

  async getAllEntries(collctionName: "servers" | "users"): Promise<any> {
    return new Promise(async (resolve) => {
      const result = this.db.chain.get(collctionName).value();
      resolve(result);
    });
  }

  // async update(
  //   key: string,
  //   value: string | String,
  //   collctionName: string,
  //   dataUpdate: any,
  // ): Promise<any> {
  //   const listUsers = await this.db.chain.get(collctionName).value();
  //   let out;
  //   const dbData = listUsers.map(user => {
  //     if (user[key] !== value) return user;
  //     if (user[key] === value) {
  //       out = Object.assign(user, dataUpdate);
  //       return out;
  //     }
  //   });
  //   await this.db.chain.set(collctionName, dbData).write();
  //   return out;
  // }
}
