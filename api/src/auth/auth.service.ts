import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserCreatDto } from '@/user/dto/userCreate.dto';
import { InterfaceAuthService } from './auth.interface';

@Injectable()
export class AuthService implements InterfaceAuthService {
  constructor(private readonly userService: UserService) {}
  // async validateUser(details: UserCreatDto){
  //   const {discordId} = details;
  //   const user = await this.findUser({ discordId});
  //   return user ? this.updateUser(details) : this.createUser(details);
  // }
  async createUser(details: UserCreatDto) {
    return this.userService.create(details);
  }
  // findUser(discordId: string) {}
}
