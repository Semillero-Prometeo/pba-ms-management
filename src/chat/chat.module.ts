import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenaiIntegrationModule } from 'src/openai-integration/openai-integration.module';
import { MsRoboticsIntegrationModule } from 'src/ms-robotics-integration/ms-robotics.module';

@Module({
  imports: [OpenaiIntegrationModule, MsRoboticsIntegrationModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
