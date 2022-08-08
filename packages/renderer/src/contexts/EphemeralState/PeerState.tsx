import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Peer, MediaConnection } from "peerjs";
import { UserMediaContext } from "./UserMediaState";

export const PeerContext = createContext<{
  connected: boolean;
  peerId: string | null
}>({
  connected: false,
  peerId: null
});

function useCurrent<T>(thing: T) {
  const thingRef = useRef<T>(thing);

  useEffect(() => {
    thingRef.current = thing;
  }, [thing]);

  return thingRef.current;
}

export default function PeerState(props: any) {

  const { mediaStream } = useContext(UserMediaContext);
  // TODO ability to disable until needed
  // const [enabled, setEnabled] = useState(true);
  const [connected, setConnected] = useState(false);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [incomingCalls, setIncomingCalls] = useState<MediaConnection[]>([]);

  const addCall = useCurrent(useCallback((call: MediaConnection) => {
    // HACK lookout for possible timing issues here.
    // if we get two incomming calls before a re-render
    // then our state could be out of date?!
    // a possible solution is to cache the 
    // append to the list, and if the cache and
    // state disagree, add to the cache, and set state
    // to the cached value.
    setIncomingCalls([...incomingCalls, call]);
  }, [incomingCalls]))

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
      addCall(call);
    });
  }, [connected]);

  const dial = useCallback((id: string) => {
    if(peer === null) return;
    if(mediaStream === null) return;
    peer.call(id, mediaStream);
  }, [peer, mediaStream])

  const value = useMemo(() => ({
    connected,
    peerId,
  }), [connected, peerId]);

  return <PeerContext.Provider value={value}>
    {props.children}
  </PeerContext.Provider>
}


