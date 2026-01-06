import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LowdbModule } from '@/lowdb/lowdb.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [LowdbModule],
  exports: [UserService],
})
export class UsersModule {}
