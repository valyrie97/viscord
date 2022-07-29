import { createContext } from "react";
import useHomeServerNative from "./useHomeServerNative";
import useClientIdNative from "./useClientIdNative";
import useSessionTokenNative from "./useSessionTokenNative";



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
  setSessionToken: (token: string | null) => void
}>({
  sessionToken: null,
  setSessionToken() {}
})


export default function PersistentState(props: any) {

  const homeServerContextValue = useHomeServerNative();
  const clientIdContextValue = useClientIdNative();
  const sessionTokenContextValue = useSessionTokenNative();

  return (
    <HomeServerContext.Provider value={homeServerContextValue}>
      <ClientIdContext.Provider value={clientIdContextValue}>
        <SessionTokenContext.Provider value={sessionTokenContextValue}>
          {props.children}
        </SessionTokenContext.Provider>
      </ClientIdContext.Provider>
    </HomeServerContext.Provider>
  )
}