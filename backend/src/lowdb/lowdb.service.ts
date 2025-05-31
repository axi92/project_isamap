import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

import { v4 as uuidv4 } from "uuid";
import {
  DataBaseStructure,
} from "./lowdb.interface";
import { UserDetails } from "../user/user.interface";
import { ServerEntry } from "src/server/server.interface";
import { LowWithLodash } from "./lowWithLodash";
import { JSONFile } from "lowdb/node";
import { defaultData, ERROR_USER_EXISTS, WARN_SAVING_DB_SHUTDOWN, WARN_SAVING_DB_SHUTDOWN_COMPLETE } from "./lowdb.constants";

const COLLECTION = {
  SERVERS: "servers",
  USERS: "users",
};


@Injectable()
export class LowdbService implements OnModuleInit, OnModuleDestroy {
  private db: LowWithLodash<DataBaseStructure>;
  private readonly logger = new Logger(LowdbService.name);

  constructor() { }

  async onModuleInit(dbName: string = "db.json") {
    await this.initDatabase(dbName);
  }

  async onModuleDestroy() {
    this.logger.warn(WARN_SAVING_DB_SHUTDOWN);
    await this.db.write();
    await new Promise(resolve => setTimeout(resolve, 1.5 * 1000));
    this.logger.warn(WARN_SAVING_DB_SHUTDOWN_COMPLETE)
  }


  private async initDatabase(dbName: string) {
    // Read or create db.json
    const adapter = new JSONFile<DataBaseStructure>(dbName);
    this.db = new LowWithLodash(adapter, defaultData);
    await this.db.read();
    await this.db.initializeChain(); // Initialize chain dynamically

    const listEntries = this.db.chain.value();
    if (listEntries.servers.length < 1) {
      // If there are no entries read than the db is not there or empty so create one.
      await this.db.write();
    }
    this.logger.log("DB initiated!");
  }

  getDb() {
    return this.db
  }

  async creatUser(details: UserDetails): Promise<UserDetails> {
    return new Promise(async (resolve) => {
            const newEntry = {
        discordId: details.discordId,
        username: details.username,
        verified: details.verified,
        avatar: details.avatar
      } as UserDetails;
      // Check if entry already exists with that discordId
      if (await this.doesUserExist(details.discordId)) {
        // Resolve without doing anything, status now is the desired status => Nothing to do
        return resolve(newEntry)
      }
      const dbData = this.db.chain
        .get(COLLECTION.USERS)
        .value() as UserDetails[];
      dbData.push(newEntry);
      this.db.chain.set(COLLECTION.USERS, dbData);
      await this.db.write();
      resolve(newEntry);
    });
  }

  async creatServer(owner: number, description: string): Promise<ServerEntry> {
    return new Promise(async (resolve) => {
      await this.db.read();
      const dbData = this.db.chain
        .get(COLLECTION.SERVERS)
        .value() as ServerEntry[];
      const newEntry = {
        owner: owner,
        privateId: uuidv4(),
        publicId: uuidv4(),
        description: description
      } as ServerEntry;
      dbData.push(newEntry);
      this.db.chain.set(COLLECTION.USERS, dbData);
      await this.db.write();
      resolve(newEntry);
    });
  }

  async doesUserExist(discordId: number): Promise<boolean> {
    return new Promise(async (resolve) => {
      let checkExistingUser = await this.findUserById(discordId);
      if (checkExistingUser) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  }

  async findUserById(discordId: number): Promise<UserDetails | undefined> {
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

  async findServersByOwner(owner: number): Promise<ServerEntry[]> {
    return new Promise(async (resolve) => {
      const result = this.db.chain
        .get("servers")
        .filter({ owner: owner })
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
