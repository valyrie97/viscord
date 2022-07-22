import query from '../db/query';
import router from '../lib/router';
import list from '../db/snippets/channel/list.sql';
import { reply } from '../lib/WebSocketServer';

export default router({
  async list() {
    const res = await query(list);
    return reply(res ?? undefined);
  },
});