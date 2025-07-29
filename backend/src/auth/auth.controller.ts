import {
  Controller,
  Get,
  Req,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
// import { sign } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // localhost:3000/api/v1/auth/login
  @Get('login') // auth/login
  @UseGuards(AuthGuard('discord'))
  login() {
    // Passport handles redirect
  }

  @Get('redirect')
  @UseGuards(AuthGuard('discord'))
  redirect(@Req() req: Request, @Res() res: Response) {
    // Discord redirects here after login
    if (!req.user) {
      console.error('No user found after Discord login');
      return res.redirect('http://localhost:5173/?error=no-user');
    }
    // TODO: create and return JWT, or save session
    // Generate JWT token for user
    // const jwtToken = sign({ ...req.user }, 'secret-CHANGEME', {
    //   expiresIn: '7d',
    // });
    // Save JWT inside session
    // req.session.jwt = jwtToken;
    // ✅ Force login to trigger session + serializeUser
    req.login(req.user, (err) => {
      if (err) {
        console.error('req.login error:', err);
        return res.redirect('http://localhost:5173/?error=login-failed');
      }
      // res.redirect(`http://localhost:5173/?token=${jwtToken}`);
      res.redirect(`http://localhost:5173`);
    });
  }

  @Get('me')
  getMe(@Req() req: Request) {
    if (req.isAuthenticated()) {
      return req.user; // user info from session
    }
    throw new UnauthorizedException();
  }
  // TODO: POST Login

  // TODO: POST Refresh Token
}
