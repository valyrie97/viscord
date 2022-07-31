import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useApi } from '../lib/useApi';
import type { IMessage } from './Message';
import NameTextbox from './NameTextbox';
import LoginQR from './LoginQR';
import Totp from '../components/Totp';
import useChannel from '../hooks/useChannel';
import useClientId from '../hooks/useClientId';
import useHomeServer from '../contexts/PersistentState/useHomeServerNative';
import Logout from '../components/Logout';
import { CgHashtag } from 'react-icons/cg';
import Channel from './Channel';

interface IChannel {
  uid: string;
  name: string;
}

interface IUnreads {
  [uid: string]: number
}

export default function Channels() {

  const [channels, setChannels] = useState<IChannel[]>([]);
  const [unreads, setUnreads] = useState<IUnreads>({});
  
  const { channel, setChannel } = useChannel()
  const { clientId } = useClientId()

  const { setHomeServer } = useHomeServer();

  const { send } = useApi({
    'channels:list'(data: IChannel[]) {
      setChannels(data);
    },
    'channel:add'(channel: IChannel) {
      setChannels([...channels, channel]);
    },
    'message:message'(message: IMessage) {
      if(channel === message.channel) return;
      setUnreads({
        ...unreads,
        [message.channel]: (unreads[message.channel] ?? 0) + 1,
      });
    },
  }, [channels, unreads]);

  useEffect(() => {
    // console.log('unreads', unreads);
  }, [unreads]);

  useEffect(() => {
    if(channels.length === 0) {
      send('channels:list');
    }
  }, [channels]);

  useEffect(() => {
    // console.log(channel, channels);
    if(channels.length === 0) return;
    if(channel !== null) return;
    // console.log('this is what setChannel is', setChannel);
    setChannel(channels[0].uid);
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
    send('client:get', { clientId });
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
      background: '#21222c',
    }}>
      <br></br>
      {channels.map(c => (
        <Channel
          key={c.uid}
          uid={c.uid}
          unread={unreads[c.uid] ?? 0}
          name={c.name}
        ></Channel>
      ))}
      {/* <input
        ref={textbox}
        style={{
          background: '#343746',
          border: 'none',
          padding: '8px',
          borderRadius: '8px',
          outline: 'none',
          color: 'white',
          fontSize: '16px',
          width: '90px',
        }}
      /><button onClick={add} style={{
        marginLeft: '8px',
        background: '#bd93f9',
        border: 'none',
        color: 'white',
        padding: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '8px',
        // lineHeight: '20px'
      }}>ADD</button>
      <NameTextbox></NameTextbox><br></br>
      <Logout></Logout><br></br> */}
      {/* <LoginQR></LoginQR> */}
      {/* <Totp></Totp> */}
    </div>
  );
}