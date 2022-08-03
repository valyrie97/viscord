import { forwardRef, useEffect, useState } from "react";
import { useCallback, useContext, useRef } from "react"
import { BiLogIn } from "react-icons/bi";
import { FaUserPlus } from 'react-icons/fa';
import ServerConnection from "../components/ServerConnection";
import useHomeServer from "../contexts/PersistentState/useHomeServerNative";
import { BigButton } from "./BigButton";
import { SignUp } from "./SignUp";
import { MdOutlineNavigateNext } from 'react-icons/md';
import useHover from "../hooks/useHover";
import { AiOutlineEdit } from "react-icons/ai";

export default function NewAccount() {

  // const [data, setData] = useState('');
  // const [scanning, setScanning] = useState(false);


  // const inputRef = useRef<HTMLInputElement>(null);
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

  // const [homeServer, setHomeServer] = useState<string | null>(null);
  // const homeServerInputRef = useRef<HTMLInputElement>(null);
  const { setHomeServer, homeServer } = useHomeServer();
  const [homeServerInput, setHomeServerInput] = useState<string>(homeServer ?? '');
  const [usernameInput, setUsernameInput] = useState('');
  const [authCodeInput, setAuthCodeInput] = useState('');
  const [returning, setReturning] = useState(true);
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [edittingHomeServer, setEdittingHomeServer] = useState(false);
  const [homeServerInputRef, homeServerHovered] = useHover<HTMLInputElement>();

  useEffect(() => {
    if(homeServer === null) {
      setEdittingHomeServer(true)
    } else {
      setEdittingHomeServer(false)
    }
  }, [homeServer]);

  const connect = useCallback((url: string) => {
    if(connecting) return;
    setHomeServer(url);
    setConnecting(true);
    
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
      setConnectionError('Connection failed')
    });
  }, [connecting]);

  // return (
  //   <div style={{
  //     display: 'grid',
  //     placeContent: 'center center',
  //     height: '100%',
  //     textAlign: 'center'
  //   }}>
  //     {returning ? (
  //       <div>
  //         <span>
  //           Login
  //         </span>
  //         &nbsp;
  //         &nbsp;
  //         &nbsp;
  //         <a href="#" onClick={() => setReturning(false)}>Sign up</a>
  //       </div>
  //     ) : (
  //       <>
  //         <div>
  //           <a href="#" onClick={() => setReturning(true)}>
  //             Login
  //           </a>
  //           &nbsp;
  //           &nbsp;
  //           &nbsp;
  //           <span>
  //             Sign up
  //           </span>
  //         </div>
  //         <br></br>
  //         <label>Home Server URL</label>
  //         <input style={{textAlign: 'center'}} ref={homeServerInputRef} defaultValue="wss://macos.valnet.xyz" disabled={connection !== null || connecting}></input>
  //         <button onClick={() => connect(homeServerInputRef.current?.value ?? '')} disabled={connection !== null || connecting}>Next</button>
  //         {connecting ? `Connecting...` : connectionError}
  //         <br></br>
  //         {connection !== null && (
  //           <ServerConnection url={homeServer ?? ''}>
  //             <SignUp>
  //             </SignUp>
  //           </ServerConnection>
  //         )}
  //         {/* Create New Account!! <br />
  //         Enter Home Server URL <br />
  //         <input defaultValue="wss://dev.valnet.xyz" ref={inputRef}></input> <br />
  //         <button onClick={go}> GO </button> <br />
  //         <br />
  //         or scan a QR! <br />
  //         <button onClick={scanQr}>SCAN</button><br></br>
  //         <pre>
  //           {data}
  //           {scanning ? 'SCANNING' : 'NOT SCANNING'}
  //         </pre> */}
  //       </>
  //     )}
  //   </div>
  // );

  

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center center',
      background: 'var(--neutral-3)',
    }}>
      <div style={{
        width: '450px',
        background: 'var(--neutral-4)',
        boxShadow: '0px 4px 20px 0px var(--neutral-1)',
        borderRadius: '8px',
        transform: 'skew(-6deg, 0deg)',
      }}>
        <div style={{
          transform: 'skew(6deg, 0deg)',
          margin: '8px',
        }}>
          <div style={{
            display: 'inline-block',
            width: '50%',
            paddingRight: '4px',
            boxSizing: 'border-box',
          }}>
            <BigButton
              icon={BiLogIn}
              text="Login"
              selected={returning}
              angle={6}
              width="100%"
              inline={true}
              onClick={() => setReturning(true)}
            ></BigButton>
          </div>
          <div style={{
            display: 'inline-block',
            width: '50%',
            paddingLeft: '4px',
            boxSizing: 'border-box',
          }}>
            <BigButton
              icon={FaUserPlus}
              text="Sign up"
              selected={!returning}
              angle={6}
              width="100%"
              inline={true}
              onClick={() => setReturning(false)}
            ></BigButton>
          </div>
        </div>
        <Label>Home Server</Label>
        <div style={{
          transform: 'skew(6deg, 0deg)',
          margin: '8px',
        }}>
          <AiOutlineEdit
            style={{
              display: homeServerHovered ? 'initial' : 'none',
              float: 'right',
              position: 'absolute',
              top: '8px',
              right: '12px',
              zIndex: '1'
            }}
            size={24}
          ></AiOutlineEdit>
          <Input
            hoverRef={homeServerInputRef}
            disabled={!edittingHomeServer}
            value={homeServerInput}
            setValue={setHomeServerInput}
            onKeyPress={(e: any) => e.code === 'Enter' && (setHomeServer(homeServerInput))}
          ></Input>
        </div>
        <Label>Username</Label>
        <div style={{
          transform: 'skew(6deg, 0deg)',
          margin: '8px',
        }}>
          <Input
            disabled={edittingHomeServer}
            value={usernameInput}
            setValue={setUsernameInput}
          ></Input>
        </div>
        <Label>Auth Code</Label>
        <div style={{
          transform: 'skew(6deg, 0deg)',
          margin: '8px',
        }}>
          <Input
            disabled={edittingHomeServer}
            value={authCodeInput}
            setValue={setAuthCodeInput}
          ></Input>
        </div>
        <div style={{
          transform: 'skew(6deg, 0deg)',
          margin: '8px',
          textAlign: 'right'
        }}>
          <BigButton
            icon={MdOutlineNavigateNext}
            text="Next"
            selected={false}
            angle={6}
            width="auto"
            inline={true}
            onClick={() => {}}
          ></BigButton>
        </div>
      </div>
    </div>
  )
}

