import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { useApi } from '../lib/useApi';
import type { IMessage} from './Message';
import { Message } from './Message';
import { MdSend } from 'react-icons/md';
import useChannel from '../hooks/useChannel';
import useClientId from '../hooks/useClientId';
import useSessionToken from '../hooks/useSessionToken';
import ChatInput from '../components/ChatInput';

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
  const { sessionToken } = useSessionToken();
  
  const PADDING = 8;
  
  const { channel, setChannel } = useChannel();
  const { clientId } = useClientId();

  const { send } = useApi({
    'message:message'(data: IMessage) {
      if(data.channel !== channel) return;

      setMessages(messages => ([...messages, data]));
    },
    'message:recent'(data: { messages: IMessage[] }) {
      setMessages(data.messages.reverse());
    },
  }, [channel]);

  useEffect(() => {
    send('message:recent', { channel });
  }, [channel]);

  // const sendMessage = useCallback(() => {
  //   if(textBoxRef.current === null) return;
  //   if(channel === null) return;
  //   if(clientId === null) return;
  //   if(sessionToken === null) return;
  //   send(
  //     'message:message',
  //     createMessage(
  //       clientId,
  //       textBoxRef.current.innerText,
  //       channel,
  //     )
  //   );
  //   textBoxRef.current.innerText = '';
  // }, [channel, sessionToken]);

  // const keyDown = useCallback((evt: any) => {
  //   if(evt.key === 'Enter') {
  //     sendMessage();
  //   }
  // }, [sendMessage]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        background: 'var(--neutral-4)',
        gridTemplateColumns: `1fr min-content`,
        gridTemplateRows: `1fr min-content`,
        gridTemplateAreas: '"content content" "message send"',
      }}
    >
      <div style={{
        // borderBottom: '1px solid #bd93f9',
        gridArea: 'content',
        position: 'relative',
        // borderBottom: '1px solid white'
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
      <ChatInput></ChatInput>
      <SendButton></SendButton>
    </div>
  );
};


function SendButton() {
  return (
    <div style={{
      height: '100%',
      width: '64px',
      position: 'relative',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        padding: '8px',
        boxSizing: 'border-box',
        position: 'absolute',
        bottom: '0px',
      }}>
        <div style={{
          background: '#bd93f9',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          // borderRadius: '8px',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center center',
          paddingLeft: '4px',
          // paddingTop: '2px',
          boxSizing: 'border-box',
        }}>
          <MdSend size={24}></MdSend>
        </div>
      </div>
    </div>
  )
}