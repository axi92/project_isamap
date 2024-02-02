import { Module } from "@nestjs/common";
import { MySocketGateway } from "./gateway.js";

@Module({
  providers: [MySocketGateway]
})
export class GatewayModule {}