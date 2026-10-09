import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { MsMaiCoreService } from './ms-mai-core.service';

@Module({
  imports: [NatsModule],
  providers: [MsMaiCoreService],
  exports: [MsMaiCoreService],
})
export class MsMaiCoreModule {}
