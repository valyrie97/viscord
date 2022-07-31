import { useEffect, useState } from "react";



export default function useHover<T extends HTMLElement>(): [
  (t: T) => void,
  boolean
] {
  const [value, setValue] = useState(false);
  const [ref, setRef] = useState<T | null>(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  
  useEffect(
    () => {
      const node = ref;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref] // Recall only if ref changes
  );
  return [setRef, value];
}