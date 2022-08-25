import router from "../lib/router"
import { reply } from "../lib/WebSocketServer"

import invalidate from '../db/snippets/session/invalidate.sql'
import _get from '../db/snippets/session/get.sql'
import query from "../db/query";
import { getClientIdByUsername } from "../lib/getClientIdByUsername";
import { generateSessionToken } from "../lib/generateSessionToken";
import { validateTotp } from "../lib/validateTotp";
import { validateClientTotp } from "../lib/validateClientTotp";

const randomWait = async () => await new Promise(res => setTimeout(res, Math.random() * 300));

export default router({
  async 'invalidate'(data: any) {
    await query(invalidate, data.$sessionToken);
    return reply({
      err: null
    })
  },
  async 'login'(data: any) {
    await randomWait();
    const { username, totp } = data;
    const clientId = await getClientIdByUsername(username);
    if(clientId === null) return reply({
      err: 'Incorrect username or auth code'
    });
    const validTotp = await validateClientTotp(clientId, totp);
    if(!validTotp) return reply({
      err: 'Incorrect username or auth code'
    });
    const sessionToken = await generateSessionToken(clientId);
    return reply({
      err: null,
      sessionToken,
      clientId
    })
  }
});

export async function validateSessionToken(token: string) {
  const res = await query(_get, token);
  if(res === null) return null;
  if(res.length === 1 && res[0].expires > Date.now())
    return res[0].client_uid;
  return null;
}