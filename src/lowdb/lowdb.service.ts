import { Injectable, Logger } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
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
    // await this.add(123, 'blub notes', collctionName);

    // TODO: move this to tests:
    // const findResult = await this.find({ owner: 123}, collctionName)
    // this.logger.log(findResult);
  }

  async add(owner: number, notes: string, collctionName: CollctionName): Promise<any> {
    await this.db.read();
    const listData = this.db.chain.get(collctionName).value();
    this.logger.log(listData);
    const newEntry: ServerEntry = {
      owner: owner,
      privateid: uuidv4(),
      publicid: uuidv4(),
      notes: notes
    }
    listData.push(newEntry);
    this.db.chain.set(collctionName, listData);
    await this.db.write();
    return newEntry;
  }

  async find(condition: object, collctionName: CollctionName): Promise<any> {
    const values = this.db.chain.get(collctionName).find(condition).value();
    return values;
  }

  // async findAll(collctionName: CollctionName): Promise<any> {
  //   const listUsers = this.db.chain.get(collctionName).value();
  //   return listUsers;
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