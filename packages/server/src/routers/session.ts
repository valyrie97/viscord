import router from "../lib/router"
import { reply } from "../lib/WebSocketServer"

import invalidate from '../db/snippets/session/invalidate.sql'
import _get from '../db/snippets/session/get.sql'
import query from "../db/query";

export default router({
  async 'invalidate'(token: string) {
    await query(invalidate, token);
    return reply({
      err: null
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