import { Module } from "@nestjs/common";
import { MySocketGateway } from "./gateway.mts";

@Module({
  providers: [MySocketGateway]
})
export class GatewayModule {}