import { useContext, useEffect } from 'react';
import TimeAgo from 'react-timeago';
import { ClientsListContext } from '../contexts/EphemeralState/ClientsListState';
import useHover from '../hooks/useHover';

export type IMessage = NewMessageResponse;

interface MessageProps {
  message: IMessage
}

const firstLineIndent = '10px';
const multiLineIndent = '16px';
const rightMessagePadding = '16px';

export function Message({
  message,
}: MessageProps) {

  const { clientName } = useContext(ClientsListContext);
  const [hoverRef, hover] = useHover<HTMLDivElement>();

  return (
    <div ref={hoverRef} style={{
      display: 'grid',
      gridTemplateColumns: '4em 1fr',
      width: '100%',
      padding: '1px 0px',
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: hover ? 'var(--neutral-3)' : undefined,
        position: 'absolute',
        opacity: '0.5',
      }}></div>
      <span style={{
        fontStyle: 'italic',
        color: 'var(--neutral-6)',
        textAlign: 'right',
        userSelect: 'none',
        marginRight: '16px',
        position: 'relative'
      }}>
        <TimeAgo
          date={message.timestamp}
          formatter={(t, u) => u === 'second' ? 'Now' : ('' + t + u[0])}
        ></TimeAgo>
      </span>
      <div style={{
        // outline: '1px solid white',
        marginRight: '16px',
        position: 'relative',
        paddingLeft: '1em',
        textIndent: '-1em',
      }}>
        <div>
          <span style={{
            fontWeight: '500',
            paddingRight: '8px',
          }}>
            {clientName[message.from]}
          </span>
          <span style={{
          }}>
            {message.text}
          </span>
        </div>
        {!!message.file && (
          <div>
            <img style={{
              maxWidth: '100%',
              maxHeight: '20vh',
            }} src={message.file.url}></img>
          </div>
        )}
      </div>
    </div>
  );
}