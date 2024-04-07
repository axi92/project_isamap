import { Injectable, Logger } from '@nestjs/common';
// import { JSONFilePreset } from 'lowdb/node'
// import { Low } from 'lowdb/lib';
import {v4 as uuidv4} from 'uuid';
import { DataBaseStructure, ServerEntry } from './lowdb.interface.js';
import { LowWithLodash } from './lowWithLodash.js';
import { JSONFile } from 'lowdb/node';

type CollctionName = 'servers';
const defaultData: DataBaseStructure = { servers: [] }

@Injectable()
export class LowdbService {
  private db: LowWithLodash<DataBaseStructure>
  private readonly logger = new Logger(LowdbService.name);

  constructor() {
    this.initDatabase('servers');
  }

  private async initDatabase(collctionName: CollctionName) {
    // Read or create db.json
    const adapter = new JSONFile<DataBaseStructure>('db.json');
    this.db = new LowWithLodash(adapter, defaultData);
    await this.db.read();

    const listEntries = this.db.chain.value();
    if (listEntries.servers.length < 1) {
      // If there are no entries read than the db is not there or empty so create one.
      await this.db.write();
    }
    this.logger.log('DB initiated!');
    // TODO: move this to tests:
    // const sampleData : ServerEntry = {
    //   owner: 123,
    //   privateid: uuidv4(),
    //   publicid: uuidv4(),
    //   notes: 'blub notes'
    // }
    // await this.add(sampleData, collctionName);
  }

  // TODO: WORK IN PROGRESS add
  async add(record: any, collctionName: CollctionName): Promise<any> {
    const listData = this.db.chain.get(collctionName).value();
    listData.push(record);
    this.db.chain.set(collctionName, listData);
    await this.db.write();
    return record;
  }

  // async findAll(collctionName: CollctionName): Promise<any> {
  //   const listUsers = this.db.chain.get(collctionName).value();
  //   return listUsers;
  // }

  // async find(condition: object, collctionName: CollctionName): Promise<any> {
  //   const values = await this.db.chain.get(collctionName).find(condition).value();
  //   return values;
  // }

  // async update(
  //   key: string,
  //   value: string | String,
  //   collctionName: string,
  //   dataUpdate: any,
  // ): Promise<any> {
  //   const listUsers = await this.db.chain.get(collctionName).value();
  //   let out;
  //   const listData = listUsers.map(user => {
  //     if (user[key] !== value) return user;
  //     if (user[key] === value) {
  //       out = Object.assign(user, dataUpdate);
  //       return out;
  //     }
  //   });
  //   await this.db.chain.set(collctionName, listData).write();
  //   return out;
  // }
}