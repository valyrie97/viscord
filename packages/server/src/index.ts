import { WebSocketServer } from 'ws';
import router from './routers/root';

const wss = new WebSocketServer({
  port: 3000,
}, () => {
  console.log('ws chat server started on dev.valnet.xyz');
});

wss.on('connection', (ws) => {
  ws.on('message', (str) => {
    try {
      const message = JSON.parse(str.toString());
      if(typeof message.action !== 'string') {
        console.warn('invalid JSON message');
        return;
      }
      const {action, data} = message;
      try {
        router(action, data);
      } catch(e) {
        console.warn(`error in action ${action}`);
        console.error(e);
      }
    } catch (e) {
      console.warn('JSON parse failed on message');
      console.error(e);
    }
  });
});

export function send(client: any, action: string, data?: any) {
  client.send(JSON.stringify({action, data}));
}

export function broadcast(action: string, data?: any) {
  for(const client of wss.clients) {
    send(client, action, data);
  }
}

export default wss;