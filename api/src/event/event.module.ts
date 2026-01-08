import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { ServerModule } from '@/server/server.module';

@Module({
  imports: [ServerModule],
  providers: [EventGateway],
})
export class GatewayModule {}
