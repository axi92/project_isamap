import { Body, Controller, Post, Get, ValidationPipe } from '@nestjs/common';
import { ServerService } from './server.service';
import { LiveMapDTO } from './dto/server.dto';
import { ServerCreateDto } from './dto/serverCreate.dto';

@Controller('servers')
export class ServerController {
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

  @Get() // GET /users
  async allServers() {
    const users = await this.servers.getAll();
    return users;
  }

  @Post('data') // Gameserver sending data to webserver
  processData(@Body(ValidationPipe) liveMapDto: LiveMapDTO) {
    return { received: liveMapDto };
  }

  @Post('create') // Create a new server
  async createServer(@Body(ValidationPipe) serverCreateDto: ServerCreateDto) {
    return await this.servers.create(serverCreateDto);
    // create server
    // return publicID, privateID, description
  }
}
