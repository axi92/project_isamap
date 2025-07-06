import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway.js';

@Module({
  providers: [EventGateway],
})
export class GatewayModule {}
