import { createContext, useState } from 'react';
import Channels from './Channels';
import Chat from './Chat';


export const channelContext = createContext<{
  channel: string | null,
  setChannel: (uid: string) => void
}>({
  channel: null,
  setChannel: () => {},
});

export default function App() {
  const [channel, setChannel] = useState<string | null>(null);

  const channelContextValue = { channel, setChannel };

  return (
    <channelContext.Provider value={channelContextValue}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gridTemplateRows: '1fr',
        height: '100%',
      }}>
        <div style={{
          background: 'rgba(25, 26, 33)',
          borderRight: '1px solid #bd93f9',
        }}>
          <Channels></Channels>
        </div>
        <div>
          <Chat></Chat>
        </div>
      </div>
    </channelContext.Provider>
  );
}