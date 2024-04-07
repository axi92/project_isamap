import { Module } from "@nestjs/common";
import { LowdbService } from "./lowdb.service.js";

@Module({
  providers: [LowdbService]
})
export class LowdbModule {}