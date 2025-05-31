import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

import {
  DataBaseStructure,
} from "./lowdb.interface";
import { LowWithLodash } from "./lowWithLodash";
import { JSONFile } from "lowdb/node";
import { defaultData, WARN_SAVING_DB_SHUTDOWN, WARN_SAVING_DB_SHUTDOWN_COMPLETE } from "./lowdb.constants";

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

  getDBChain(){
    return this.db.chain
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
