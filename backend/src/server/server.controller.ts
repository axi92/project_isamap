import { Body, Controller, Post, Get, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { ServerService } from './server.service';
import { LiveMapDTO } from './server.dto';

@Controller('servers')
export class ServerController {

  constructor(private readonly server:ServerService){}
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
  async allServers(){
    const users = await this.server.listAll()
    return users
  }

  @Post('data') // Gameserver sending data to webserver
  processData(@Body(ValidationPipe) liveMapDto: LiveMapDTO) {
    return { received: liveMapDto };
  }

  @Post('create') // Create a new server
  createServer(@Param('owner', ParseIntPipe) id: number){
    // check if owner exists
    // create server
    // return publicID, privateID, description
  }
}
