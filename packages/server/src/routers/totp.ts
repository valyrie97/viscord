import router from "../lib/router"
import { reply } from "../lib/WebSocketServer"
import query from "../db/query";
import confirm from '../db/snippets/totp/confirm.sql';
import { validateTotp } from "../lib/validateTotp";
import { generateSessionToken } from "../lib/generateSessionToken";
import { generateTotpKey } from "../lib/generateTotpKey";

const proposals: any = {}

export default router({
  'propose'(clientId: string) {
    if(clientId in proposals) return reply(proposals[clientId]);
    const key = generateTotpKey();
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