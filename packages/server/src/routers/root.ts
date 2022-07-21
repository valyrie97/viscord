import router from '../router';
import { broadcast } from '../index';
import query from '../db/query';
import newMessage from '../db/snippets/message/new.sql';
import recentMessages from '../db/snippets/message/recent.sql';

export default router({
  up() {
    console.log(Date.now());
  },
  message(data: any) {
    query(newMessage, data.text, data.from, data.uid, data.timestamp);
    broadcast('message', data);
  },
  async recent() {
    console.log('got recents request');
    const messages = await query(recentMessages);
    return {
      action: 'recent',
      data: {
        messages: messages.map(v => ({
          from: v.from,
          uid: v.uid,
          timestamp: v.t_sent * 1000,
          text: v.text,
        })),
      },
    };
  },
});