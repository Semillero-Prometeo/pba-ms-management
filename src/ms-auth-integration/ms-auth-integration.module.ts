import { Module } from '@nestjs/common';
import { MsAuthIntegrationService } from './ms-auth-integration.service';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  exports: [MsAuthIntegrationService],
  providers: [MsAuthIntegrationService],
})
export class MsAuthIntegrationModule {}
