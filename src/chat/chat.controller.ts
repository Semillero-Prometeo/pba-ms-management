import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MANAGEMENT_MS } from 'src/core/constants/ms-names.constant';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatStructuredRequestDto } from 'src/openai-integration/dto/chat-structured-request.dto';
import { ChatStructuredResponseDto } from 'src/openai-integration/dto/chat-structured-response.dto';
import { ChatModel, ChatRouteState } from './chat-route.store';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern(`${MANAGEMENT_MS}.chatService.chat`)
  chat(@Payload() chatStructuredRequestDto: ChatStructuredRequestDto): Promise<ChatStructuredResponseDto> {
    return this.chatService.chat(chatStructuredRequestDto);
  }

  @MessagePattern(`${MANAGEMENT_MS}.chatService.declarePoema`)
  declarePoema(): Promise<ChatStructuredResponseDto> {
    return this.chatService.declarePoema();
  }

  @MessagePattern(`${MANAGEMENT_MS}.chatService.getRoute`)
  getRoute(): ChatRouteState {
    return this.chatService.getRoute();
  }

  @MessagePattern(`${MANAGEMENT_MS}.chatService.setAutomation`)
  setAutomation(@Payload() body: { enabled: boolean }): ChatRouteState {
    return this.chatService.setAutomation(Boolean(body?.enabled));
  }

  @MessagePattern(`${MANAGEMENT_MS}.chatService.setModel`)
  setModel(@Payload() body: { model: ChatModel }): ChatRouteState {
    return this.chatService.setModel(body.model);
  }
}
