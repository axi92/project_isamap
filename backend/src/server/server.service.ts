import { Injectable, Logger } from '@nestjs/common';
import { LowdbService } from '../lowdb/lowdb.service';

@Injectable()
export class ServerService {
  private readonly logger = new Logger('ServerService');
  constructor(private readonly db: LowdbService){}

  async listAll(){
    return this.db.getAllEntries('servers')
  }
}
