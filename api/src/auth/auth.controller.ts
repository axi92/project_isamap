import {
  Controller,
  Get,
  Req,
  UseGuards,
  Res,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserCreatDto } from '@/user/dto/userCreate.dto';
import { ConfigurationService } from '@/configuration/configuration.service';
// import { sign } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name, {
    timestamp: true,
  });
  constructor(
    private readonly authService: AuthService,
    private readonly configurationService: ConfigurationService,
  ) {}

  // localhost:3000/api/v1/auth/login
  @Get('login') // auth/login
  @UseGuards(AuthGuard('discord'))
  login() {
    // Passport handles redirect
  }

  @Get('redirect')
  @UseGuards(AuthGuard('discord'))
  async redirect(@Req() req: Request, @Res() res: Response) {
    // Discord redirects here after login
    const user = req.user as UserCreatDto;
    if (!req.user) {
      return res.redirect(
        `${this.configurationService.getUiUrl()}/?error=no-user`,
      );
    }

    req.login(user, async (err) => {
      if (err) {
        console.error('req.login error:', err);
        return res.redirect(
          `${this.configurationService.getUiUrl()}/?error=login-failed`,
        );
      } else {
        this.logger.log(`${user.username} with id ${user.userId} logged in`);
        await this.authService.createUser(user as UserCreatDto);
        res.redirect(`${this.configurationService.getUiUrl()}`);
      }
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
        return res.redirect(
          `${this.configurationService.getUiUrl()}/?error=logout-failed`,
        );
      }

      // Destroy session completely
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.clearCookie('connect.sid'); // clear session cookie
        res.redirect(`${this.configurationService.getUiUrl()}`); // TODO: redirect back to frontend
      });
    });
  }

  // TODO: POST Refresh Token
}
