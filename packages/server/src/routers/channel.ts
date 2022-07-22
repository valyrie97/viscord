import query from '../db/query';
import router from '../lib/router';
import list from '../db/snippets/channel/list.sql';
import add from '../db/snippets/channel/new.sql';
import { broadcast, reply } from '../lib/WebSocketServer';
import { v4 } from 'uuid';

export default router({
  async list() {
    const res = await query(list);
    return reply(res ?? undefined);
  },
  async add(channel: any) {
    const name = channel.name;
    const uid = v4();
    // console.log(channel);
    const res = await query(add, name, uid);
    if(res === null) return;
    // console.log(res);
    return broadcast({
      uid,
      name,
    });
  },
});