import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configRoot } from './core/settings/app.setting';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(configRoot())],
  controllers: [AppController],
})
export class AppModule {}
