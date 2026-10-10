import { Injectable, Logger } from '@nestjs/common';
import { MsMaiCoreService } from 'src/ms-mai-core-integration/ms-mai-core.service';
import { MsRoboticsService } from 'src/ms-robotics-integration/ms-robotics.service';
import { ChatStructuredRequestDto } from 'src/openai-integration/dto/chat-structured-request.dto';
import { ChatStructuredResponseDto } from 'src/openai-integration/dto/chat-structured-response.dto';
import { OpenaiIntegrationService } from 'src/openai-integration/openai-integration.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly openaiIntegrationService: OpenaiIntegrationService,
    private readonly msRoboticsService: MsRoboticsService,
    private readonly maiCore: MsMaiCoreService,
  ) {}

  async chat(chatStructuredRequestDto: ChatStructuredRequestDto): Promise<ChatStructuredResponseDto> {
    this.logger.log(`Asking mai-core: ${chatStructuredRequestDto.message}`);
    const response = await this.maiCore.ask(chatStructuredRequestDto.message);
    this.logger.log(`mai-core replied fuente=${response.fuente ?? ""}`);
    return response;
  }

  async declarePoema(): Promise<ChatStructuredResponseDto> {
    const poema = await this.openaiIntegrationService.chatStructured({ message: 'Declara un poema para Diana Serrano, con un tono romantico y amoroso' });
    await this.msRoboticsService.speak({ message: poema.reply });
    return poema;
  }
}
