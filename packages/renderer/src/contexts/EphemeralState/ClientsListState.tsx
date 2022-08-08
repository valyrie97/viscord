import { createContext, useEffect, useMemo, useState } from "react";
import { useApi } from "/@/lib/useApi";



export const ClientsListContext = createContext<{
  clientName: { [clientId: string]: string }
}>({
  clientName: {}
});


// export function useClientList() {
//   const 
// }

export default function ClientsListState(props: any) {
  const [clients, setClients] = useState<{
    [id: string]: string
  }>({});

  const { send } = useApi({
    'clients:list'(data: any) {
      const obj: any = {};
      for(const client of data.clients) {
        obj[client.clientId] = client.displayName;
      }
      setClients(obj);
    }
  });

  useEffect(() => {
    console.log(clients);
  }, [clients]);

  useEffect(() => {
    send('clients:list')
  }, []);

  const value = useMemo(() => ({
    clientName: clients
  }), [clients]);

  return <ClientsListContext.Provider value={value}>
    {props.children}
  </ClientsListContext.Provider>
}