function Label(props: any) {
  return <label style={{
    paddingLeft: '24px',
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
  }}>{props.children}</label>
}

interface InputProps {
  value: string;
  setValue: (s: string) => void;
  default?: string;
  onKeyPress?: (e: any) => void;
  disabled?: boolean;
  hoverRef?: React.LegacyRef<HTMLInputElement>
}

const Input = (props: InputProps) => {

  const _default = props.default ?? '';
  const [focused, setFocused] = useState(false);
  const disabled = props.disabled ?? false;

  return (
    <div style={{
      width: '100%',
    }}>
      <input
        ref={props.hoverRef}
        onKeyPress={props.onKeyPress ?? (() => {})}
        onFocus={(e) => !!props.disabled ? e.target.blur() : setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        style={{
          height: '40px',
          width: '100%',
          padding: '0px',
          margin: '0px',
          border: focused ? '1px solid var(--neutral-7)' : '1px solid rgba(0, 0, 0, 0)',
          transform: 'skew(-6deg, 0deg)',
          borderRadius: '8px',
          outline: 'none',
          fontSize: '20px',
          paddingLeft: '12px',
          paddingRight: '12px',
          boxSizing: 'border-box',
          background: disabled ? 'var(--neutral-3)' : focused ? 'var(--neutral-2)' : 'var(--neutral-1)',
          color: disabled ? 'var(--neutral-6)' : 'var(--neutral-8)'
        }}
        spellCheck="false"
        onChange={(e) => props.setValue(e.target.value)}
        value={props.value}
      ></input>
    </div>
  )
}