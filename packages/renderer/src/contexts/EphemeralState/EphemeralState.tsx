import { createContext, useState, useMemo, useEffect } from "react";

export const ChannelContext = createContext<{
  channel: string | null,
  setChannel: (uid: string) => void
}>({
  channel: null,
  setChannel: () => {},
});
export const TransparencyContext = createContext<(transparent: boolean) => void>(() => {});


export default function EphemeralState(props: {
  onTransparencyChange: (value: boolean) => void,
  children?: React.ReactNode
}) {

  const [channel, setChannel] = useState<string | null>(null);
  const [transparent, setTransparent] = useState(false);

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
        {props.children}
      </TransparencyContext.Provider>
    </ChannelContext.Provider>
  );
}