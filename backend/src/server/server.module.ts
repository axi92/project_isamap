import { Module } from '@nestjs/common';
import { ServerService } from './server.service';

@Module({
  exports: [ServerService],
  providers: [ServerService]
})
export class ServerModule { }
