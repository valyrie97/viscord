import router from './lib/router';
import { expose } from './lib/WebSocketServer';

import message from './routers/message';
import channel from './routers/channel';
import client from './routers/client';
import totp from './routers/totp';

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
  totp: totp,
  session: session,
  sessions: session,
});

expose(api, 3000);

// -------------

import { update } from './db/migrate';
import session from './routers/session';

try {
  update();
} catch (e) {
  console.error(e);
}