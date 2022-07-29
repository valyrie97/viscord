import ServerConnection from "./components/ServerConnection";
import Sidebar from "./components/Sidebar";
import useHomeServer from "./contexts/PersistentState/useHomeServerNative";
import useClientId from "./hooks/useClientId";
import useSessionToken from "./hooks/useSessionToken";
import Channels from "./pages/Channels";
import Chat from "./pages/Chat";
import NewAccount from "./pages/NewAccount";

interface RouterProps {
  [name: string]: React.ReactNode;
  children?: React.ReactNode;
}

export default function Router(props: RouterProps) {

  const { clientId } = useClientId();
  const { sessionToken } = useSessionToken();
  const { homeServer } = useHomeServer();

  const configured =
    homeServer !== null &&
    clientId !== null &&
    sessionToken !== null;

  return (
    configured ? (
      <ServerConnection url={homeServer}>
        <Sidebar
          threshold={800}
          sidebar={300}
        >
          <Channels></Channels>
          <Chat></Chat>
        </Sidebar>
      </ServerConnection>
    ) : (
      <NewAccount></NewAccount>
    )
  )

}