
import { useCallback, useMemo, useState } from 'react';
import {
  getSessionToken,
  setSessionToken
} from '/@/lib/native';

export default function useSessionTokenNative() {
  const [cachedSessionToken, setCachedSessionToken] =
    useState<string | null>(getSessionToken());

  const setSessionTokenCallback = useCallback((token: string | null) => {
    setSessionToken(token);
    setCachedSessionToken(getSessionToken());
  }, [cachedSessionToken]);

  return useMemo(() => {
    return {
      sessionToken: cachedSessionToken,
      setSessionToken: setSessionTokenCallback
    };
  }, [cachedSessionToken, setSessionTokenCallback])
}