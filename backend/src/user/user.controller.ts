import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { LowdbService } from '../lowdb/lowdb.service';
import { UserCreatDto } from './dto/userCreate.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly db: LowdbService,
    private readonly users: UserService,
  ) {}

  @Get() // get all users
  async allUsers() {
    return this.users.getAll();
  }

  @Post('create') // Create a new user
  async createUser(@Body(ValidationPipe) createUserDto: UserCreatDto) {
    return await this.users.create(createUserDto);
  }
}
