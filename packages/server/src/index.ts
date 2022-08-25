import router from './lib/router';
import { expose, reply } from './lib/WebSocketServer';

// ws
import message from './routers/message';
import channel from './routers/channel';
import client from './routers/client';
import totp from './routers/totp';
import session from './routers/session';
import voice from './routers/voice';
import file from './routers/file';
import express from 'express';
import expressWs from 'express-ws';

// http
import fileRouter from './http/file';

const api = router({
  up() {
    return reply({
      time: Date.now()
    });
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
  voice: voice,
  file: file,
  files: file,
});

// var express = require('express');
// var app = express();
// var expressWs = require('express-ws')(app);

const app = express();
const ewss = expressWs(app);

// @ts-ignore
app.ws('/', expose(api, ewss.getWss()));
app.use('/file', fileRouter);

app.listen(3000);

// -------------

import { update } from './db/migrate';

try {
  update();
} catch (e) {
  console.error(e);
}