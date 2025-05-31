import { Body, Controller, Post, Get } from '@nestjs/common';
import { ServerService } from './server.service';

@Controller('servers')
export class ServerController {

  constructor(private readonly server:ServerService){}
  /*
  GET /servers
  - Get one user:
  GET /servers/:id
  - Create server:
  POST /servers/create
  - Send data to server
  POST /servers/send
  - Change server description
  PATCH /servers/:id
  - Delete Server
  DELETE /servers/:id
  */

  @Get() // GET /users
  async allServers(){
    const users = await this.server.listAllServers()
    return users
  }

  @Post('data')
  processData(@Body() body: any) {
    // Now you can access the POST data via the 'body' parameter
    return { received: body };
  }
}
