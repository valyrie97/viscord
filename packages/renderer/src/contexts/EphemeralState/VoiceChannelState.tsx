import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PeerContext } from "./PeerState";
import { useApi } from "/@/lib/useApi";

interface RemotePeer {
  mediaStream: MediaStream | null;
  peerId: string;
}

export const VoiceChannelContext = createContext<{
  voiceChannelId: string | null;
  setVoiceChannelId: (channelId: string | null) => void
}>({
  voiceChannelId: null,
  setVoiceChannelId: () => {}
});

export default function VoiceChannelState(props: any) {

  const [voiceChannelId, setVoiceChannelId] = useState<string | null>(null);
  const { peerId, incommingCalls } = useContext(PeerContext);
  const [peers, setPeers] = useState<RemotePeer[]>([]);

  const { send } = useApi({
    'voice:list'() {

    }
  })

  useEffect(() => {

  }, [voiceChannelId])


  const value = useMemo(() => ({
    voiceChannelId,
    setVoiceChannelId,
  }), [voiceChannelId, setVoiceChannelId])

  return <VoiceChannelContext.Provider value={value}>
    {props.children}
  </VoiceChannelContext.Provider>
}