import { useEffect, useState } from "react";
import { useCallback, useRef } from "react";
import { useApi } from "../lib/useApi";
import QR from 'qrcode';
import useSessionToken from "../hooks/useSessionToken";

export const SignUp = (props: any) => {

  const usernameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const totpRef = useRef<HTMLInputElement>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  // const [totpToken, setTotpToken] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const { setSessionToken } = useSessionToken();

  const { send } = useApi({
    'client:new'(data: any) {
      setClientId(data);
    },
    async 'totp:propose'(data: any) {
      setQr(await QR.toDataURL(
        'otpauth://totp/' +
        (usernameRef.current?.value ?? '') +
        '?secret=' +
        data +
        '&issuer=valnet-corner'
      ));
    },
    'totp:confirm'(data: any) {
      setSessionToken(data.token);
      console.log(data);
    }
  }, [setSessionToken]);

  const createAccount = useCallback(() => {
    send('client:new', {
      username: usernameRef.current?.value,
      displayName: displayNameRef.current?.value,
    });
  }, []);

  useEffect(() => {
    if (clientId === null)
      return;
    send('totp:propose', clientId);
  }, [clientId]);

  const changeTotp = useCallback(() => {
    const value = totpRef.current?.value ?? '';
    if (!(/[0-9]{6}/.test(value)))
      return;
    send('totp:confirm', {
      clientId,
      code: value
    });
  }, [clientId]);

  return (
    <>
      <label>Username</label>
      <input defaultValue={'Test' + Math.floor(Math.random() * 1000)} disabled={clientId !== null} ref={usernameRef}></input>
      <label>Display Name</label>
      <input defaultValue="Val" disabled={clientId !== null} ref={displayNameRef}></input>
      <button disabled={clientId !== null} onClick={createAccount}>Next</button>
      {clientId && (
        <>
          <br></br>
          <img src={qr ?? ''}></img>
          <br></br>
          <label>TOTP Code</label>
          <input onChange={changeTotp} ref={totpRef}></input>
        </>
      )}
    </>
  );
};
