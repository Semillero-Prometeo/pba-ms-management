import { Injectable } from '@nestjs/common';
import { ChatStructuredRequestDto } from 'src/openai-integration/dto/chat-structured-request.dto';
import { ChatStructuredResponseDto } from 'src/openai-integration/dto/chat-structured-response.dto';
import { OpenaiIntegrationService } from 'src/openai-integration/openai-integration.service';

@Injectable()
export class ChatService {
    constructor(private readonly openaiIntegrationService: OpenaiIntegrationService) {}

    async chat(chatStructuredRequestDto: ChatStructuredRequestDto): Promise<ChatStructuredResponseDto> {
        return this.openaiIntegrationService.chatStructured(chatStructuredRequestDto);
    }
}
