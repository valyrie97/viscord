import router from "../lib/router"
import { reply } from "../lib/WebSocketServer"
import { randomBytes } from 'crypto';
import getToken from 'totp-generator';
import query from "../db/query";
import confirm from '../db/snippets/totp/confirm.sql';
//         0               1               2               3               4
//  |               |               |               |               |               |
//  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0
//  0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0 1 2 3 4 0
//  |         |         |         |         |         |         |         |         |
//      a         b         c         d         e         f         g         h    
const mask = (len: number) => Math.pow(2, len) - 1;

const manipulate = (b: number, start: number, len: number, end: number) =>
  (((b >> start) & mask(len)) << end) & (mask(len) << end)

const dict = (n: number): string => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.at(n) as string;

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
    const trueCode = getToken(key);
    if(trueCode !== code) return reply({
      err: 'codes did not match!'
    });
    
    // add to database!

    const response = await query(confirm, key, clientId);
    if(response === null) return reply({
      err: 'unknown database error, contact server admin.'
    });

    return reply({
      err: null
    });
  }
})