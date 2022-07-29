import { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import Channels from './Channels';
import Chat from './Chat';
import {
  getClientId,
  setClientId,
  getHomeServer,
  setHomeServer,
  getSessionToken,
  setSessionToken
} from '../lib/native';
import { useApi } from '../lib/useApi';
import Sidebar from '../components/Sidebar';
import NewAccount from './NewAccount';
import ServerConnection from '../components/ServerConnection';

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
export const SessionTokenContext = createContext<{
  sessionToken: string | null,
  setSessionToken: (token: string) => void
}>({
  sessionToken: null,
  setSessionToken() {}
})
export const TransparencyContext = createContext<(transparent: boolean) => void>(() => {});

export default function App() {
  const [channel, setChannel] = useState<string | null>(null);
  const [clientId, setCachedClientId] = useState(getClientId());
  const [homeServer, setCachedHomeServer] = useState<string | null>(getHomeServer());
  const channelContextValue = { channel, setChannel }
  const [cachedSessionToken, setCachedSessionToken] = useState<string | null>(null);
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

  const updateCachedSessionToken = useCallback((token?: string) => {
    setSessionToken(token ?? '');
    setCachedSessionToken(getSessionToken());
  }, []);

  const SessionTokenContextValue = useMemo(() => {
    return {
      sessionToken: cachedSessionToken,
      setSessionToken: updateCachedSessionToken
    }
  }, [cachedSessionToken, updateCachedSessionToken])

  // const { send } = useApi({
  //   'client:new'(data: string) {
  //     setCachedClientId(data);
  //   },
  // }, [setCachedClientId]);

  // useEffect(() => {
  //   if(clientId !== null) return;
  //   send('client:new');
  // }, [clientId]);

  const clientIdContextValue = { clientId, setClientId: setCachedClientId };

  // font-size: 16px;
  // font-family: 'Lato', sans-serif;
  // font-family: 'Red Hat Text', sans-serif;
  // font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  // color: #f8f8f2;
  // background: #282a36;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
      <link href={"https://fonts.googleapis.com/css2?family=Fira+Sans&family=Josefin+Sans&family=Lato&family=Radio+Canada&family=Readex+Pro&family=Red+Hat+Text&family=Rubik&family=Signika&family=Telex&display=swap"} rel="stylesheet" />
      <style>{`
        html {
          --background: #282a36;
          --current-line: #44475a;
          --foreground: #f8f8f2;
          --comment: #6272a4;
          --cyan: #8be9fd;
          --green: #50fa7b;
          --orange: #ffb86c;
          --pink: #ff79c6;
          --purple: #bd93f9;
          --red: #ff5555;
          --yellow: #f1fa8c;
          --primary: var(--purple);
        }
        a {
          color: var(--cyan);
        }
      `}</style>
      <ClientIdContext.Provider value={clientIdContextValue}>
        <ChannelContext.Provider value={channelContextValue}>
          <HomeServerContext.Provider value={homeServerContextValue}>
            <TransparencyContext.Provider value={setTransparent}>
              <SessionTokenContext.Provider value={SessionTokenContextValue}>
                <div style={{
                  background: transparent ? 'rgba(0, 0, 0, 0)' : 'var(--background)',
                  color: transparent ? 'black' : 'var(--foreground)',
                  fontSize: '16px',
                  fontFamily: "'Red Hat Text', sans-serif",
                  width: '100%',
                  height: '100%'
                }}>
                  {(cachedSessionToken === null || homeServer === null) ? (
                    <NewAccount></NewAccount>
                  ) : (
                    <ServerConnection url={homeServer}>
                      <Sidebar
                        threshold={800}
                        sidebar={300}
                      >
                        <Channels></Channels>
                        <Chat></Chat>
                      </Sidebar>
                    </ServerConnection>
                  )}
                </div>
              </SessionTokenContext.Provider>
            </TransparencyContext.Provider>
          </HomeServerContext.Provider>
        </ChannelContext.Provider>
      </ClientIdContext.Provider>
    </>
  );
}