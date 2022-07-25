import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { channelContext, clientIdContext } from './App';
import { useApi } from '../lib/useApi';
import type { IMessage } from './Message';
import NameTextbox from './NameTextbox';

interface IChannel {
  uid: string;
  name: string;
}

function Hashmark() {
  return <span style={{
    fontWeight: 'bold',
    marginRight: '8px',
    marginLeft: '8px',
  }}>#</span>;
}

interface IUnreads {
  [uid: string]: number
}

export default function Channels() {

  const [channels, setChannels] = useState<IChannel[]>([]);
  const [unreads, setUnreads] = useState<IUnreads>({});
  
  const {channel, setChannel} = useContext(channelContext);
  const clientId = useContext(clientIdContext);

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
    console.log('unreads', unreads);
  }, [unreads]);

  useEffect(() => {
    if(channels.length === 0) {
      send('channels:list');
    }
  }, [channels]);

  useEffect(() => {
    if(channels.length === 0) return;
    if(channel !== null) return;
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
    send('client:get', clientId);
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
        <div key={c.uid} style={{
          margin: '8px 0px',
          color: channel === c.uid ? 'cyan' : 'inherit',
          cursor: 'pointer',
        }} onClick={() => {
          setChannel(c.uid);
        }}>
          <Hashmark></Hashmark>
          {(c.uid in unreads) && (unreads[c.uid] > 0) && (
            <span style={{ paddingRight: '8px' }}>({unreads[c.uid]})</span>
          )}
          <span style={{
            fontWeight: (unreads[c.uid] ?? 0) > 0 ? 'bold' : '300',
          }}>
            {c.name}
          </span>
          <a style={{
            color: 'rgba(0, 100, 200, 1)',
            marginLeft: '8px',
            fontSize: '10px',
          }} href="#" onClick={() => {}}>Delete</a>
        </div>
      ))}
      <Hashmark></Hashmark><input
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
      <NameTextbox></NameTextbox>
    </div>
  );
}