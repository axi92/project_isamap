import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service.js";
import { UserDetails } from "src/lowdb/lowdb.interface.js";
import { InterfaceAuthService } from "./auth.interface.js";

@Injectable()
export class AuthService implements InterfaceAuthService {
  // async validateUser(details: UserDetails){
  //   const {discordId} = details;
  //   const user = await this.findUser({ discordId});
  //   return user ? this.updateUser(details) : this.createUser(details);
  // }

  createUser(details: UserDetails) {
    // const user = this.
  }

  findUser(discordId: string) {}
}
