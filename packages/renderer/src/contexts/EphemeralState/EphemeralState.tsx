import { createContext, useState, useMemo, useEffect } from "react";

export const ChannelContext = createContext<{
  channel: string | null,
  setChannel: (uid: string) => void
}>({
  channel: null,
  setChannel: () => {},
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
  const [transparent, setTransparent] = useState(false);

  const [settings, setSettings] = useState(false);

  const channelContextValue = useMemo(() => {
    return { channel, setChannel };
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
          {props.children}
        </SettingsContext.Provider>
      </TransparencyContext.Provider>
    </ChannelContext.Provider>
  );
}