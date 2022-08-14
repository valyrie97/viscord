import { useEffect } from "react";

export const useLog = (v: any, prefix = '') => {
  useEffect(() => {
    console.log(prefix, v);
  }, [v]);
};
