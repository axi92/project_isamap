import { Injectable, Logger } from '@nestjs/common';
import { LowdbService } from '@/lowdb/lowdb.service';
import { UserCreatDto } from './dto/userCreate.dto';
import { COLLECTION } from '@/lowdb/lowdb.constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(private readonly dbService: LowdbService) {}

  async getAll() {
    return this.dbService.getAllEntries('users');
  }

  async findUserById(userId: string): Promise<UserCreatDto | undefined> {
    return new Promise(async (resolve) => {
      const result = this.dbService
        .getDBChain()
        .get('users')
        .find({ userId: userId })
        .value();
      resolve(result);
    });
  }

  async doesUserExist(ownerId: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const checkExistingUser = await this.findUserById(ownerId);
      if (checkExistingUser) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  async create(details: UserCreatDto): Promise<UserCreatDto> {
    return new Promise(async (resolve) => {
      const newEntry = {
        userId: details.userId,
        username: details.username,
        verified: details.verified,
        avatar: details.avatar,
      } as UserCreatDto;
      // Check if entry already exists with that discordId
      if (await this.doesUserExist(details.userId)) {
        // Resolve without doing anything, status now is the desired status => Nothing to do
        return resolve(newEntry);
      }
      const chain = this.dbService.getDBChain();
      const dbData = chain.get(COLLECTION.USERS).value() as UserCreatDto[];
      dbData.push(newEntry);
      chain.set(COLLECTION.USERS, dbData);
      this.dbService.flushDataToDisk = true;
      await this.dbService.writeDB();
      resolve(newEntry);
    });
  }
}
