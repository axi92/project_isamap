import { Module } from "@nestjs/common";
import { MySocketGateway } from "./gateway";

@Module({
  providers: [MySocketGateway]
})
export class GatewayModule {}