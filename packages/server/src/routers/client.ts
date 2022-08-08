import router from '../lib/router';
import query from '../db/query';
import { broadcast, reply } from '../lib/WebSocketServer';

import _new from '../db/snippets/client/new.sql';
import _get from '../db/snippets/client/get.sql';
import rename from '../db/snippets/client/rename.sql';
import database from '../lib/dbHelpers/database';

export default router({
  async 'new'(data: any) {
    const response = await query(
      _new,
      data.displayName,
      data.username,
    );
    if(response === null) return;
    return broadcast({
      clientId: response[0][0].uid
    });
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
  async list() {
    return reply({
      clients: await database.get.all.displayNames()
    });
  }
});