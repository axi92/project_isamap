import { Injectable, Logger } from '@nestjs/common';
import { LowdbService } from 'src/lowdb/lowdb.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService')
  constructor(private readonly db: LowdbService){}

  async listAll(){
    return this.db.getAllEntries('users')
  }
}
