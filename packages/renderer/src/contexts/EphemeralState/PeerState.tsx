import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Peer, MediaConnection } from "peerjs";
import { UserMediaContext } from "./UserMediaState";
import { useApi } from "/@/lib/useApi";
import { Audio } from "/@/components/Audio";
import { sfx } from "/@/lib/sound";

export const PeerContext = createContext<{
  connected: boolean;
  inCall: boolean;
  peerId: string | null;
  join: (channelId: string) => void;
  leave: () => void;
  connections: Connection[];
  connectedChannel: string | null;
}>({
  connected: false,
  peerId: null,
  inCall: false,
  join: () => {},
  leave: () => {},
  connections: [],
  connectedChannel: null
});

function useCurrent<T>(thing: T) {
  const thingRef = useRef<T>(thing);

  useEffect(() => {
    thingRef.current = thing;
  }, [thing]);

  return thingRef.current;
}

export interface Connection {
  peerId: string;
  clientId: string;
  channelId: string;
  call: MediaConnection | null;
  isCaller: boolean;
  mediaStream: MediaStream | null;
  connected: boolean;
}

function isCaller(a: string, b:string) {
  return [a, b].sort()[0] === a;
}

export default function PeerState(props: any) {

  const { mediaStream } = useContext(UserMediaContext);
  // TODO ability to disable until needed
  // const [enabled, setEnabled] = useState(true);
  const [connected, setConnected] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);

  const [incomingCalls, setIncomingCalls] = useState<MediaConnection[]>([]);
  const [outgoingCalls, setOutgoingCalls] = useState<string[]>([]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [channel, setChannel] = useState<string | null>(null);

  const addIncomingCall = useCurrent(useCallback((call: MediaConnection) => {
    // TODO filter out incoming calls from the same peerId.
    setIncomingCalls(incomingCalls => ([...incomingCalls, call]));
  }, []));

  const removeIncomingCalls = (peerIds: string[]) => {
    setIncomingCalls(calls => calls.filter(call => !peerIds.includes(call.peer)));
  }

  const updateConnection = (peerId: string, data: Partial<Connection>) => {
    setConnections(connections => connections.map(connection => {
      if(connection.peerId !== peerId) return connection;
      return {
        ...connection,
        ...data
      }
    }))
  }

  const removeConnection = (peerId: string) => {
    setConnections(connections => connections.filter(connection => connection.peerId !== peerId));
  }

  const destroyConnection = (peerId: string) => {
    setConnections(connections => connections.filter(connection => {
      if(connection.peerId !== peerId) return true;
      if(connection.call) {
        connection.call.close();
        removeConnection(peerId);
      }
    }))
  }

  const addStream = (id: string, stream: MediaStream) => {
    updateConnection(id, { mediaStream: stream, connected: true });
  }

  // accept / reject incoming calls
  useEffect(() => {
    if(incomingCalls.length === 0) return;
    if(mediaStream === null) return;
    const possiblePeerIds = connections.map(c => c.peerId);
    for(const call of incomingCalls) {
      if(!possiblePeerIds.includes(call.peer))
        continue;
      call.on('stream', (stream) => addStream(call.peer, stream));
      call.answer(mediaStream);
      call.on('close', () => removeConnection(call.peer));
      updateConnection(call.peer, { call });
    }
    removeIncomingCalls(possiblePeerIds);
  }, [incomingCalls, connections, mediaStream])

  // call peers that we should call
  useEffect(() => {
    if(outgoingCalls.length === 0) return;
    if(mediaStream === null) return;
    if(peer === null) return;
    for(const id of outgoingCalls) {
      const call = peer.call(id, mediaStream);
      call.on('close', () => removeConnection(id));
      call.on('stream', (stream) => addStream(call.peer, stream));
      updateConnection(id, { call });
    }
    setOutgoingCalls(prev => prev.filter(id => !outgoingCalls.includes(id)));
  }, [outgoingCalls, mediaStream, peer]);

  const { send } = useApi({
    'voice:join'(data: any) {
      if(data.channelId !== channel) return;
      if(data.peerId === peerId) return;
      if(peerId === null) return;
      sfx.joinCall();
      const newConn: Connection = {
        call: null,
        connected: false,
        clientId: data.clientId,
        peerId: data.peerId,
        channelId: data.channelId,
        isCaller: isCaller(peerId, data.peerId),
        mediaStream: null
      };
      if(newConn.isCaller) {
        setOutgoingCalls(c => [...c, data.peerId]);
      }
      setConnections((connections) => ([
        ...connections,
        newConn
      ]))
    },
    'voice:leave'(data: any) {
      sfx.leaveCall();
      if(data.channelId !== channel) return;
      if(data.peerId === peerId) return;
      setConnections(connections => connections.filter(connection => (
        connection.channelId !== data.channelId ||
        connection.clientId !== data.clientId ||
        connection.peerId !== data.peerId
      )));
    },
    'voice:list'(data: any) {
      if(data.uid !== channel) return;
      if(peerId === null) return;
      setConnections(connections => {
        return data.participants
        .filter((p: any) => p.peerId !== peerId)
        .map((participant: any) => {
          const previousCall = null;
          const caller = isCaller(peerId, participant.peerId);
          if(caller) {
            setOutgoingCalls(c => [...c, participant.peerId]);
          }
          return {
            ...participant,
            call: null,
            isCaller: caller
          }
        })
      });
    }
  }, [channel, peerId]);


  useEffect(() => {
    if(connected) return;
    if(peer !== null) return;
    {
      const peer = new Peer();
      setPeer(peer);

      peer.on('open', (id: string) => {
        setConnected(true);
        setPeerId(id);
      });

      peer.on('close', () => {
        setConnected(false);
        setPeerId(null);
        setPeer(null);
      });

      peer.on('call', (call: MediaConnection) => {
        addIncomingCall(call);
      });
    }
  }, [connected, peer]);

  const joinChannel = (channelId: string) => {
    sfx.joinCall();
    setChannel(channelId);
    send('voice:list', { channelId });
  }

  const leaveChannel = () => {
    setChannel(null);
  }

  const value = useMemo(() => ({
    connected,
    peerId,
    inCall: channel !== null,
    join: joinChannel,
    leave: leaveChannel,
    connections,
    connectedChannel: channel
  }), [connected, peerId, connections, channel]);

  return <PeerContext.Provider value={value}>
    <div>
      {connections.map(conn => (
        (conn.mediaStream !== null) && (
          <div key={conn.peerId}>
            <Audio autoPlay hidden srcObject={conn.mediaStream}></Audio>
          </div>
        )
      ))}
    </div>
    {props.children}
  </PeerContext.Provider>
}


