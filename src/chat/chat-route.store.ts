import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type ChatModel = 'basico' | 'complejo';

export interface ChatRouteState {
  automationEnabled: boolean;
  selectedModel: ChatModel;
}

export const DEFAULT_CHAT_ROUTE: ChatRouteState = {
  automationEnabled: true,
  selectedModel: 'complejo',
};

@Injectable()
export class ChatRouteStore {
  private readonly filePath: string;

  constructor() {
    this.filePath =
      process.env.MS_MANAGEMENT_CHAT_ROUTE_PATH?.trim() ||
      path.join(process.cwd(), 'data', 'chat-route.json');
  }

  read(): ChatRouteState {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<ChatRouteState>;
      const selectedModel = parsed.selectedModel === 'basico' ? 'basico' : 'complejo';
      const automationEnabled = parsed.automationEnabled === false ? false : true;
      return { automationEnabled, selectedModel };
    } catch {
      return this.write(DEFAULT_CHAT_ROUTE);
    }
  }

  write(next: ChatRouteState): ChatRouteState {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
    return next;
  }
}
