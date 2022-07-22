import { WebSocketServer } from 'ws';

export function expose(router: Function, port: number) {
  const wss = new WebSocketServer({
    port: 3000,
  }, () => {
    console.log('ws chat server started on dev.valnet.xyz');
  });
  
  wss.on('connection', (ws) => {
    ws.on('message', async (str) => {
      try {
        const message = JSON.parse(str.toString());
        if(typeof message.action !== 'string') {
          console.warn('invalid JSON message');
          return;
        }
        const {action, data} = message;
        try {
          console.log('[IN]', action, data);
          const _return = await (router(action, data) as unknown as Promise<any>);
          // console.log(_return);
          if(_return) {
            try {
              switch(_return.type) {
                case ResponseType.BROADCAST: {
                  console.log('[OUT_BROADCAST]', action, _return.data);
                  for(const client of wss.clients) {
                    send(client, action, _return.data);
                  }
                  break;
                }
                case ResponseType.REPLY: {
                  console.log('[OUT]', action, _return.data);
                  send(ws, action, _return.data);
                  break;
                }
              }
            } catch(e) {
              console.warn(e);
            }
          }
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
}

enum ResponseType {
  BROADCAST,
  REPLY
}

function send(client: any, action: string, data?: any) {
  client.send(JSON.stringify({action, data}));
}

export function broadcast(data: any) {
  return {
    type: ResponseType.BROADCAST,
    data,
  };
}

export function reply(data: any) {
  return {
    type: ResponseType.REPLY,
    data,
  };
}

// export default wss;