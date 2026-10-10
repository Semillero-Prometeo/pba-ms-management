import { IsOptional, IsString } from 'class-validator';

export class ChatStructuredResponseDto {
  @IsString()
  reply: string;

  @IsOptional()
  @IsString()
  fuente?: string;
}
