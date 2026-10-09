import { ChatService } from './chat.service';

describe('ChatService.chat', () => {
  it('asks mai-core and does not speak or call OpenAI', async () => {
    const openai = { chatStructured: jest.fn() };
    const robotics = { speak: jest.fn() };
    const maiCore = { ask: jest.fn().mockResolvedValue({ reply: 'desde mai-core' }) };
    const service = new ChatService(openai as never, robotics as never, maiCore as never);

    await expect(service.chat({ message: 'Hola R-One' })).resolves.toEqual({
      reply: 'desde mai-core',
    });
    expect(maiCore.ask).toHaveBeenCalledWith('Hola R-One');
    expect(openai.chatStructured).not.toHaveBeenCalled();
    expect(robotics.speak).not.toHaveBeenCalled();
  });
});
