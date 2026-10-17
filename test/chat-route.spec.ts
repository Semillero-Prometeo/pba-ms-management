import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ChatRouteStore } from '../src/chat/chat-route.store';

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
