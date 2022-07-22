import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { registerRouter, router, send, unregisterRouter } from '../lib/api';
import { channelContext } from './App';

function useRouter(actions: Function | object, deps: any[]) {
  const _router = typeof actions === 'object' ? router(actions) : actions;
  useEffect(() => {
    registerRouter(_router);
    return () => {
      unregisterRouter(_router);
    };
  }, deps);

  return {
    send: send,
  };
}

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

export default function Channels() {

  const [channels, setChannels] = useState<IChannel[]>([]);
  const {channel, setChannel} = useContext(channelContext);

  const { send } = useRouter({
    'channels:list'(data: IChannel[]) {
      // console.log(data)
      setChannels(data);
    },
    'channel:add'(channel: IChannel) {
      setChannels([...channels, channel]);
    },
  }, [channels]);

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

  const textbox = useRef<HTMLInputElement>(null);
  const add = useCallback(() => {
    if(textbox.current === null) return;
    const name = textbox.current.value;
    textbox.current.value = '';
    send('channel:add', { name });
  }, []);

  return (
    <>
      <br></br>
      {channels.map(c => (
        <div key={c.uid} style={{
          margin: '8px 0px',
          color: channel === c.uid ? 'cyan' : 'inherit',
          cursor: 'pointer',
        }} onClick={() => {
          setChannel(c.uid);
        }}>
          <Hashmark></Hashmark>{c.name}
          <a style={{ color: 'rgba(0, 100, 200, 1)', marginLeft: '8px', fontSize: '10px' }} href="#" onClick={() => {}}>Delete</a>
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
    </>
  );
}