import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { LowdbModule } from 'src/lowdb/lowdb.module';
import { UsersModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ServerService, UserService],
  exports: [ServerService],
  imports: [LowdbModule, UsersModule],
})
export class ServerModule { }
