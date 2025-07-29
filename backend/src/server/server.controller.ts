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
} from '@nestjs/common';
import { ServerService } from './server.service';
import { LiveMapDTO, privateIdDTO } from './dto/server.dto';
import { ServerCreateDto } from './dto/serverCreate.dto';

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
    const users = await this.servers.getAll();
    return users;
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
  async createServer(@Body(ValidationPipe) serverCreateDto: ServerCreateDto) {
    return await this.servers.create(serverCreateDto);
    // create server
    // return publicID, privateID, description
  }

  @Delete('delete') // Delete a server
  async deleteServer(@Body() request: privateIdDTO) {
    const response = await this.servers.delete(request.privateid);
    if (response != true) throw new NotFoundException();
    else return;
  }
}
