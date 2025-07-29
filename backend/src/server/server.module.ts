import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { LowdbModule } from '../lowdb/lowdb.module';
import { UsersModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  providers: [ServerService, UserService],
  exports: [ServerService],
  imports: [LowdbModule, UsersModule],
})
export class ServerModule {}
