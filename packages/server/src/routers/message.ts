import query from '../db/query';
import router from '../lib/router';
import newMessage from '../db/snippets/message/new.sql';
import recentMessages from '../db/snippets/message/recent.sql';
import { broadcast, reply } from '../lib/WebSocketServer';

export default router({
  async message(data: any) {
    const failed = null === await query(
      newMessage,
      data.text,
      data.from,
      data.uid,
      data.timestamp,
      data.channel,
    );
    if(failed) return;
    return broadcast(data);
  },
  async recent(data: any) {
    console.log('got recents request ch', data.channel);
    const messages = await query(recentMessages, data.channel);
    if(messages === null) return;
    return reply({
      messages: messages.map(v => ({
        from: v.from,
        uid: v.uid,
        timestamp: v.t_sent,
        text: v.text,
      })),
    });
  },
});