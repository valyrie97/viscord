import { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import Channels from './Channels';
import Chat from './Chat';
import {
  getClientId,
  setClientId,
  getHomeServer,
  setHomeServer
} from '../lib/native';
import { useApi } from '../lib/useApi';
import Sidebar from '../components/Sidebar';
import NewAccount from './NewAccount';

export const ChannelContext = createContext<{
  channel: string | null,
  setChannel: (uid: string) => void
}>({
  channel: null,
  setChannel: () => {},
});
export const ClientIdContext = createContext<{
  clientId: string | null,
  setClientId: (id: string | null) => void
}>({
  clientId: null,
  setClientId: () => {}
});
export const HomeServerContext = createContext<{
  homeServer: string | null,
  setHomeServer: (uid: string | null) => void
}>({
  homeServer: null,
  setHomeServer: () => {}
});
export const TransparencyContext = createContext<(transparent: boolean) => void>(() => {});

export default function App() {
  const [channel, setChannel] = useState<string | null>(null);
  const [clientId, setCachedClientId] = useState(getClientId());
  const [homeServer, setCachedHomeServer] = useState<string | null>(getHomeServer());
  const channelContextValue = { channel, setChannel }

  const [transparent, setTransparent] = useState(false);

  const setHomeServerCallback = useCallback((url: string | null) => {
    console.log('SETTING HOME SERVER', url)
    setHomeServer(url);
    setCachedHomeServer(getHomeServer());
  }, [homeServer]);

  const homeServerContextValue = useMemo(() => {
    return {
      homeServer,
      setHomeServer: setHomeServerCallback
    };
  }, [homeServer, setHomeServerCallback])

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

  const clientIdContextValue = { clientId, setClientId: setCachedClientId };

  // font-size: 16px;
  // font-family: 'Lato', sans-serif;
  // font-family: 'Red Hat Text', sans-serif;
  // font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  // color: #f8f8f2;
  // background: #282a36;

  return (
    <ClientIdContext.Provider value={clientIdContextValue}>
      <ChannelContext.Provider value={channelContextValue}>
        <HomeServerContext.Provider value={homeServerContextValue}>
          <TransparencyContext.Provider value={setTransparent}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
            <link href={"https://fonts.googleapis.com/css2?family=Fira+Sans&family=Josefin+Sans&family=Lato&family=Radio+Canada&family=Readex+Pro&family=Red+Hat+Text&family=Rubik&family=Signika&family=Telex&display=swap"} rel="stylesheet" />
            <div style={{
              background: transparent ? 'rgba(0, 0, 0, 0)' : '#282a36',
              color: transparent ? 'black' : '#f8f8f2',
              fontSize: '16px',
              fontFamily: "'Red Hat Text', sans-serif",
              width: '100%',
              height: '100%'
            }}>
              {homeServer === null && (
                <NewAccount></NewAccount>
              ) || (
                <Sidebar
                  threshold={800}
                  sidebar={300}
                >
                  <Channels></Channels>
                  <Chat></Chat>
                </Sidebar>
              )}
            </div>
          </TransparencyContext.Provider>
        </HomeServerContext.Provider>
      </ChannelContext.Provider>
    </ClientIdContext.Provider>
  );
}