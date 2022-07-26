import WebSocket from "ws";
import router from "../lib/router";
import { broadcast, reply, send } from "../lib/WebSocketServer";

function filterInPlace<T>(a: T[], condition: (v: T, i: number, a: T[]) => boolean) {
  let i = 0, j = 0;

  let copy = [...a];
  let removed = [];

  while (i < a.length) {
    const val = a[i];
    if (condition(val, i, copy)) a[j++] = val;
    else removed.push(val);
    i++;
  }

  a.length = j;
  return removed;
}

interface ClientChannelRelationship {
  clientId: string;
  channelId: string;
  peerId: string;
}

const participants: ClientChannelRelationship[] = [];

export default router({
  async join(data: any, ws: WebSocket.WebSocket, wss: WebSocket.Server) {
    const { $clientId, channelId, peerId } = data;
    // TODO validate channel exists
    if(participants
      .filter(v => v.clientId === $clientId)
      .length !== 0) {
      // TODO REMOVE USER FROM THIS PLACE
    }

    const user_channel = {
      clientId: $clientId,
      peerId,
      channelId
    };

    participants.push(user_channel);

    ws.on('close', () => {
      filterInPlace(participants, (p => p !== user_channel));
      send(wss.clients, 'voice:leave', user_channel)
    })

    return broadcast(user_channel)
  },
  async list(data: any) {
    const uid = data.uid ?? data.channelId
    return reply({
      uid: uid,
      participants: participants.filter(v => uid === v.channelId)
    });
  },
  async leave(data: any) {
    const { $clientId } = data;
    const removed = filterInPlace(participants, (v) => v.clientId !== $clientId);
    return broadcast(removed[0]);
  },
})