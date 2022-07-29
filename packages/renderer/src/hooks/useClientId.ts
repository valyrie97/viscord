import { useContext } from "react";
import { ClientIdContext } from "../contexts/PersistentState/PersistentState";


export default function useClientId() {
  return useContext(ClientIdContext);
}