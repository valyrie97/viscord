import router from '../lib/router';
import query from '../db/query';
import { reply } from '../lib/WebSocketServer';

import _new from '../db/snippets/client/new.sql';
import _get from '../db/snippets/client/get.sql';
import rename from '../db/snippets/client/rename.sql';

export default router({
  async 'new'(data: any) {
    const response = await query(
      _new,
      data.displayName,
      data.username,
    );
    if(response === null) return;
    return reply(response[0][0].uid);
  },
  async 'get'(uid: string) {
    const response = await query(_get, uid);
    if(response === null) return;
    return reply(response[0].name);
  },
  async 'rename'(data: any) {
    const { clientId, name } = data;
    const res = await query(rename, name, clientId);
    // silent failure O.O
  },
});