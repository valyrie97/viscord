import { createContext, PropsWithChildren, ReactNode, useEffect, useMemo } from "react";
import { connectApi } from "../lib/api";
import { usePrevious } from "./usePrevious";

interface ServerConnectionProps {
  children: ReactNode,
  url: string
}

export const ServerConnectionContext = createContext<ReturnType<typeof connectApi>>({
  async send() {
    throw new Error('attempted to send an api call with no connection context');
  },
  registerRouter() {
    throw new Error('attempted to register an api listener with no connection context');
  },
  unregisterRouter() {},
  destroy() {}
})

export default function ServerConnection(props: ServerConnectionProps) {

  const serverConnection = useMemo(() => {
    return connectApi(props.url);
  }, [props.url]);

  useEffect(() => {
    return () => {
      if(!serverConnection) return;
      serverConnection.destroy();
    }
  }, [])

  return <ServerConnectionContext.Provider value={serverConnection}>
    {props.children}
  </ServerConnectionContext.Provider>
}