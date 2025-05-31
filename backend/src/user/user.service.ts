import { Injectable, Logger } from '@nestjs/common';
import { LowdbService } from '../lowdb/lowdb.service';
import { UserDetails } from './user.interface';
import { COLLECTION } from '../lowdb/lowdb.constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService')
  constructor(private readonly dbService: LowdbService) { }

  async getAll() {
    return this.dbService.getAllEntries('users')
  }

  async findUserById(discordId: number): Promise<UserDetails | undefined> {
    return new Promise(async (resolve) => {
      const result = this.dbService.getDBChain()
        .get("users")
        .find({ discordId: discordId })
        .value();
      resolve(result);
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

  async create(details: UserDetails): Promise<UserDetails> {
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
      const chain = this.dbService.getDBChain()
      const dbData = chain
        .get(COLLECTION.USERS)
        .value() as UserDetails[];
      dbData.push(newEntry);
      chain.set(COLLECTION.USERS, dbData);
      await this.dbService.getDb().write();
      resolve(newEntry);
    });
  }
}
