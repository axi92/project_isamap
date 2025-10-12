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
import { LiveMapDTO, privateIdDTO } from './dto/server.dto';
import { ServerCreateDto } from './dto/serverCreate.dto';
import { ServerEntry } from './server.interface';
import { Request } from 'express';
import { UserCreatDto } from '@/user/dto/userCreate.dto';

@Controller('servers')
export class ServerController {
  private readonly logger = new Logger('ServerController');
  constructor(private readonly servers: ServerService) {}
  /*
  GET /servers
  - Get one user:
  GET /servers/:id
  - Create server:
  POST /servers/create
  - Change server description
  PATCH /servers/:id
  - Delete Server
  DELETE /servers/:id
  */

  @Get() // GET /servers
  async allServers() {
    const servers = (await this.servers.getAll()) as ServerEntry[];
    return servers;
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
    const userSession: UserCreatDto = req.user as UserCreatDto;
    this.logger.log(userSession.userId, serverCreateDto.owner);
    if (req.isAuthenticated()) {
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
  async deleteServer(@Body() request: privateIdDTO) {
    const response = await this.servers.delete(request.privateid);
    if (response != true) throw new NotFoundException();
    else return;
  }
}
