import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRouteStore } from './chat-route.store';
import { OpenaiIntegrationModule } from 'src/openai-integration/openai-integration.module';
import { MsRoboticsIntegrationModule } from 'src/ms-robotics-integration/ms-robotics.module';
import { MsMaiCoreModule } from 'src/ms-mai-core-integration/ms-mai-core.module';

@Module({
  imports: [OpenaiIntegrationModule, MsRoboticsIntegrationModule, MsMaiCoreModule],
  controllers: [ChatController],
  providers: [ChatService, ChatRouteStore],
})
export class ChatModule {}
