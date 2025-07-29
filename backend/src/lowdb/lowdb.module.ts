import { Module } from '@nestjs/common';
import { LowdbService } from './lowdb.service';

@Module({
  providers: [LowdbService],
  exports: [LowdbService],
})
export class LowdbModule {}
