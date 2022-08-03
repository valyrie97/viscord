import { useContext, useEffect } from 'react';
import { ServerConnectionContext } from '../components/ServerConnection';
import useSessionToken from '../hooks/useSessionToken';
import { Router, router, RouterObject } from './api';

export function useApi(actions: Router | RouterObject = {}, deps: any[] = []) {
  const connection = useContext(ServerConnectionContext);
  const _router = typeof actions === 'object' ? router(actions) : actions;
  const { sessionToken } = useSessionToken();

  useEffect(() => {
    connection.registerRouter(_router);
    return () => {
      connection.unregisterRouter(_router);
    };
  }, deps);

  return {
    send(action: string, data: Object = {}) {
      if('sessionToken' in data) {
        console.warn('sessionToken already present in action. this is deprecated.')
        console.trace();
      }
      connection.send(action, {
        ...(data ?? {}),
        sessionToken
      });
    }
  };
}
