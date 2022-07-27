import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { useApi } from '../lib/useApi';
import { ClientIdContext } from '../pages/App';
import QR from 'qrcode';

function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<any>();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export default function Totp () {

  const [open, setOpen] = useState(false);
  const previousOpen = usePrevious(open);
  const { clientId } = useContext(ClientIdContext);
  const [qr, setQr] = useState<string | null>(null);
  const [key, setKey] = useState<string>('');

  const { send } = useApi({
    'totp:propose'(key: string) {
      setKey(key);
    }
  }, []);

  const onOpen = useCallback(() => {
    send('totp:propose', clientId);
  }, [send, clientId]);

  useEffect(() => {
    if(open && !previousOpen) {
      onOpen();
    }
  }, [open, onOpen]);

  useEffect(() => {
    if(key === null) return;
    if(clientId === null) return;
    (async () => {
      setQr(await QR.toDataURL(
        'otpauth://totp/Valerie?secret=' +
        key +
        '&issuer=corner'
      ));
    })()
  }, [key, clientId])

  const inputRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(() => {
    if(inputRef.current === null) return;
    send('totp:confirm', {
      clientId,
      code: inputRef.current.value
    })
  }, [])

  return <div>
    <button onClick={() => setOpen(!open)}>TOTP</button>
    {open && (
      <div>
        <img src={qr ?? undefined} />
        <input ref={inputRef}></input>
        <button onClick={submit}>CHECK</button>
      </div>
    )}
  </div>
}