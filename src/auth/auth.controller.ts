import { Controller, Get, Query, Req } from "@nestjs/common";
import { AuthService } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: POST Signup
  @Get("signup") // auth/signup
  async signup(@Query() request: Request) {
    console.log(request);
  }

  // TODO: POST Login

  // TODO: POST Refresh Token
}
