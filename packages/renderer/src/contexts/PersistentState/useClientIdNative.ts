
import { useCallback, useMemo, useState } from 'react';
import {
  getClientId,
  setClientId
} from '/@/lib/native';

export default function useClientIdNative() {
  const [cachedClientId, setCachedClientId] =
    useState<string | null>(getClientId());
  
  const setClientIdCallback = useCallback((id: string | null) => {
    setClientId(id);
    setCachedClientId(getClientId());
  }, [cachedClientId]);

  return useMemo(() => {
    return {
      clientId: cachedClientId,
      setClientId: setClientIdCallback
    };
  }, [cachedClientId, setClientIdCallback]);

}