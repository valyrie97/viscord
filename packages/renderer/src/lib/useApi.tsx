import { useContext, useEffect } from 'react';
import { ServerConnectionContext } from '../components/ServerConnection';
import { Router, router, RouterObject } from './api';

export function useApi(actions: Router | RouterObject, deps: any[]) {
  const connection = useContext(ServerConnectionContext);
  const _router = typeof actions === 'object' ? router(actions) : actions;

  useEffect(() => {
    connection.registerRouter(_router);
    return () => {
      connection.unregisterRouter(_router);
    };
  }, deps);

  return {
    send: connection.send,
  };
}
