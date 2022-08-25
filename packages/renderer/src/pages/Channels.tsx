import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useApi } from '../lib/useApi';
import type { IMessage } from './Message';
import useChannel from '../hooks/useChannel';
import useClientId from '../hooks/useClientId';
import useHomeServer from '../contexts/PersistentState/useHomeServerNative';
import Channel from './Channel';
import { ChannelType } from '../contexts/EphemeralState/EphemeralState';
import { sfx } from '../lib/sound';

interface IChannel {
  uid: string;
  name: string;
  type: ChannelType;
}

interface IUnreads {
  [uid: string]: number
}

export default function Channels() {

  const [channels, setChannels] = useState<IChannel[]>([]);
  const [unreads, setUnreads] = useState<IUnreads>({});

  const { channel, setChannel } = useChannel();
  const { clientId } = useClientId();

  const { send } = useApi({
    'channels:list'(data: any) {
      setChannels(data.channels);
    },
    'channel:add'(channel: IChannel) {
      setChannels([...channels, channel]);
    },
    'message:message'(message: IMessage) {
      sfx.message();
      if(channel === message.channel) return;
      
      setUnreads({
        ...unreads,
        [message.channel]: (unreads[message.channel] ?? 0) + 1,
      });
    },
  }, [channels, unreads]);

  useEffect(() => {
    if(channels.length === 0) {
      send('channels:list');
    }
  }, [channels]);

  useEffect(() => {
    if(channels.length === 0) return;
    if(channel !== null) return;
    setChannel(channels[0].uid, channels[0].type);
  }, [channel, channels]);

  useEffect(() => {
    if(!channel) return;
    setUnreads({
      ...unreads,
      [channel]: 0,
    });
  }, [channel]);

  useEffect(() => {
    if(clientId === null) return;
    // send('client:get', { clientId });
  }, [clientId]);

  const textbox = useRef<HTMLInputElement>(null);
  const add = useCallback(() => {
    if(textbox.current === null) return;
    const name = textbox.current.value;
    textbox.current.value = '';
    send('channel:add', { name });
  }, []);

  return (
    <div style={{
      height: '100%',
      background: 'var(--neutral-3)',
      padding: '0px 8px',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <br></br>
      {channels.map(c => (
        <Channel
          key={c.uid}
          uid={c.uid}
          type={c.type}
          unread={unreads[c.uid] ?? 0}
          name={c.name}
        ></Channel>
      ))}
    </div>
  );
}