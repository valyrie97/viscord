import { createContext, useState, useMemo, useEffect } from "react";
import UserMediaState from "./UserMediaState";
import PeerState from "./PeerState";
import ClientsListState from "./ClientsListState";

export type ChannelType = 'text' | 'voice';

export const ChannelContext = createContext<{
  channel: string | null,
  text: boolean,
  voice: boolean,
  setChannel: (uid: string, type: ChannelType) => void
}>({
  channel: null,
  setChannel: () => {},
  text: false,
  voice: false,
});
export const TransparencyContext = createContext<(transparent: boolean) => void>(() => {});
export const SettingsContext = createContext<{
  openSettings: () => void,
  closeSettings: () => void,
  isSettingsOpen: boolean
}>({
  openSettings() {},
  closeSettings() {},
  isSettingsOpen: false
});

export default function EphemeralState(props: {
  onTransparencyChange: (value: boolean) => void,
  children?: React.ReactNode
}) {

  const [channel, setChannel] = useState<string | null>(null);
  const [voice, setVoice] = useState(false);
  const [text, setText] = useState(false);
  const [transparent, setTransparent] = useState(false);

  const [settings, setSettings] = useState(false);

  const channelContextValue = useMemo(() => {
    return {
      channel,
      setChannel: (uid: string, channelType: ChannelType) => {
        setChannel(uid);
        switch(channelType) {
          case 'text': {
            setVoice(false);
            setText(true);
            break;
          }
          case 'voice': {
            setVoice(true);
            setText(false);
            break;
          }
          default: {
            setVoice(false);
            setText(false);
            break;
          }
        }
      },
      voice,
      text
    };
  }, [channel, setChannel]);

  useEffect(() => {
    if('onTransparencyChange' in props) {
      props.onTransparencyChange(transparent)
    }
  }, [transparent])

  return (
    <ChannelContext.Provider value={channelContextValue}>
      <TransparencyContext.Provider value={setTransparent}>
        <SettingsContext.Provider value={{
          openSettings: () => setSettings(true),
          closeSettings: () => setSettings(false),
          isSettingsOpen: settings,
        }}>
          <UserMediaState>
            <PeerState>
              {props.children}
            </PeerState>
          </UserMediaState>
        </SettingsContext.Provider>
      </TransparencyContext.Provider>
    </ChannelContext.Provider>
  );
}