import { NatsModule } from "src/transports/nats.module";
import { MsRoboticsService } from "./ms-robotics.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [NatsModule],
  providers: [MsRoboticsService],
  exports: [MsRoboticsService],
})
export class MsRoboticsIntegrationModule {}