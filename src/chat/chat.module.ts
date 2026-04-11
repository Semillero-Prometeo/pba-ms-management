import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenaiIntegrationModule } from 'src/openai-integration/openai-integration.module';

@Module({
  imports: [OpenaiIntegrationModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
