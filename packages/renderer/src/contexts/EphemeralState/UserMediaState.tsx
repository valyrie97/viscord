import { createContext, useCallback, useMemo, useState } from "react";

export const UserMediaContext = createContext<{
  enabled: boolean;
  mediaStream: MediaStream | null;
  enable: () => void;
  disable: () => void;
}>({
  enabled: false,
  mediaStream: null,
  enable: () => {},
  disable: () => {},
});

export default function UserMediaState(props: any) {

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [enabled, setEnabled] = useState(false);

  const enable = useCallback(async () => {
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    setMediaStream(newStream);
    setEnabled(true);
  }, []);

  const disable = useCallback(async () => {
    if(mediaStream === null) return;

    for(const track of mediaStream?.getTracks()) {
      track.stop();
    }

    setMediaStream(null);
    setEnabled(false);
  }, [mediaStream])

  const value = useMemo(() => ({
    enabled: false,
    mediaStream: null,
    enable,
    disable
  }), []);



  return <UserMediaContext.Provider value={value}>
    {props.children}
  </UserMediaContext.Provider>
}