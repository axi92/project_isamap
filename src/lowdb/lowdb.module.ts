import { Module } from "@nestjs/common";
import { LowdbService } from "./lowdb.service.js";

@Module({
  providers: [LowdbService],
  exports: [LowdbModule],
})
export class LowdbModule {}
