import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MANAGEMENT_MS } from 'src/core/constants/ms-names.constant';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatStructuredRequestDto } from 'src/openai-integration/dto/chat-structured-request.dto';
import { ChatStructuredResponseDto } from 'src/openai-integration/dto/chat-structured-response.dto';

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
}
