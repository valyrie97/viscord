import { createContext, useCallback, useMemo, useState } from "react";

export const UserMediaContext = createContext<{
  enabled: boolean;
  mediaStream: MediaStream | null;
  enable: () => void;
  disable: () => void;
  mute: () => void;
  unmute: () => void;
  muted: boolean;
  enableCamera: () => void;
  disableCamera: () => void;
  cameraEnabled: boolean;
}>({
  enabled: false,
  mediaStream: null,
  enable: () => {},
  disable: () => {},
  mute: () => {},
  unmute: () => {},
  muted: false,
  enableCamera: () => {},
  disableCamera: () => {},
  cameraEnabled: false,
});

export default function UserMediaState(props: any) {

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const enable = useCallback(async () => {
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
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
  }, [mediaStream]);

  const mute = () => {
    if(mediaStream === null) return;
    mediaStream.getAudioTracks()[0].enabled = false;
    setMuted(true);
  }

  const unmute = () => {
    if(mediaStream === null) return;
    mediaStream.getAudioTracks()[0].enabled = true;
    setMuted(false);
  }

  const value = useMemo(() => ({
    enabled,
    mediaStream,
    enable,
    disable,
    mute,
    unmute,
    muted
  }), [enabled, mediaStream, enable, disable, muted]);



  return <UserMediaContext.Provider value={value}>
    {props.children}
  </UserMediaContext.Provider>
}