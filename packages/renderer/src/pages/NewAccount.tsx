import { useEffect, useState } from "react";
import { useCallback, useContext, useRef } from "react"
import { ClientIdContext, HomeServerContext, TransparencyContext } from "./App"

export default function NewAccount() {

  const [data, setData] = useState('');
  const [scanning, setScanning] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { setHomeServer } = useContext(HomeServerContext);
  const { setClientId } = useContext(ClientIdContext);

  const setTransparent = useContext(TransparencyContext);

  useEffect(() => {
    setTransparent(scanning);
  }, [scanning, setTransparent]);

  const go = useCallback(() => {
    if(inputRef.current === null) return;
    setHomeServer(inputRef.current.value)
  }, [HomeServerContext]);

  const scanQr = useCallback(() => {
    //@ts-ignore
    window.QRScanner.prepare((err: any, status: any) => {
      if(!err && status.authorized) {
        setScanning(true);
        //@ts-ignore
        window.QRScanner.hide();
        //@ts-ignore
        window.QRScanner.scan((err, text) => {
          if (err) return alert(err);
          // alert(text);
          setData(text);
          setScanning(false);
          //@ts-ignore
          window.QRScanner.show();
        });
      }
    });
  }, [data]);

  useEffect(() => {
    // this avoids a timing issue whereby the component
    // gets removed before it has a chance to clean up
    // its setting of transparency...
    if(scanning) return;
    if(!data) return;
    const [action, homeServer, clientId] = data.split('|');
    switch(action) {
      case 'loginv1': {
        setHomeServer(homeServer);
        setClientId(clientId);
        break;
      }
    }
  }, [data, scanning])

  return <div style={{
    display: 'grid',
    placeContent: 'center center',
    height: '100%',
  }}>
    Create New Account!! <br />
    Enter Home Server URL <br />
    <input defaultValue="wss://dev.valnet.xyz" ref={inputRef}></input> <br />
    <button onClick={go}> GO </button> <br />
    <br />
    or scan a QR! <br />
    <button onClick={scanQr}>SCAN</button><br></br>
    <pre>
      {data}
      {scanning ? 'SCANNING' : 'NOT SCANNING'}
    </pre>
  </div>
}