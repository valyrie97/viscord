import { useEffect } from "react";
import { createPortal } from "react-dom";

const Portal = ({children}: {children: React.ReactNode}) => {
  const mount = document.getElementById("portal-root");
  const el = document.createElement("div");

  useEffect(() => {
    if(mount === null) return;
    mount.appendChild(el);
    return () => {
      mount.removeChild(el);
    }
  }, [el, mount]);

  return createPortal(children, el)
};

export default Portal;