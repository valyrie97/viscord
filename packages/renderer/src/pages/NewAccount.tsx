import { forwardRef, useEffect, useState } from "react";
import { useCallback, useContext, useRef } from "react"
import { BiLogIn } from "react-icons/bi";
import { FaUserPlus } from 'react-icons/fa';
import ServerConnection from "../components/ServerConnection";
import useHomeServer from "../contexts/PersistentState/useHomeServerNative";
import { BigButton } from "./BigButton";
import { MdOutlineNavigateNext } from 'react-icons/md';
import useHover from "../hooks/useHover";
import { AiOutlineEdit } from "react-icons/ai";
import { useApi } from "../lib/useApi";
import useSessionToken from "../hooks/useSessionToken";
import useClientId from "../hooks/useClientId";

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
  const [returning, setReturning] = useState(true);
  // const [connection, setConnection] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState('');
  const [edittingHomeServer, setEdittingHomeServer] = useState(false);
  const [homeServerInputRef, homeServerHovered] = useHover<HTMLInputElement>();
  const [homeServerEditButtonHoverRef, homeServerEditButtonHovered] = useHover<HTMLDivElement>();

  useEffect(() => {
    if(homeServer === null) {
      setEdittingHomeServer(true)
    } else {
      setEdittingHomeServer(false)
    }
  }, [homeServer]);

  const [connecting, setConnecting] = useState(false);
  const [connectionSucceeded, setConnectionSucceeded] = useState(false);

  const connect = useCallback(() => {
    if(connecting) return;
    const url = homeServerInput;
    setConnecting(true);
    try {
      const ws = new WebSocket(url);
  
      ws.addEventListener('open', () => {
        setConnecting(false);
        setConnectionSucceeded(true);
        setHomeServer(homeServerInput);
        setEdittingHomeServer(false);
      });
  
      ws.addEventListener('error', (e) => {
        setConnecting(false);
        setConnectionSucceeded(false);
        setConnectionError('Connection failed')
      });
    } catch (e) {
      setConnecting(false)
      setConnectionSucceeded(false);
      setConnectionError('Connection failed in catch');
    }
  }, [connecting, homeServerInput]);

  const next = useCallback(() => {
    // debugger;
    if(edittingHomeServer) {
      connect()
    } else {
      console.log('do login');
    }
  }, [homeServer, homeServerInput, edittingHomeServer, connect])

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
        width: 'calc(100% - 40px)',
        maxWidth: '450px',
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
          <div
            ref={homeServerEditButtonHoverRef}
            style={{
              display: (homeServerHovered || homeServerEditButtonHovered) ? 'initial' : 'none',
              position: 'absolute',
              top: '8px',
              right: '12px',
              zIndex: '1',
              cursor: 'pointer',
            }}
            onClick={() => setEdittingHomeServer(true)}
          >
            <AiOutlineEdit
              size={24}
            ></AiOutlineEdit>
          </div>
          <Input
            focusOnEenable={true}
            hoverRef={homeServerInputRef}
            disabled={!edittingHomeServer}
            value={homeServerInput}
            setValue={setHomeServerInput}
            onClick={(e) => {
              setEdittingHomeServer(true);
            }}
            onKeyPress={(e: any) => e.code === 'Enter' && next()}
          ></Input>
          <div style={{
            paddingLeft: '16px'
          }}>
            {(connecting) ? (
              <div style={{ color: 'var(--neutral-7)'}}>
                Connecting...
              </div>
            ) : (
              (!connectionSucceeded) && (
                <div style={{ color: 'var(--red)'}}>
                  {connectionError}
                </div>
              )
            )}
          </div>
        </div>
        <ServerConnection url={homeServer ?? ''}>
          {(returning) ? (
            <Login disabled={edittingHomeServer}></Login>
          ) : (
            <SignUp disabled={edittingHomeServer}></SignUp>
          )}
        </ServerConnection>
        {edittingHomeServer && <Next onClick={next}></Next>}
      </div>
    </div>
  )
}

function Next(props: {
  onClick?: (e: any) => void
}) {
  return (
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
        onClick={props.onClick}
      ></BigButton>
    </div>
  )
}

interface LoginProps {
  disabled?: boolean
}

function Login(props: LoginProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [authCodeInput, setAuthCodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { setSessionToken } = useSessionToken();
  const { setClientId } = useClientId();

  const { send } = useApi({
    'session:login'({ err, sessionToken, clientId }) {
      if(err) {
        setSuccess(null);
        setError(err);
        return;
      }
      setError(null);
      setSuccess('Success!');
      setTimeout(() => {
        setClientId(clientId);
        setSessionToken(sessionToken);
      }, 1000)
    }
  })

  const next = () => {
    send('session:login', {
      username: usernameInput,
      totp: authCodeInput
    })
  }

  return (
    <>
      <Label>Username</Label>
      <div style={{
        transform: 'skew(6deg, 0deg)',
        margin: '8px',
      }}>
        <Input
          disabled={props.disabled}
          value={usernameInput}
          setValue={setUsernameInput}
          focusOnEenable={true}
        ></Input>
      </div>
      <Label>Auth Code</Label>
      <div style={{
        transform: 'skew(6deg, 0deg)',
        margin: '8px',
      }}>
        <Input
          disabled={props.disabled}
          value={authCodeInput}
          setValue={setAuthCodeInput}
        ></Input>
      </div>
      {error && <div style={{ color: 'var(--red)', textAlign: 'center' }}>
        {error}
      </div>}
      {success && <div style={{ color: 'var(--green)', textAlign: 'center' }}>
        {success}
      </div>}
      {!props.disabled && <Next onClick={next}></Next>}
    </>
  )
}

interface SignUpProps {
  disabled?: boolean
}

function SignUp(props: SignUpProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [authCodeInput, setAuthCodeInput] = useState('');

  const next = () => {

  }

  return (
    <>
      <Label>Username</Label>
      <div style={{
        transform: 'skew(6deg, 0deg)',
        margin: '8px',
      }}>
        <Input
          disabled={props.disabled}
          value={usernameInput}
          setValue={setUsernameInput}
          focusOnEenable={true}
        ></Input>
      </div>
      <Label>Auth Code</Label>
      <div style={{
        transform: 'skew(6deg, 0deg)',
        margin: '8px',
      }}>
        <Input
          disabled={props.disabled}
          value={authCodeInput}
          setValue={setAuthCodeInput}
        ></Input>
      </div>
      {!props.disabled && <Next onClick={next}></Next>}
    </>
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
  hoverRef?: React.LegacyRef<HTMLInputElement>;
  onClick?: (e: any) => void;
  focusOnEenable?: boolean
}

const Input = (props: InputProps) => {

  const _default = props.default ?? '';
  const [focused, setFocused] = useState(false);
  const disabled = props.disabled ?? false;
  const inputRef = useRef<HTMLInputElement>(null);
  const focusOnEenable = props.focusOnEenable ?? false;

  useEffect(() => {
    if(!focusOnEenable) return;
    if(!disabled) {
      setFocused(true);
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(inputRef.current?.value.length, inputRef.current?.value.length)
    }
  }, [disabled, focusOnEenable, inputRef]);

  useEffect(() => {
    if(disabled) setFocused(false);
  }, [disabled])

  return (
    <div 
      ref={props.hoverRef}
      style={{
        width: '100%',
      }}
      onClick={(e: any) => {
        if(props.onClick !== undefined) {
          props.onClick(e);
          inputRef.current?.focus();
        }
      }}
    >
      <input
        ref={inputRef}
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