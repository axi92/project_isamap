import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // localhost:3000/api/v1/auth/login
  @Get('login') // auth/login
  @UseGuards(AuthGuard('discord'))
  login() {
    // Redirects to Discord OAuth
  }

  // localhost:3000/api/v1/auth/redirect
  @Get('redirect')
  @UseGuards(AuthGuard('discord'))
  redirect(@Req() req) {
    // Discord redirects here after login
    return req.user;
  }

  // TODO: POST Login

  // TODO: POST Refresh Token
}
