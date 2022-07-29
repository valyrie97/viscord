import router from "../lib/router"
import { reply } from "../lib/WebSocketServer"
import { randomBytes } from 'crypto';
import getToken from 'totp-generator';
import query from "../db/query";
import confirm from '../db/snippets/totp/confirm.sql';
import addSessionToken from '../db/snippets/session/new.sql';

const validateTotp = (key: string, code: string) => {
  return [
    getToken(key, { timestamp: Date.now() }),
    getToken(key, { timestamp: Date.now() - 30 * 1000 }),
    getToken(key, { timestamp: Date.now() - 2 * 30 * 1000})
  ].includes(code);
}

const generateSessionToken = async (clientId: string) => {
  let token = '';
  for(let i = 0; i < 64; i ++) {
    token += rb32()
  }
  console.log('created session token', clientId, token);
  //           scnd   min  hr  day   year
  const year = 1000 * 60 * 60 * 24 * 365;
  const expiration = Date.now() + year;
  await query(addSessionToken, clientId, expiration, token);
  return token;
}

//         0               1               2               3               4
//  |               |               |               |               |               |
//  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0
//  0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0
//  |         |         |         |         |         |         |         |         |
//      a         b         c         d         e         f         g         h    
const mask = (len: number) => Math.pow(2, len) - 1;

const manipulate = (b: number, start: number, len: number, end: number) =>
  (((b >> start) & mask(len)) << end) & (mask(len) << end)

const dict = (n: number): string => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[n] as string;

function rb32() {
  const bytes = randomBytes(5);

  const a = manipulate(bytes[0], 3, 5, 0);
  const b = manipulate(bytes[0], 0, 3, 2) | manipulate(bytes[1], 6, 2, 0);
  const c = manipulate(bytes[1], 1, 5, 0);
  const d = manipulate(bytes[1], 0, 1, 4) | manipulate(bytes[2], 4, 4, 0);
  const e = manipulate(bytes[2], 0, 4, 1) | manipulate(bytes[3], 7, 1, 0);
  const f = manipulate(bytes[3], 2, 5, 0);
  const g = manipulate(bytes[3], 0, 2, 3) | manipulate(bytes[4], 5, 3, 0);
  const h = manipulate(bytes[4], 0, 5, 0);

  return dict(a) + dict(b) + dict(c) + dict(d) + dict(e) + dict(f) + dict(g) + dict(h);
}

const totpKey = () => rb32() + rb32();

const proposals: any = {}

export default router({
  'propose'(clientId: string) {
    if(clientId in proposals) return reply(proposals[clientId]);
    const key = totpKey();
    proposals[clientId] = key;
    console.log(clientId, proposals)
    setTimeout(() => {
      delete proposals[clientId];
    }, 5 * 60 * 1000);
    console.log('created totp proposal');
    return reply(key)
  },
  async 'confirm'(data: any) {
    const { clientId, code } = data;
    const key = proposals[clientId];
    if(!validateTotp(key, code)) return reply({
      err: 'codes did not match!'
    });
    
    // add to database!

    const response = await query(confirm, key, clientId);
    if(response === null) return reply({
      err: 'unknown database error, contact server admin.'
    });

    return reply({
      token: await generateSessionToken(clientId),
      err: null
    });
  }
})