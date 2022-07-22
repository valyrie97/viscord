import router from './lib/router';
import message from './routers/message';
import { expose } from './lib/WebSocketServer';

const api = router({
  up() {
    console.log(Date.now());
  },
  message: message,
  messages: message,
  channel: channel,
  channels: channel,
});

expose(api, 3000);

// -------------

import { update } from './db/migrate';
import channel from './routers/channel';

try {
  update();
} catch (e) {
  console.error(e);
}