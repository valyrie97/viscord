import React from 'react';
import ReactDOM from 'react-dom';
import Channels from './pages/Channels';
import Chat from './pages/Chat';

ReactDOM.render(
  (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gridTemplateRows: '1fr',
      height: '100%',
    }}>
      <div style={{
        background: 'rgba(25, 26, 33)',
        borderRight: '1px solid #bd93f9',
      }}>
        <Channels></Channels>
      </div>
      <div>
        <Chat></Chat>
      </div>
    </div>
  ),
  document.getElementById('app'),
);