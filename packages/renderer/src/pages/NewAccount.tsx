import { useEffect, useState } from "react";
import { useCallback, useContext, useRef } from "react"
import ServerConnection from "../components/ServerConnection";
import { useApi } from "../lib/useApi";
import { ClientIdContext, HomeServerContext, SessionTokenContext, TransparencyContext } from "./App"
import QR from 'qrcode';

export default function NewAccount() {

  // const [data, setData] = useState('');
  // const [scanning, setScanning] = useState(false);


  // const inputRef = useRef<HTMLInputElement>(null);
  // const { setHomeServer } = useContext(HomeServerContext);
  // const { setClientId } = useContext(ClientIdContext);

  // const setTransparent = useContext(TransparencyContext);

  // useEffect(() => {
  //   setTransparent(scanning);
  // }, [scanning, setTransparent]);

  // const go = useCallback(() => {
  //   if(inputRef.current === null) return;
  //   setHomeServer(inputRef.current.value)
  // }, [HomeServerContext]);

  // const scanQr = useCallback(() => {
  //   //@ts-ignore
  //   window.QRScanner.prepare((err: any, status: any) => {
  //     if(!err && status.authorized) {
  //       setScanning(true);
  //       //@ts-ignore
  //       window.QRScanner.hide();
  //       //@ts-ignore
  //       window.QRScanner.scan((err, text) => {
  //         if (err) return alert(err);
  //         // alert(text);
  //         setData(text);
  //         setScanning(false);
  //         //@ts-ignore
  //         window.QRScanner.show();
  //       });
  //     }
  //   });
  // }, [data]);

  // useEffect(() => {
  //   // this avoids a timing issue whereby the component
  //   // gets removed before it has a chance to clean up
  //   // its setting of transparency...
  //   if(scanning) return;
  //   if(!data) return;
  //   const [action, homeServer, clientId] = data.split('|');
  //   switch(action) {
  //     case 'loginv1': {
  //       setHomeServer(homeServer);
  //       setClientId(clientId);
  //       break;
  //     }
  //   }
  // }, [data, scanning])

  const [returning, setReturning] = useState(true);
  const homeServerInputRef = useRef<HTMLInputElement>(null);
  const [homeServer, setHomeServer] = useState<string | null>(null);
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  const connect = useCallback((url: string) => {
    if(connecting) return;
    setHomeServer(url);
    setConnecting(true);
    try {
      const ws = new WebSocket(url);
  
      ws.addEventListener('open', () => {
        setConnecting(false);
        setConnection(ws);
        setConnectionError('');
      });
  
      ws.addEventListener('close', (e) => {
        setConnecting(false);
        setConnection(null);
        console.log(e)
      });

      ws.addEventListener('error', (e) => {
        setConnectionError('Couldn\'t connect to ' + url)
      });
    } catch(e: any) {
      console.log('ASDFASDFASDF');
    }
  }, [connecting])

  return (
    <div style={{
      display: 'grid',
      placeContent: 'center center',
      height: '100%',
    }}>
      {returning ? (
        <>
          Login
          <a href="#" onClick={() => setReturning(false)}>Sign up</a>
        </>
      ) : (
        <>
          <input ref={homeServerInputRef} defaultValue="wss://macos.valnet.xyz" disabled={connection !== null}></input>
          <button onClick={() => connect(homeServerInputRef.current?.value ?? '')} disabled={connection !== null}>Next</button>
          {connecting ? `Connecting to ${homeServer}` : connectionError}
          <br></br>
          {connection !== null && (
            <ServerConnection url={homeServer ?? ''}>
              <SignUp>
              </SignUp>
            </ServerConnection>
          )}
          {/* Create New Account!! <br />
          Enter Home Server URL <br />
          <input defaultValue="wss://dev.valnet.xyz" ref={inputRef}></input> <br />
          <button onClick={go}> GO </button> <br />
          <br />
          or scan a QR! <br />
          <button onClick={scanQr}>SCAN</button><br></br>
          <pre>
            {data}
            {scanning ? 'SCANNING' : 'NOT SCANNING'}
          </pre> */}
        </>
      )}
    </div>
  );
}

const SignUp = (props: any) => {

  const usernameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const totpRef = useRef<HTMLInputElement>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  // const [totpToken, setTotpToken] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const { setSessionToken } = useContext(SessionTokenContext)

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
    })
  }, []);

  useEffect(() => {
    if(clientId === null) return;
    send('totp:propose', clientId);
  }, [clientId]);

  const changeTotp = useCallback(() => {
    const value = totpRef.current?.value ?? '';
    if(!(/[0-9]{6}/.test(value))) return;
    send('totp:confirm', {
      clientId,
      code: value
    })
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
  )
}