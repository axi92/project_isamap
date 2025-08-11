import { Injectable, Logger } from '@nestjs/common';
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
// import { EventType } from '../../../client/src/event/event.interface';

@Injectable()
@WebSocketGateway({
  cors: true,
})
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EventGateway.name);

  @WebSocketServer()
  io: Server;

  afterInit() {
    this.logger.log('Websocket initialized');
  }
  handleConnection(client: Socket) {
    this.logger.log(`client connected ${client.id}`);
    client.emit('data', 'connected to server');
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Websocket client ${client.id} disconnected`);
  }

  @SubscribeMessage('mapdata')
  async onNewMessage(
    @MessageBody() body: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(body, socket);
  }
}
