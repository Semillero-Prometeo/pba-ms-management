import { Injectable } from '@nestjs/common';
import { MsRoboticsService } from 'src/ms-robotics-integration/ms-robotics.service';
import { ChatStructuredRequestDto } from 'src/openai-integration/dto/chat-structured-request.dto';
import { ChatStructuredResponseDto } from 'src/openai-integration/dto/chat-structured-response.dto';
import { OpenaiIntegrationService } from 'src/openai-integration/openai-integration.service';

@Injectable()
export class ChatService {
    constructor(private readonly openaiIntegrationService: OpenaiIntegrationService, private readonly msRoboticsService: MsRoboticsService) {}

    async chat(chatStructuredRequestDto: ChatStructuredRequestDto): Promise<ChatStructuredResponseDto> {
        const chatResponse = await this.openaiIntegrationService.chatStructured(chatStructuredRequestDto);

        await this.msRoboticsService.speak({ message: chatResponse.reply });

        return chatResponse;
    }
}
