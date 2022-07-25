import { createContext, useEffect, useState } from 'react';
import Channels from './Channels';
import Chat from './Chat';
import { getClientId, setClientId } from '../lib/native';
import { useApi } from '../lib/useApi';
import Sidebar from '../components/Sidebar';

export const channelContext = createContext<{
  channel: string | null,
  setChannel: (uid: string) => void
}>({
  channel: null,
  setChannel: () => {},
});

export const clientIdContext = createContext<string | null>(null);

export default function App() {
  const [channel, setChannel] = useState<string | null>(null);
  const [clientId, setCachedClientId] = useState(getClientId());
  const channelContextValue = { channel, setChannel };
  
  // persist given clientId to disk
  useEffect(() => {
    if(clientId === null) return;
    setClientId(clientId);
  }, [clientId]);

  const { send } = useApi({
    'client:new'(data: string) {
      setCachedClientId(data);
    },
  }, [setCachedClientId]);

  useEffect(() => {
    if(clientId !== null) return;
    send('client:new');
  }, [clientId]);

  return (
    <clientIdContext.Provider value={clientId}>
      <channelContext.Provider value={channelContextValue}>
        <Sidebar
          threshold={800}
          sidebar={300}
        >
          <Channels></Channels>
          <Chat></Chat>
        </Sidebar>
        {/* <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gridTemplateRows: '1fr',
          height: '100%',
        }}>
          <div style={{
            background: '#21222c',
            borderRight: '1px solid #bd93f9',
          }}>
          </div>
          <div>
          </div>
        </div> */}
      </channelContext.Provider>
    </clientIdContext.Provider>
  );
}