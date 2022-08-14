import React from "react";
import { useEffect, useState } from "react";

export function Video(props: React.VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject?: MediaStream;
}) {

  const [ref, setRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref === null)
      return;
    if (props.srcObject === undefined || props.srcObject === null)
      return;
    ref.srcObject = props.srcObject;
  }, [props.srcObject, ref]);

  const filteredProps = Object.fromEntries(Object.entries(props).filter(([key, value]) => key !== 'srcObject'));

  return <video ref={setRef} {...filteredProps}>{props.children}</video>;
}
