import { useEffect, useState } from 'react';
import { registerRouter, router, send, unregisterRouter } from '../lib/api';

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

export default function Channels() {

  const [channels, setChannels] = useState<IChannel[]>([]);

  const { send } = useRouter({
    'channels:list'(data: any) {
      // console.log(data)
      setChannels(data);
    },
  }, [channels]);

  useEffect(() => {
    if(channels.length === 0) {
      send('channels:list');
    }
  }, [channels]);

  return (
    <>
      {channels.map(channel => (
        <div key={channel.uid}>
          <span style={{
            fontWeight: 'bold',
          }}>#</span>{channel.name}
        </div>
      ))}
    </>
  );
}