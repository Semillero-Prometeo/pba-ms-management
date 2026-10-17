import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MsMaiCoreService } from 'src/ms-mai-core-integration/ms-mai-core.service';
import { MsRoboticsService } from 'src/ms-robotics-integration/ms-robotics.service';
import { ChatStructuredRequestDto } from 'src/openai-integration/dto/chat-structured-request.dto';
import { ChatStructuredResponseDto } from 'src/openai-integration/dto/chat-structured-response.dto';
import { OpenaiIntegrationService } from 'src/openai-integration/openai-integration.service';
import { ChatModel, ChatRouteState, ChatRouteStore } from './chat-route.store';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly openaiIntegrationService: OpenaiIntegrationService,
    private readonly msRoboticsService: MsRoboticsService,
    private readonly maiCore: MsMaiCoreService,
    private readonly routeStore: ChatRouteStore,
  ) {}

  getRoute(): ChatRouteState {
    return this.routeStore.read();
  }

  setAutomation(enabled: boolean): ChatRouteState {
    const current = this.routeStore.read();
    const selectedModel: ChatModel = enabled ? current.selectedModel : 'basico';
    return this.routeStore.write({ automationEnabled: enabled, selectedModel });
  }

  setModel(model: ChatModel): ChatRouteState {
    const current = this.routeStore.read();
    if (model === 'complejo' && !current.automationEnabled) {
      throw new RpcException({
        statusCode: 409,
        message: 'Los turnos automáticos están apagados',
      });
    }
    return this.routeStore.write({ ...current, selectedModel: model });
  }

  async chat(chatStructuredRequestDto: ChatStructuredRequestDto): Promise<ChatStructuredResponseDto> {
    const route = this.routeStore.read();
    const useTurn = route.automationEnabled && route.selectedModel === 'complejo';
    if (useTurn) {
      this.logger.log(`Asking mai-core: ${chatStructuredRequestDto.message}`);
      const response = await this.maiCore.ask(chatStructuredRequestDto.message);
      this.logger.log(`mai-core replied fuente=${response.fuente ?? ''}`);
      return response;
    }
    this.logger.log(`Asking OpenAI básico: ${chatStructuredRequestDto.message}`);
    const dto = await this.openaiIntegrationService.chatStructured({
      message: chatStructuredRequestDto.message,
    });
    await this.msRoboticsService.speak({ message: dto.reply });
    return { reply: dto.reply, fuente: 'OpenAI', movimientos: [] };
  }

  async declarePoema(): Promise<ChatStructuredResponseDto> {
    const poema = await this.openaiIntegrationService.chatStructured({
      message: 'Declara un poema para Diana Serrano, con un tono romantico y amoroso',
    });
    await this.msRoboticsService.speak({ message: poema.reply });
    return poema;
  }
}
