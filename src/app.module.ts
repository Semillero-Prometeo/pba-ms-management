import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configRoot } from './core/settings/app.setting';
import { AppController } from './app.controller';
import { OpenaiIntegrationModule } from './openai-integration/openai-integration.module';
import { ChatModule } from './chat/chat.module';
import { MsRoboticsIntegrationModule } from './ms-robotics-integration/ms-robotics.module';

@Module({
  imports: [ConfigModule.forRoot(configRoot()), OpenaiIntegrationModule, ChatModule, MsRoboticsIntegrationModule],
  controllers: [AppController],
})
export class AppModule {}
