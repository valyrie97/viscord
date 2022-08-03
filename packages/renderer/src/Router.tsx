import { useContext } from "react";
import ServerConnection from "./components/ServerConnection";
import Sidebar from "./components/Sidebar";
import TwoPanel from "./components/TwoPanel";
import { SettingsContext } from "./contexts/EphemeralState/EphemeralState";
import useHomeServer from "./contexts/PersistentState/useHomeServerNative";
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
  const { isSettingsOpen } = useContext(SettingsContext);

  const configured =
    homeServer !== null &&
    clientId !== null &&
    sessionToken !== null;

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
            <Chat></Chat>
          </TwoPanel>
        )}
      </ServerConnection>
    ) : (
      <NewAccount></NewAccount>
    )
  )

}