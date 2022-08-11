import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Peer, MediaConnection } from "peerjs";
import { UserMediaContext } from "./UserMediaState";
import { useApi } from "/@/lib/useApi";

export const PeerContext = createContext<{
  connected: boolean;
  inCall: boolean;
  peerId: string | null;
  join: (channelId: string) => void;
  leave: () => void;
}>({
  connected: false,
  peerId: null,
  inCall: false,
  join: () => {},
  leave: () => {}
});

function useCurrent<T>(thing: T) {
  const thingRef = useRef<T>(thing);

  useEffect(() => {
    thingRef.current = thing;
  }, [thing]);

  return thingRef.current;
}

interface Connection {
  peerId: string;
  clientId: string;
  channelID: string;
  call: any;
}

export default function PeerState(props: any) {

  const { mediaStream } = useContext(UserMediaContext);
  // TODO ability to disable until needed
  // const [enabled, setEnabled] = useState(true);
  const [connected, setConnected] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [incomingCalls, setIncomingCalls] = useState<MediaConnection[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [channel, setChannel] = useState<string | null>(null);

  const addIncomingCall = useCurrent(useCallback((call: MediaConnection) => {
    setIncomingCalls(incomingCalls => ([...incomingCalls, call]));
  }, []));
  
  const { send } = useApi({
    'voice:join'(data: any) {
      if(data.channelId !== channel) return
      console.log('PEER STATE CONNECTIONS', data);
    },
    'voice:leave'(data: any) {
      if(data.channelId !== channel) return
      console.log('PEER STATE CONNECTIONS', data)
    },
    'voice:list'(data: any) {
      if(data.uid !== channel) return
      setConnections(connections => {
        
      })
      console.log('PEER STATE CONNECTIONS', data);
    }
  }, [channel]);

  useEffect(() => {
    if(connected) return;

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
  }, [connected]);

  const dial = useCallback((id: string) => {
    if(peer === null) return;
    if(mediaStream === null) return;
    peer.call(id, mediaStream);
  }, [peer, mediaStream])

  const joinChannel = (channelId: string) => {
    setChannel(channelId);
    send('voice:list', { channelId })
  }

  useEffect(() => {
    if(channel === null) return;
    console.log('WE JOINED A CHANNEL')
  }, [channel])

  const value = useMemo(() => ({
    connected,
    peerId,
    inCall: connections.length === 0,
    join: joinChannel,
    leave: () => {}
  }), [connected, peerId, connections]);

  return <PeerContext.Provider value={value}>
    {props.children}
  </PeerContext.Provider>
}


