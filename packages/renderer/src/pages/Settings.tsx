import { useCallback, useContext, useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import TwoPanel from "../components/TwoPanel";
import { SettingsContext } from "../contexts/EphemeralState/EphemeralState";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { useApi } from "../lib/useApi";
import useSessionToken from "../hooks/useSessionToken";
import { BigButton } from "./BigButton";

const pages = [
  ['General', MdManageAccounts],
  ['Appearance', MdManageAccounts],
  ['Voice & Video', MdManageAccounts],
  ['Notifications', MdManageAccounts],
];

export default function Settings() {

  const [page, setPage] = useState(0);
  const { closeSettings } = useContext(SettingsContext);
  const { setSessionToken } = useSessionToken()

  const { send } = useApi();

  const logout = useCallback(() => {
    send('session:invalidate');
    setSessionToken(null);
  }, [send])

  return <>
    <div style={{
      position: 'absolute',
      top: '32px',
      right: '32px',
      zIndex: '1',
      display: 'flex',
      cursor: 'pointer',
      borderRadius: '50%',
    }} onClick={closeSettings}>
      <AiOutlineCloseCircle
        size={32}
      ></AiOutlineCloseCircle>
    </div>
    <TwoPanel
      threshold={800}
      sidebar={300}
    >
      <div style={{
        background: 'var(--neutral-3)',
        height: '100%',
        marginLeft: '40%',
        marginRight: '8px',
      }}>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        {pages.map((v, i) => (
          <BigButton
            key={i}
            icon={pages[i][1]}
            text={pages[i][0]}
            selected={i === page}
            onClick={() => setPage(i)}
          ></BigButton>
        ))}
        <br></br>
        <BigButton
          icon={BiLogOut}
          text="Logout"
          selected={false}
          color="var(--red)"
          onClick={logout}
        ></BigButton>
      </div>
      <div style={{
        background: 'var(--neutral-4)',
        height: '100%',
        paddingLeft: '32px'
      }}>
        <br></br>
        <br></br>
        {/* <br></br> */}
        <div style={{
          fontWeight: 700,
          fontSize: '12px',
        }}>
          {pages[page][0].toString().toUpperCase()}
        </div>
        <br></br>
        {(() => {
          switch(page) {
            case 0: return <GeneralSettings></GeneralSettings>
            default: return <GeneralSettings></GeneralSettings>
          }
        })()}
      </div>
    </TwoPanel>
  </>
}

function GeneralSettings() {
  return (
    <div>THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE THIS IS A PAGE </div>
  )
}

