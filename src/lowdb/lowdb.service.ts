import { Injectable, Logger } from '@nestjs/common';
// import { JSONFilePreset } from 'lowdb/node'
// import { Low } from 'lowdb/lib';
import * as uuid from 'uuid';
import { DataBaseStructure } from './lowdb.interface.js';
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

  private async initDatabase(collctionName: String) {
    // Read or create db.json
    const adapter = new JSONFile<DataBaseStructure>('db.json')
    this.db = new LowWithLodash(adapter, defaultData)

    const listUsers = await this.db.chain.get(collctionName).value();
    this.logger.log(listUsers)
    if (!listUsers) {
      await this.db.chain.set(collctionName, []).write();
    }
  }

  async findAll(collctionName: CollctionName): Promise<any> {
    const listUsers = await this.db.chain.get(collctionName).value();
    return listUsers;
  }

  async find(condition: object, collctionName: CollctionName): Promise<any> {
    const values = await this.db.chain.get(collctionName).find(condition).value();
    return values;
  }

  async update(
    key: string,
    value: string | String,
    collctionName: string,
    dataUpdate: any,
  ): Promise<any> {
    const listUsers = await this.db.chain.get(collctionName).value();
    let out;
    const listData = listUsers.map(user => {
      if (user[key] !== value) return user;
      if (user[key] === value) {
        out = Object.assign(user, dataUpdate);
        return out;
      }
    });
    await this.db.chain.set(collctionName, listData).write();
    return out;
  }

  async add(record: any, collctionName: CollctionName): Promise<any> {
    const listData = await this.db.chain.get(collctionName).value();
    record.id = uuid.v1();
    listData.push(record);
    await this.db.chain.set(collctionName, listData).write();
    return record;
  }
}