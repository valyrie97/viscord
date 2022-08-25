import { useEffect, useRef, useState } from "react";
import { v4 } from 'uuid';
import { GrFormClose } from 'react-icons/gr';
import { IoMdClose } from "react-icons/io";
import testImage from '../../assets/pfp.jpg'
import useFileUpload, { Upload } from "../hooks/useFileUpload";
import useChannel from "../hooks/useChannel";
import { useApi } from "../lib/useApi";

const exampleImages = [
  {
    id: v4(),
    name: 'image.jpg',
    data: testImage,
  }
]

export default function ChatInput() {
  const textBoxRef = useRef<HTMLDivElement>(null);
  const { channel } = useChannel();
  
  const [attachments, setAttachments] = useState<string[]>([]);

  const { newFile, getFileInfo } = useFileUpload();

  const PADDING = 8;
  const CHATBOX_SIZE = 64;

  const addAttachment = (id: string) => {
    setAttachments(attachments => [...attachments, id])
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments => attachments.filter(a => a !== id));
  }

  // useEffect(() => {
  //   addAttachment(newFile('image.jpg', testImage));
  // }, []);

  const pasta: React.ClipboardEventHandler<HTMLDivElement> = (event) => {

    let pastedFiles = false;

    for (let idx = 0; idx < event.clipboardData.items.length; idx ++) {
      const item = event.clipboardData.items[idx];
      const file = event.clipboardData.files[idx];
      const type = event.clipboardData.types[idx]

      if (item.kind === 'file') {
        var blob = item.getAsFile();
        if(blob === null) continue;
        
        addAttachment(newFile(file.name, file.type, blob));

        pastedFiles = true;
      }
    }

    if(pastedFiles) {
      event.preventDefault();
    }
  }

  const { send } = useApi({});

  const keyPress = (event: any) => {
    if(event.code === 'Enter' && !event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();
      event.bubbles = false;

      for(const attachment of attachments) {
        const info = getFileInfo(attachment);
        if(!info?.processed) {
          return true;
        }
      }

      const [file, ...restFiles] = attachments.map(a => getFileInfo(a)?.externalId) as string[];
      const text = textBoxRef.current?.innerHTML ?? '';

      if(text === '' && file === undefined) {
        return true;
      }

      if(channel === null) return true;

      const newMessage: NewMessageRequest = {
        uid: v4(),
        text,
        channel,
        timestamp: new Date().getTime(),
        file
      }

      console.log(file, restFiles);

      send('message:message', newMessage);

      for(const file of restFiles) {
        const newMessage: NewMessageRequest = {
          uid: v4(),
          text: '',
          channel,
          timestamp: new Date().getTime(),
          file
        }
        send('message:message', newMessage);
      }

      setAttachments([]);
      if(textBoxRef.current !== null) {
        textBoxRef.current.innerHTML = '';
      }

      return true;
    }
  }

  return (
    <div style ={{
      minWidth: '0px',
    }}>
      <div style={{
        overflowX: 'auto',
      }}>
        {attachments.length > 0 && (
          <div style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            paddingBottom: '0px',
          }}>
            <div style={{
              whiteSpace: 'nowrap'
            }}>
              {attachments.map(attachment => {
                const info = getFileInfo(attachment);
                if(!info) return <span>Poop</span>;
                return (
                  <AttachmentBox
                    key={attachment}
                    attachment={info}
                    onClose={() => removeAttachment(attachment)}
                  ></AttachmentBox>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => {
          textBoxRef.current?.focus();
        }}
        style={{
          margin: PADDING + 'px',
          marginRight: '0px',
          borderRadius: ((CHATBOX_SIZE - PADDING*2) / 2) + 'px',
          background: 'var(--neutral-5)',
          gridArea: 'message',
          display: 'grid',
          placeItems: 'center center',
          padding: '8px 16px',
          minHeight: '48px',
          boxSizing: 'border-box',
          cursor: 'text',
          overflow: 'auto',
        }}
        onPaste={pasta}
      >
        <div
          style={{
            width: '100%',
            border: 'none',
            // outline: '1px solid white',
            outline: 'none',
          }}
          onKeyPress={keyPress}
          ref={textBoxRef}
          contentEditable
        ></div>
      </div>
    </div>
  )
}

function AttachmentBox(props: {
  attachment: Upload,
  onClose: React.MouseEventHandler<SVGElement>
}) {
  return (
    <div style={{
      verticalAlign: 'top',
      // padding: '8px',
      background: 'var(--neutral-3)',
      // border: '1px solid var(--neutral-6)',
      fontSize: '0.8em',
      display: 'inline-block',
      boxSizing: 'border-box',
      borderRadius: '8px',
      marginRight: '8px',
      position: 'relative',
      overflow: 'hidden',
      // textAlign: 'center',
    }}>
      <div style={{
        transition: 'width 300ms, background 300ms, opacity 800ms',
        width: `${props.attachment.progress * 100}%`,
        height: '100%',
        background: props.attachment.uploaded ? 'white' : 'var(--green)',
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: '0',
        opacity: props.attachment.uploaded ? '0' : '0.3'
      }}></div>
      <div style={{
        zIndex: '1',
        padding: '8px',
        position: 'relative',
      }}>
        <IoMdClose
          size={16}
          style={{
            float: 'right',
            color: 'var(--neutral-9)',
            padding: '1px',
            cursor: 'pointer',
          }}
          onClick={props.onClose}
        ></IoMdClose>
        <div style={{
          paddingBottom: '8px',
          paddingRight: '24px',
        }}>{props.attachment.name}</div>
        {/* <img style={{
          display: 'block',
          height: '100px'
        }} src={props.attachment.blob}></img> */}
      </div>
    </div>
  )
}