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
  async 'get'(data: any) {
    const response = await query(_get, data.clientId);
    if(response === null) return;
    return reply({
      name: response[0].name,
      clientId: response[0].uid,
      username: response[0].username
    });
  },
  async 'rename'(data: any) {
    const { clientId, name } = data;
    const res = await query(rename, name, clientId);
    // silent failure O.O
  },
});