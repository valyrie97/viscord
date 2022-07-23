import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { useApi } from '../lib/useApi';
import { channelContext, clientIdContext } from './App';
import type { IMessage} from './Message';
import { Message } from './Message';

function createMessage(from: string, text: string,
    channel: string, t = 0): IMessage {
  return {
    text,
    from,
    timestamp: Date.now() - t * 1000,
    uid: v4(),
    channel,
  };
}

export default () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [hist, setHist] = useState(false);
  
  const textBoxRef = useRef<HTMLDivElement>(null);
  
  const { channel, setChannel } = useContext(channelContext);
  const clientId = useContext(clientIdContext);

  const { send } = useApi({
    'message:message'(data: IMessage) {
      if(data.channel !== channel) return;

      setMessages([...messages, data]);
    },
    'message:recent'(data: { messages: IMessage[] }) {
      setMessages(data.messages.reverse());
    },
  }, [messages]);

  useEffect(() => {
    console.log('sending recents request');
    send('message:recent', { channel });
  }, [channel]);

  const sendMessage = useCallback(() => {
    if(textBoxRef.current === null) return;
    if(channel === null) return;
    if(clientId === null) return;
    send(
      'message:message',
      createMessage(
        clientId,
        textBoxRef.current.innerText,
        channel,
      ),
    );
    textBoxRef.current.innerText = '';
  }, [channel]);

  const keyDown = useCallback((evt: any) => {
    if(evt.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <>
      <div
        style={{
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
            <Message key={message.uid} message={message}></Message>
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