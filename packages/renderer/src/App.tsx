import { createContext, useCallback, useEffect, useState, useMemo } from 'react';
import Channels from './pages/Channels';
import Chat from './pages/Chat';
import Sidebar from './components/Sidebar';
import NewAccount from './pages/NewAccount';
import ServerConnection from './components/ServerConnection';
import EphemeralState from './contexts/EphemeralState/EphemeralState';
import PersistentState from '/@/contexts/PersistentState/PersistentState';
import Router from './Router';

export default function App() {
  const [transparent, setTransparent] = useState(false);
  
  
  // font-size: 16px;
  // font-family: 'Lato', sans-serif;
  // font-family: 'Red Hat Text', sans-serif;
  // font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  // color: #f8f8f2;
  // background: #282a36;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
      <link href={"https://fonts.googleapis.com/css2?family=Fira+Sans&family=Josefin+Sans&family=Lato&family=Radio+Canada&family=Readex+Pro&family=Red+Hat+Text&family=Rubik&family=Signika&family=Telex&display=swap"} rel="stylesheet" />
      <style>{`
        html {
          --background: #282a36;
          --current-line: #44475a;
          --foreground: #f8f8f2;
          --comment: #6272a4;
          --cyan: #8be9fd;
          --green: #50fa7b;
          --orange: #ffb86c;
          --pink: #ff79c6;
          --purple: #bd93f9;
          --red: #ff5555;
          --yellow: #f1fa8c;
          --primary: var(--purple);
        }
        a {
          color: var(--cyan);
        }
      `}</style>
      <div style={{
        background: transparent ? 'rgba(0, 0, 0, 0)' : 'var(--background)',
        color: transparent ? 'black' : 'var(--foreground)',
        fontSize: '16px',
        fontFamily: "'Red Hat Text', sans-serif",
        width: '100%',
        height: '100%'
      }}>
        <PersistentState>
          <EphemeralState onTransparencyChange={setTransparent}>
            <Router></Router>
          </EphemeralState>
        </PersistentState>
      </div>
    </>
  );
}