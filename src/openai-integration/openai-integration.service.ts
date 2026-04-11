import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import OpenAI from 'openai';

import { ChatStructuredResponseDto } from './dto/chat-structured-response.dto';
import { CHAT_STRUCTURED_JSON_SCHEMA } from './openai-response.schema';

@Injectable()
export class OpenaiIntegrationService {
  constructor(private readonly configService: ConfigService) {}

  async chatStructured(userMessage: string): Promise<ChatStructuredResponseDto> {
    const apiKey = this.configService.get<string>('configEnvs.openaiApiKey');
    const systemPrompt = this.configService.get<string>('configEnvs.openaiSystemPrompt');
    const model = this.configService.get<string>('configEnvs.openaiModel');

    const client = new OpenAI({ apiKey });

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: CHAT_STRUCTURED_JSON_SCHEMA.name,
            strict: CHAT_STRUCTURED_JSON_SCHEMA.strict,
            schema: CHAT_STRUCTURED_JSON_SCHEMA.schema as Record<string, unknown>,
          },
        },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new RpcException({
          statusCode: 502,
          message: 'OpenAI returned an empty completion',
        });
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(content) as unknown;
      } catch {
        throw new RpcException({
          statusCode: 502,
          message: 'OpenAI returned invalid JSON',
        });
      }

      const dto = plainToInstance(ChatStructuredResponseDto, parsed);
      const errors = validateSync(dto);
      if (errors.length > 0) {
        throw new RpcException({
          statusCode: 502,
          message: 'Structured response failed validation',
        });
      }

      return dto;
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }
      if (err instanceof OpenAI.APIError) {
        throw new RpcException({
          statusCode: err.status ?? 502,
          message: err.message,
        });
      }
      throw new RpcException({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'OpenAI request failed',
      });
    }
  }
}
