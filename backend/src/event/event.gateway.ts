import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerService } from '@/server/server.service';
import { calibrationServerData } from '@/server/server.test.data';

@Injectable()
@WebSocketGateway({
  cors: true,
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EventGateway.name);

  constructor(@Inject(ServerService) private serverService: ServerService) {}

  @WebSocketServer()
  io: Server;

  afterInit() {
    this.logger.log('Websocket initialized');
  }
  handleConnection(client: Socket) {
    this.logger.verbose(`client connected ${client.id}`);
    client.emit('data', 'connected to server');
  }
  handleDisconnect(client: Socket) {
    this.logger.verbose(`Websocket client ${client.id} disconnected`);
  }

  @SubscribeMessage('mapdata')
  async onNewMessage(
    @MessageBody() publicId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.verbose('mapdata publicId:', publicId);
    // Fixtures mock data
    if (publicId == 'fixtures') {
      this.logger.verbose(
        'sending fixtures mapdata:',
        JSON.stringify(calibrationServerData),
      );
      socket.emit('mapdata', calibrationServerData);
      return;
    }
    socket.emit(
      'mapdata',
      JSON.stringify(this.serverService.getServerDataByPublicId(publicId)),
    );
  }
}
