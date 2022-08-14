import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Peer, MediaConnection } from "peerjs";
import { UserMediaContext } from "./UserMediaState";
import { useApi } from "/@/lib/useApi";
import { Audio } from "/@/components/Audio";
import { sfx } from "/@/lib/sound";
import { Video } from '../../components/Video';
import React from "react";
import { useLog } from "/@/components/useLog";

export const PeerContext = createContext<{
  connected: boolean;
  inCall: boolean;
  peerId: string | null;
  join: (channelId: string) => void;
  leave: () => void;
  connections: IConnection[];
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

export interface IParticipant {
  peerId: string;
  clientId: string;
  channelId: string;
}

export interface IConnection extends IParticipant {
  call: MediaConnection | null;
  isCaller: boolean;
  mediaStream: MediaStream | null;
  connected: boolean;
  videoElement: HTMLVideoElement | null;
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

  const [connections, setConnections] = useState<IConnection[]>([]);
  const [channel, setChannel] = useState<string | null>(null);

  const addIncomingCall = useCurrent(useCallback((call: MediaConnection) => {
    // TODO filter out incoming calls from the same peerId.
    setIncomingCalls(incomingCalls => ([...incomingCalls, call]));
  }, []));

  const removeIncomingCalls = (peerIds: string[]) => {
    setIncomingCalls(calls => calls.filter(call => !peerIds.includes(call.peer)));
  }

  const updateConnection = (peerId: string, data: Partial<IConnection>) => {
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
    setConnections(connections => {
      const conn = connections.find(c => c.peerId === peerId)
      if(conn && conn.call) {
        conn.call.close();
      }
      return connections;
    })
    removeConnection(peerId);
  }

  const addStream = (id: string, stream: MediaStream) => {
    // DE BOUNCE THE INCOMING STREAMS, CAUSE WTF?!
    setConnections(connections => {
      const connection = connections.find(c => c.peerId === id);
      if(!!connection && connection.mediaStream === null) {
        return connections.map(connection => {
          if(connection.peerId !== id) return connection;
          if(connection.mediaStream !== null) return connection;
          console.log('CREATED VIDEO ELEMENT');
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.autoplay = true;
          videoElement.muted = true;
          videoElement.style.height = '100%';
          
          return {
            ...connection,
            connected: true,
            mediaStream: stream,
            videoElement
          }
        })
      } else {
        return connections;
      }
    });
  }

  // replace mediastream in connections when mediaStream changes.
  useEffect(() => {
    if(mediaStream === null) return;
    setConnections(connections => {
      for(const conn of connections) {
        if(conn.call === null) continue;
        for(const sender of conn.call.peerConnection.getSenders()) {
          if(sender.track === null) continue;
          if(sender.track.kind === 'audio') {
            sender.replaceTrack(mediaStream.getAudioTracks()[0]);
          } else if(sender.track.kind === 'video') {
            sender.replaceTrack(mediaStream.getVideoTracks()[0]);
          }
        }
      }
      return connections;
    })
  }, [mediaStream])

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
    'voice:join'(data: IParticipant) {
      if(data.channelId !== channel) return;
      if(data.peerId === peerId) return;
      if(peerId === null) return;
      sfx.joinCall();
      const newConn: IConnection = {
        call: null,
        connected: false,
        clientId: data.clientId,
        peerId: data.peerId,
        channelId: data.channelId,
        isCaller: isCaller(peerId, data.peerId),
        mediaStream: null,
        videoElement: null
      };
      if(newConn.isCaller) {
        setOutgoingCalls(c => [...c, data.peerId]);
      }
      setConnections((connections) => ([
        ...connections,
        newConn
      ]))
    },
    'voice:leave'(data: IParticipant) {
      sfx.leaveCall();
      if(data.channelId !== channel) return;
      if(data.peerId === peerId) return;
      destroyConnection(data.peerId);
    },
    'voice:list'(data: { uid: string, participants: IParticipant[]}) {
      if(data.uid !== channel) return;
      if(peerId === null) return;
      if(connections.length !== 0) return;

      setConnections(connections => {
        console.log(connections);
        return data.participants
          .filter((p) => p.peerId !== peerId)
          .map((participant) => {
            const previousCall = null;
            const caller = isCaller(peerId, participant.peerId);
            if(caller) {
              setOutgoingCalls(c => [...c, participant.peerId]);
            }
            const newConnection: IConnection = {
              ...participant,
              call: null,
              isCaller: caller,
              mediaStream: null,
              connected: false,
              videoElement: null
            }
            return newConnection
          })
      });
    }
  }, [channel, peerId, connections]);

  useLog(connections[0], 'connections');

  // create and maintain a peer connection
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
    setConnections([]);
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
          <Audio
            key={conn.peerId}
            autoPlay
            hidden
            srcObject={conn.mediaStream}
          ></Audio>
        )
      ))}
    </div>
    {props.children}
  </PeerContext.Provider>
}


