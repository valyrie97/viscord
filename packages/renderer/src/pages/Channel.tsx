import { CgHashtag } from "react-icons/cg";
import { MdVolumeUp } from "react-icons/md";
import { BsQuestionLg } from 'react-icons/bs';
import { ChannelType } from "../contexts/EphemeralState/EphemeralState";
import useChannel from "../hooks/useChannel";
import useHover from "../hooks/useHover";
import { useApi } from "../lib/useApi";
import { useContext, useEffect, useState } from "react";
import { VoiceChannelContext } from "../contexts/EphemeralState/VoiceChannelState";

interface ChannelProps {
  unread: number;
  uid: string;
  name: string;
  type: ChannelType;
}

export default function Channel(props: ChannelProps) {
  const { channel, setChannel } = useChannel();
  const { unread, uid, name, type } = props;
  const [ref, hover] = useHover<HTMLDivElement>();
  const selected = channel === uid;
  const { voiceChannelId } = useContext(VoiceChannelContext);

  const [participants, setParticipants] = useState<any[]>([]);

  const { send } = useApi({
    'voice:join'(data: any) {
      if(type !== 'voice' || data.channelId !== uid) return;
      setParticipants([...participants, {
        clientId: data.clientId,
        peerId: data.peerId,
        channelId: data.channelId
      }])
      console.log('JOIN', data);
    },
    'voice:list'(data: any) {
      if(type !== 'voice') return;
      console.log('CURRENTS', data);
    },
    'voice:leave'(data: any) {
      console.log(data);
    },
  }, [uid, type, participants])

  useEffect(() => {
    if(type !== 'voice') return;

    setParticipants([]);
    send('voice:list', { uid });
  }, [uid]);

  return (
    <div
      style={{
        margin: '2px 2px',
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr',
        color: selected ? 'cyan' : 'inherit',
        cursor: 'pointer',
        background: selected ? 'var(--neutral-5)' :
                       hover ? 'var(--neutral-4)' :
                               'inherit',
        borderRadius: '8px',
        transform:'skew(-20deg, 0deg)',
        transition: 'background 300ms, color 300ms',
      }}
      onClick={() => {
        setChannel(uid, type);
      }}
      ref={ref}
    >
      {(type === 'text') ? (
        <CgHashtag color={
          selected ? 'var(--neutral-9)' :
              hover ? 'var(--neutral-7)' :
                      'var(--neutral-7)'
        } size={24} style={{
          margin: '4px',
          transition: 'background 300ms, color 300ms',
          transform:'skew(-5deg, 0deg)',
        }}></CgHashtag>
      ) : ((type === 'voice') ? (
        <MdVolumeUp color={
          selected ? 'var(--neutral-9)' :
              hover ? 'var(--neutral-7)' :
                      'var(--neutral-7)'
        } size={24} style={{
          margin: '4px',
          transition: 'background 300ms, color 300ms',
          transform:'skew(20deg, 0deg)',
        }}></MdVolumeUp>
      ) : (
        <BsQuestionLg color={
          selected ? 'var(--neutral-9)' :
              hover ? 'var(--neutral-7)' :
                      'var(--neutral-7)'
        } size={24} style={{
          margin: '4px',
          transition: 'background 300ms, color 300ms',
          transform:'skew(20deg, 0deg)',
        }}></BsQuestionLg>
      ))}
      <div style={{
        lineHeight: '32px',
        color: selected ? 'var(--neutral-9)' :
                  hover ? 'var(--neutral-9)' :
                          'var(--neutral-7)',
        transform:'skew(20deg, 0deg)',
        transition: 'background 300ms, color 300ms',
      }}>
        {name.toLowerCase().replaceAll(' ', '-').trim()}
      </div>
      {/* {(unread > 0) && (
        <span style={{ paddingRight: '8px' }}>({unread})</span>
      )}
      <span style={{
        fontWeight: (unread ?? 0) > 0 ? 'bold' : '300',
      }}>
        {name}
      </span>
      <a style={{
        color: 'rgba(0, 100, 200, 1)',
        marginLeft: '8px',
        fontSize: '10px',
      }} href="#" onClick={() => {}}>Delete</a> */}
      <br></br>
      {participants.map(participant => (
        <div key={participant.clientId}>
          {participant.clientId}
        </div>
      ))}
    </div>
  )
}