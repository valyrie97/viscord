import TimeAgo from 'react-timeago';

export interface IMessage {
  uid: string;
  timestamp: number;
  from: string;
  text: string;
  channel: string;
}

interface MessageProps {
  message: IMessage
}

const firstLineIndent = '10px';
const multiLineIndent = '16px';
const rightMessagePagging = '16px';

export function Message({
  message,
}: MessageProps) {
  

  return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '4em 1fr',
        width: '100%',
        padding: '1px 0px',
      }}>
        <span style={{
          fontStyle: 'italic',
          color: 'var(--neutral-6)',
          textAlign: 'right',
          userSelect: 'none',
          marginRight: '16px',
        }}>
          <TimeAgo
            date={message.timestamp}
            formatter={(t, u) => u === 'second' ? 'Now' : ('' + t + u[0])}
          ></TimeAgo>
        </span>
        <span style={{
        }}>
          <div style={{
            fontWeight: '500',
            float: 'left',
            paddingRight: firstLineIndent,
            // marginRight: '16px',
            // height: '100%'
            // borderBottom: '1px solid white'
          }}>
            {message.from}
          </div>
          <div style={{
            marginRight: rightMessagePagging,
            paddingLeft: multiLineIndent,
            boxSizing: 'border-box',
            position: 'relative',
          }}>
            {message.text}
          </div>
        </span>
      </div>
  );
}