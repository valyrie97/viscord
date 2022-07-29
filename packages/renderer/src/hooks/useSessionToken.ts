import { useContext } from "react";
import { SessionTokenContext } from "../contexts/PersistentState/PersistentState";

export default function useSessionToken() {
  return useContext(SessionTokenContext);
}