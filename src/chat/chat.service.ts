import { Injectable, Logger } from '@nestjs/common';
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
  ) {}

  async chat(chatStructuredRequestDto: ChatStructuredRequestDto): Promise<ChatStructuredResponseDto> {
    this.logger.log("Sending message to openai integration");
    
    // const response: ChatStructuredResponseDto = {
    //   reply: 'Hola, soy R-One, el asistente de la Universidad Libre de Colombia. ¿En qué puedo ayudarte?',
    // };
    // return response;

    const chatResponse = await this.openaiIntegrationService.chatStructured(chatStructuredRequestDto);

    await this.msRoboticsService.speak({ message: chatResponse.reply });

    return chatResponse;
  }
}
