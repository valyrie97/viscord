import query from '../db/query';
import router from '../lib/router';
import newMessage from '../db/snippets/message/new.sql';
import recentMessages from '../db/snippets/message/recent.sql';
import { broadcast, reply } from '../lib/WebSocketServer';
import database from '../lib/dbHelpers/database';

function transformMessage(text: string) {
  if(text === '/shrug') {
    return '¯\\_(ツ)_/¯';
  }
  else return text;
}

export default router({
  async message(data: NewMessageRequest) {
    if(!('$clientId' in data) || data.$clientId === undefined) {
      console.error('unauthenticated message rejected.');
      return null;
    }

    const file = data.file !== undefined ?
      await database.get.file.by.uid(data.file) :
      undefined;
    
    const response = await query(
      newMessage,
      data.text,
      data.$clientId,
      data.uid,
      data.timestamp,
      data.channel,
      data.file ?? null
    );
    if(response === null) return;

    const res: NewMessageResponse = {
      uid: data.uid,
      from: data.$clientId,
      text: data.text,
      timestamp: data.timestamp,
      channel: data.channel,
    }

    if(file !== undefined) {
      res.file = {
        type: file.type,
        url: `https://dev.valnet.xyz/file/${file.uid}`
      }
    }

    return broadcast(res);
  },
  async recent(data: any) {
    if(!('$clientId' in data)) {
      console.error('unauthenticated request rejected.');
      return null;
    }
    const messages = await query(recentMessages, data.channel);
    if(messages === null) return;

    function convert(row: any) {
      if(row.file_uid === null) {
        return {
          from: row.from,
          uid: row.uid,
          timestamp: row.t_sent,
          text: row.text,
        }
      } else {
        return {
          from: row.from,
          uid: row.uid,
          timestamp: row.t_sent,
          text: row.text,
          file: {
            type: row.file_type,
            url: `https://dev.valnet.xyz/file/${row.file_uid}`
          }
        }
      }
    }

    return reply({
      messages: messages.map(convert),
      channel: data.channel
    });
  },
});