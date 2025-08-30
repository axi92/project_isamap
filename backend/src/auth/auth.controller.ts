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
      return res.redirect('http://localhost:5173/?error=no-user');
    }

    req.login(req.user, (err) => {
      if (err) {
        console.error('req.login error:', err);
        return res.redirect('http://localhost:5173/?error=login-failed');
      }
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

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout({ keepSessionInfo: false }, (err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.redirect('http://localhost:5173/?error=logout-failed');
      }

      // Destroy session completely
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.clearCookie('connect.sid'); // clear session cookie
        res.redirect('http://localhost:5173'); // TODO: redirect back to frontend
      });
    });
  }

  // TODO: POST Refresh Token
}
