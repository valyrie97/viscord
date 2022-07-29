
import { useCallback, useMemo, useState } from 'react';
import {
  setHomeServer,
  getHomeServer
} from '/@/lib/native';

export default function useHomeServer() {
  const [cachedHomeServer, setCachedHomeServer] =
    useState<string | null>(getHomeServer());

  const setHomeServerCallback = useCallback((url: string | null) => {
    setHomeServer(url);
    setCachedHomeServer(getHomeServer());
  }, [cachedHomeServer]);

  return useMemo(() => {
    return {
      homeServer: cachedHomeServer,
      setHomeServer: setHomeServerCallback
    };
  }, [cachedHomeServer, setHomeServerCallback])
}