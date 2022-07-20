import { useCallback, useEffect, useRef, useState } from 'react';
import TimeAgo from 'react-timeago';
import { v4 } from 'uuid';
import { registerRouter, router, send, unregisterRouter } from '../lib/api';

const firstLineIndent = '10px';
const multiLineIndent = '16px';
const rightMessagePagging = '16px';

interface Message {
  text: string;
  from: string;
  timestamp: number;
  // nid: number;
  uid: string;
}

function createMessage(from: string, text: string, t = 0): Message {
  return {
    text,
    from,
    timestamp: Date.now() - t * 1000,
    uid: v4(),
  };
}

const mockMessages: Message[] = [
  // createMessage('Bob', 'Hey', 55),
  // createMessage('Alice', 'Hello', 50),
  // createMessage('Bob', 'What up', 45),
  // createMessage('Alice', 'nm UUU', 40),
  // createMessage('Bob', 'Hey', 35),
  // createMessage('Alice', 'Hello', 30),
  // createMessage('Bob', 'What up', 25),
  // createMessage('Alice', 'nm UUU', 20),
  // createMessage('Bob', 'Hey', 15),
  // createMessage('Alice', 'Hello', 10),
  // createMessage('Bob', 'What up', 5),
  // createMessage('Alice', 'This is what a really long message could possibly look like, if a person decided to write a really long essay. This is what a really long message could possibly look like, if a person decided to write a really long essay. This is what a really long message could possibly look like, if a person decided to write a really long essay. This is what a really long message could possibly look like, if a person decided to write a really long essay.'),
];

export default () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const actions = router({
      message(data: Message) {
        setMessages([...messages, data]);
      },
    });
    registerRouter(actions);
    return () => {
      unregisterRouter(actions);
    };
  }, [messages]);

  const sendMessage = useCallback(() => {
    if(textBoxRef.current === null) return;
    send('message', createMessage('Version 2', textBoxRef.current.innerText));
    textBoxRef.current.innerText = '';
  }, []);

  const keyDown = useCallback((evt: any) => {
    console.log(evt);
    if(evt.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <>
      <div
        style={{
          background: '#282a36',
          height: '100%',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 64px',
          gridTemplateRows: '1fr 64px',
          gridTemplateAreas: '"content content" "message send"',
        }}
      >
        <div style={{
          // borderBottom: '1px solid #bd93f9',
          gridArea: 'content',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '0px',
            width: '100%',
          }}>
            {messages.map(message => (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '128px 1fr',
                width: '100%',
                padding: '1px 0px',
              }}>
                <span style={{
                  fontStyle: 'italic',
                  color: '#596793',
                  textAlign: 'right',
                  userSelect: 'none',
                  marginRight: '16px',
                }}>
                  <TimeAgo
                    date={message.timestamp}
                    formatter={(t, u) => u === 'second' ? 'Just Now' : ('' + t + u[0])}
                  ></TimeAgo>
                </span>
                <span style={{
                }}>
                  <div style={{
                    fontWeight: 'bold',
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
            ))}
          </div>
        </div>
        <div onClick={() => {
          textBoxRef.current?.focus();
        }}style={{
          margin: '8px',
          marginRight: '3px',
          borderRadius: '8px',
          background: '#343746',
          gridArea: 'message',
          display: 'grid',
          placeItems: 'center center',
          padding: '0px 16px',
          cursor: 'text',
          overflow: 'auto',
        }}>
          <div
            ref={textBoxRef}
            onKeyDown={keyDown}
            className="input"
            role="textbox"
            contentEditable
            style={{
              background: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              borderRadius: '8px',
              width: '100%',
              resize: 'none',
            }}
          ></div>
        </div>
        <div style={{
          width: '100%',
          height: '100%',
          padding: '8px',
          boxSizing: 'border-box',
        }}>
          <div onClick={sendMessage} style={{
            background: '#bd93f9',
            width: '100%',
            height: '100%',
            // borderRadius: '50%',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center center',
            fontSize: '32px',
          }}>
            
          </div>
        </div>
      </div>
    </>
  );
};