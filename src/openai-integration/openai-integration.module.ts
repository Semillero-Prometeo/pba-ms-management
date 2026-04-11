import { Module } from '@nestjs/common';

import { OpenaiIntegrationService } from './openai-integration.service';

@Module({
  controllers: [],
  providers: [OpenaiIntegrationService],
  exports: [OpenaiIntegrationService],
})
export class OpenaiIntegrationModule {}
