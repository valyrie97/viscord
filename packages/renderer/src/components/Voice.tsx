import { useCallback, useContext } from "react"
import { PeerContext } from "../contexts/EphemeralState/PeerState";
import useChannel from "../hooks/useChannel";
import { useApi } from "../lib/useApi";



export default function Voice(props: any) {
  const { uid } = props;
  const { connected, peerId, join } = useContext(PeerContext);
  const { channel } = useChannel();

  const { send } = useApi({});

  const joinCall = useCallback(() => {
    if(peerId === null || connected === false || channel === null) return;
    join(channel);
    send('voice:join', { peerId, channelId: channel })
  }, [connected, peerId, channel]);

  const leaveCall = useCallback(() => {
    if(peerId === null || connected === false) return;
    send('voice:leave', { peerId, channelId: channel })
  }, [connected, peerId, channel]);

  return <div style={{
    width: '100%',
    maxWidth: '500px',
    margin: '0px auto',
  }}>
    <fieldset>
      <legend>Peer Info</legend>
      connected: {connected ? 'true' : 'false'}<br></br>
      PeerId: {peerId}<br></br>
    </fieldset>
    <fieldset>
      <legend>Actions</legend>
      <button onClick={joinCall}>Join Call</button>
      <button onClick={leaveCall}>Leave Call</button>
    </fieldset>
  </div>
}