import { useContext } from "react";
import { ChannelContext } from "../contexts/EphemeralState/EphemeralState";

export default function useChannel() {
  return useContext(ChannelContext);
}