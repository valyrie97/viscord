import router from './lib/router';
import { expose } from './lib/WebSocketServer';

import message from './routers/message';
import channel from './routers/channel';
import client from './routers/client';

const api = router({
  up() {
    console.log(Date.now());
  },
  message: message,
  messages: message,
  channel: channel,
  channels: channel,
  client: client,
  clients: client,
});

expose(api, 3000);

// -------------

import { update } from './db/migrate';

try {
  update();
} catch (e) {
  console.error(e);
}