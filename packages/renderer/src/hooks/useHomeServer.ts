import { useContext } from "react";
import { HomeServerContext } from "../contexts/PersistentState/PersistentState";

export default function useHomeServer() {
  return useContext(HomeServerContext);
}