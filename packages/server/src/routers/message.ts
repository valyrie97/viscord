import query from '../db/query';
import router from '../lib/router';
import newMessage from '../db/snippets/message/new.sql';
import recentMessages from '../db/snippets/message/recent.sql';
import getName from '../db/snippets/client/get.sql';
import { broadcast, reply } from '../lib/WebSocketServer';

export default router({
  async message(data: any) {
    const response = await query(
      newMessage,
      data.text,
      data.from,
      data.uid,
      data.timestamp,
      data.channel,
    );
    if(response === null) return;
    // translate from to a real name
    const nameRes = await query(getName, data.from);
    if(nameRes === null) return;
    data.from = nameRes[0].name;
    return broadcast(data);
  },
  async recent(data: any) {
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