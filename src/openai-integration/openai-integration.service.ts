import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import OpenAI from 'openai';

import { ChatStructuredResponseDto } from './dto/chat-structured-response.dto';
import { CHAT_STRUCTURED_JSON_SCHEMA } from './schema/openai-response.schema';
import { OPENAI_SYSTEM_PROMPT } from './constants/system-prompt.constant';

@Injectable()
export class OpenaiIntegrationService {
  private readonly logger = new Logger(OpenaiIntegrationService.name);
  
  async chatStructured({ message }: { message: string }): Promise<ChatStructuredResponseDto> {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: OPENAI_SYSTEM_PROMPT },
          { role: 'user', content: message },
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

      this.logger.log('Parsed response:', parsed);

      const dto = plainToInstance<ChatStructuredResponseDto, unknown>(ChatStructuredResponseDto, parsed);
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
