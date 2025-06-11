import { Injectable, Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({
  cors: true,
})
export class MySocketGateway {
  private readonly logger = new Logger(MySocketGateway.name);

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    this.logger.log(body);
  }
}
