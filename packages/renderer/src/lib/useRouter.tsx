import { useEffect } from 'react';
import { registerRouter, router, send, unregisterRouter } from './api';

export function useAPI(actions: Function | object, deps: any[]) {
  const _router = typeof actions === 'object' ? router(actions) : actions;
  useEffect(() => {
    registerRouter(_router);
    return () => {
      unregisterRouter(_router);
    };
  }, deps);

  return {
    send: send,
  };
}
