import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { LowdbModule } from 'src/lowdb/lowdb.module';

@Module({
  providers: [ServerService],
  exports: [ServerService],
  imports: [LowdbModule],
})
export class ServerModule { }
