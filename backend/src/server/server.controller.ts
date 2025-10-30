import {
  Body,
  Controller,
  Post,
  Get,
  ValidationPipe,
  NotFoundException,
  Delete,
  Logger,
  Param,
  Req,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { LiveMapDTO, publicIdDTO } from './dto/server.dto';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { Request } from 'express';
import { UserCreatDto } from '@/user/dto/userCreate.dto';

@Controller('servers')
export class ServerController {
  private readonly logger = new Logger('ServerController');
  constructor(private readonly servers: ServerService) {}
  /*
  - Get server list for session owner
    GET /servers/list
  - Get server data for publicId:
    GET /servers/:id
  - Create server:
    POST /servers/create
  - Change server description
    PATCH /servers/:id
  - Delete Server
    DELETE /servers/:id
  */

  @Get('list') // GET /servers/list
  async myServers(@Req() req: Request) {
    const userSession: UserCreatDto = req.user as UserCreatDto;
    if (req.isAuthenticated()) {
      return await this.servers.getByOwner(userSession.userId);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Post('data') // Gameserver sending data to webserver
  async processData(@Body(ValidationPipe) liveMapDto: LiveMapDTO) {
    const response = await this.servers.processData(liveMapDto);
    if (response === null) {
      throw new NotFoundException();
    } else {
      return;
    }
  }

  @Get('data/:id') // Getting map data for livemap view
  getData(@Param('id') id: string) {
    this.logger.log(id);
    const response = this.servers.getServerDataByPublicId(id);
    if (response === null) {
      throw new NotFoundException();
    } else {
      return response;
    }
  }

  @Post('create') // Create a new server
  async createServer(
    @Body(ValidationPipe) serverCreateDto: ServerCreateDto,
    @Req() req: Request,
  ) {
    if (req.isAuthenticated()) {
      const userSession: UserCreatDto = req.user as UserCreatDto;
      this.logger.debug(userSession);
      this.logger.log('create', userSession.userId, serverCreateDto.owner);
      if (userSession.userId == serverCreateDto.owner) {
        // create server
        // return publicID, privateID, description
        return await this.servers.create(serverCreateDto);
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('delete') // Delete a server
  async deleteServer(
    @Body(ValidationPipe) payload: publicIdDTO,
    @Req() req: Request,
  ) {
    const userSession: UserCreatDto = req.user as UserCreatDto;
    this.logger.log('delete', userSession.userId, payload.publicId);
    if (req.isAuthenticated()) {
      const server = await this.servers.findServerByPublicId(payload.publicId);
      if (userSession.userId == server.owner) {
        // delete server
        // return publicID, privateID, description
        await this.servers.delete(payload.publicId);
        return;
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
