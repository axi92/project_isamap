import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service.js";
import { UserCreatDto } from "../user/dto/userCreate.dto.js";
import { InterfaceAuthService } from "./auth.interface.js";

@Injectable()
export class AuthService implements InterfaceAuthService {
  // async validateUser(details: UserCreatDto){
  //   const {discordId} = details;
  //   const user = await this.findUser({ discordId});
  //   return user ? this.updateUser(details) : this.createUser(details);
  // }

  createUser(details: UserCreatDto) {
    // const user = this.
  }

  findUser(discordId: string) {}
}
