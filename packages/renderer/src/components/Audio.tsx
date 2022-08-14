import { useEffect, useState } from "react";

export function Audio(props: React.AudioHTMLAttributes<HTMLAudioElement> & {
  srcObject?: MediaStream;
}) {

  const [ref, setRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (ref === null)
      return;
    if (props.srcObject === undefined || props.srcObject === null)
      return;
    ref.srcObject = props.srcObject;
  }, [props.srcObject, ref]);

  const filteredProps = Object.fromEntries(Object.entries(props).filter(([key, value]) => key !== 'srcObject'));

  return <audio ref={setRef} {...filteredProps}>{props.children}</audio>;
}
