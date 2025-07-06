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
  handleConnection(client: Socket, ...args: any[]) {
    client.emit('data', 'connected to server');
  }
  handleDisconnect(client: Socket) {
    this.logger.log('Websocket client', client.id, 'disconnected');
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(body);
  }
}
