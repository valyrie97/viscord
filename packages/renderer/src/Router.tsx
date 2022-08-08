import { useContext, useEffect } from "react";
import ServerConnection from "./components/ServerConnection";
import Sidebar from "./components/Sidebar";
import TwoPanel from "./components/TwoPanel";
import Voice from "./components/Voice";
import { SettingsContext } from "./contexts/EphemeralState/EphemeralState";
import useHomeServer from "./contexts/PersistentState/useHomeServerNative";
import useChannel from "./hooks/useChannel";
import useClientId from "./hooks/useClientId";
import useSessionToken from "./hooks/useSessionToken";
import Channels from "./pages/Channels";
import Chat from "./pages/Chat";
import NewAccount from "./pages/NewAccount";
import Settings from "./pages/Settings";

interface RouterProps {
  [name: string]: React.ReactNode;
  children?: React.ReactNode;
}

export default function Router(props: RouterProps) {

  const { clientId } = useClientId();
  const { sessionToken } = useSessionToken();
  const { homeServer } = useHomeServer();
  const { isSettingsOpen, closeSettings } = useContext(SettingsContext);
  const { voice, text } = useChannel();

  const configured =
    homeServer !== null &&
    clientId !== null &&
    sessionToken !== null;

  useEffect(() => {
    if(!configured) closeSettings();
  }, [configured])

  return (
    configured ? (
      <ServerConnection url={homeServer}>
        {isSettingsOpen ? (
          <Settings></Settings>
        ) : (
          <TwoPanel
            threshold={800}
            sidebar={300}
          >
            <Sidebar></Sidebar>
            {voice ? (
              <div style={{
                height: '100%',
                width: '100%'
              }}>
                <div style={{
                  height: '50%',
                  width: '100%'
                }}>
                  <Voice></Voice>
                </div>
                <div style={{
                  height: '50%',
                  width: '100%'
                }}>
                  <Chat></Chat>
                </div>
              </div>
            ) : (
              <Chat></Chat>
            )}
          </TwoPanel>
        )}
      </ServerConnection>
    ) : (
      <NewAccount></NewAccount>
    )
  )

}