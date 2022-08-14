import React from "react";
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Video } from "/@/components/Video";

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
  videoElement: HTMLVideoElement | null;
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
  videoElement: null,
});

export default function UserMediaState(props: any) {

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const createBlankVideoTrack = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 30;

    return canvas.captureStream(60).getVideoTracks()[0];
  }

  const updateMediaStream = (mediaStream: MediaStream | null) => {
    setMediaStream(old => {
      if(old !== null) {
        for(const track of old.getTracks()) {
          track.stop();
        }
      }
      return mediaStream;
    });
    if(mediaStream !== null) {
      const videoElement = document.createElement('video');
      videoElement.muted = true;
      videoElement.autoplay = true;
      videoElement.srcObject = mediaStream;
      videoElement.style.height = '100%';
      setVideoElement(videoElement);
    } else {
      setVideoElement(null);
    }
  }

  // maintaining the mediaStream...
  useEffect(() => {
    (async () => {
      if(enabled) {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: cameraEnabled,
        });

        if(!cameraEnabled) {
          newStream.addTrack(createBlankVideoTrack());
        }

        if(muted) {
          newStream.getAudioTracks()[0].enabled = false;
        }
    
        updateMediaStream(newStream);
      } else {
        updateMediaStream(null);
      }
    })()
  }, [enabled, cameraEnabled]);

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
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    mute,
    unmute,
    muted,
    enableCamera: () => setCameraEnabled(true),
    disableCamera: () => setCameraEnabled(false),
    cameraEnabled,
    videoElement
  }), [enabled, mediaStream, muted]);

  return <UserMediaContext.Provider value={value}>
    {props.children}
  </UserMediaContext.Provider>
}