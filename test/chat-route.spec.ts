import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { RpcException } from '@nestjs/microservices';
import { ChatRouteStore } from '../src/chat/chat-route.store';
import { ChatService } from '../src/chat/chat.service';

describe('ChatRouteStore', () => {
  let filePath: string;

  beforeEach(() => {
    filePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'chat-route-')), 'chat-route.json');
    process.env.MS_MANAGEMENT_CHAT_ROUTE_PATH = filePath;
  });

  it('creates defaults when the file is missing', () => {
    const store = new ChatRouteStore();
    expect(store.read()).toEqual({ automationEnabled: true, selectedModel: 'complejo' });
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('recreates defaults when the file is corrupt', () => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, '{nope');
    const store = new ChatRouteStore();
    expect(store.read()).toEqual({ automationEnabled: true, selectedModel: 'complejo' });
  });

  it('persists a write', () => {
    const store = new ChatRouteStore();
    store.write({ automationEnabled: false, selectedModel: 'basico' });
    expect(new ChatRouteStore().read()).toEqual({ automationEnabled: false, selectedModel: 'basico' });
  });
});

function serviceWith(state: { automationEnabled: boolean; selectedModel: 'basico' | 'complejo' }) {
  const store = {
    read: () => ({ ...state }),
    write: (next: typeof state) => {
      Object.assign(state, next);
      return { ...state };
    },
  };
  const openai = { chatStructured: jest.fn().mockResolvedValue({ reply: 'hola' }) };
  const robotics = { speak: jest.fn().mockResolvedValue(undefined) };
  const maiCore = { ask: jest.fn().mockResolvedValue({ reply: 'turno', fuente: 'caché', movimientos: [] }) };
  const service = new ChatService(openai as never, robotics as never, maiCore as never, store as never);
  return { service, openai, robotics, maiCore, store };
}

describe('ChatService route', () => {
  it('uses OpenAI and speak when automation is off', async () => {
    const { service, openai, robotics, maiCore } = serviceWith({
      automationEnabled: false,
      selectedModel: 'basico',
    });
    const res = await service.chat({ message: 'hola' });
    expect(openai.chatStructured).toHaveBeenCalledWith({ message: 'hola' });
    expect(robotics.speak).toHaveBeenCalledWith({ message: 'hola' });
    expect(maiCore.ask).not.toHaveBeenCalled();
    expect(res).toEqual({ reply: 'hola', fuente: 'OpenAI', movimientos: [] });
  });

  it('uses OpenAI when automation is on and model is basico', async () => {
    const { service, maiCore } = serviceWith({ automationEnabled: true, selectedModel: 'basico' });
    await service.chat({ message: 'hola' });
    expect(maiCore.ask).not.toHaveBeenCalled();
  });

  it('uses mai-core when automation is on and model is complejo', async () => {
    const { service, openai, robotics, maiCore } = serviceWith({
      automationEnabled: true,
      selectedModel: 'complejo',
    });
    const res = await service.chat({ message: 'hola' });
    expect(maiCore.ask).toHaveBeenCalledWith('hola');
    expect(openai.chatStructured).not.toHaveBeenCalled();
    expect(robotics.speak).not.toHaveBeenCalled();
    expect(res.fuente).toBe('caché');
  });

  it('forces basico when automation is turned off', () => {
    const state = { automationEnabled: true, selectedModel: 'complejo' as const };
    const { service } = serviceWith(state);
    expect(service.setAutomation(false)).toEqual({ automationEnabled: false, selectedModel: 'basico' });
  });

  it('rejects complejo while automation is off', () => {
    const { service } = serviceWith({ automationEnabled: false, selectedModel: 'basico' });
    try {
      service.setModel('complejo');
      throw new Error('expected RpcException');
    } catch (err) {
      expect(err).toBeInstanceOf(RpcException);
      expect((err as RpcException).getError()).toEqual({
        statusCode: 409,
        message: 'Los turnos automáticos están apagados',
      });
    }
  });
});
