import useHomeServer from "../hooks/useHomeServer";
import Channels from "../pages/Channels";
import pfp from '../../assets/pfp.jpg';
import { IoMdSettings } from 'react-icons/io';
import useHover from "../hooks/useHover";
import { useContext } from "react";
import { SettingsContext } from "../contexts/EphemeralState/EphemeralState";
import { ClientsListContext } from "../contexts/EphemeralState/ClientsListState";
import useClientId from "../hooks/useClientId";

export default function Sidebar() {



  return (
    <div style={{
      height: '100%',
      display: 'grid',
      gridTemplateRows: 'min-content 1fr min-content'
    }}>
      <TopSidebar></TopSidebar>
      <Channels></Channels>
      <MiniProfile></MiniProfile>
    </div>
  )
}

function TopSidebar() {

  const { homeServer } = useHomeServer();

  return (
    <div style={{
      lineHeight: '48px',
      paddingLeft: '16px',
      fontSize: '16px',
      background: 'var(--neutral-3)',
      boxShadow: 'black 0px 0px 3px 0px',
      zIndex: '100',
      fontWeight: '500',
    }}>
      {homeServer && new URL(homeServer).hostname.toLocaleLowerCase()}
    </div>
  )
}

function MiniProfile() {

  const { clientName } = useContext(ClientsListContext);
  const { clientId } = useClientId();

  return (
    <div style={{
      fontSize: '16px',
      background: 'var(--neutral-2)',
      // boxShadow: 'black 0px 0px 3px 0px',
      zIndex: '100',
      fontWeight: '500',
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr min-content'
    }}>
      <ProfilePicture></ProfilePicture>
      <div style={{
        display: 'grid',
        placeItems: 'center left',
      }}>
        <div>
          <div style={{
            fontWeight: '400',
            fontSize: '15px',
          }}>{clientId && clientName[clientId]}</div>
          <div style={{
            fontWeight: '300',
            fontSize: '13px',
          }}>dev.valnet.xyz</div>
        </div>
      </div>
      <div style={{
        whiteSpace: 'nowrap',
        display: 'grid',
        gridAutoFlow: 'column',
        placeItems: 'center right',
        paddingRight: '8px',
      }}>
        <SettingsButton></SettingsButton>
        {/* <SettingsButton></SettingsButton>
        <SettingsButton></SettingsButton> */}
      </div>
    </div>
  )
}

function SettingsButton() {
  const [ref, hover] = useHover<HTMLDivElement>();
  const { openSettings } = useContext(SettingsContext);

  return <div ref={ref} className="settings" style={{
    display: 'flex',
    padding: '8px',
    background: hover ?
            'var(--neutral-4)' :
            'initial',
    borderRadius: '5px',
    cursor: 'pointer',
  }} onClick={openSettings}>
    <IoMdSettings size="16"></IoMdSettings>
  </div>
}

function ProfilePicture() {
  const name = 'Val';
  return <div style={{
    backgroundImage: `url(${pfp})`,
    width: '40px',
    height: '40px',
    margin: '12px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    borderRadius: '50%',
  }}></div>
}