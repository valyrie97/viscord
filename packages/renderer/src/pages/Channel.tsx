import { CgHashtag } from "react-icons/cg";
import { MdVolumeUp } from "react-icons/md";
import { BsQuestionLg } from 'react-icons/bs';
import { ChannelType } from "../contexts/EphemeralState/EphemeralState";
import useChannel from "../hooks/useChannel";
import useHover from "../hooks/useHover";
import { useApi } from "../lib/useApi";
import { useContext, useEffect, useState } from "react";
import { VoiceChannelContext } from "../contexts/EphemeralState/VoiceChannelState";
import { ClientsListContext } from "../contexts/EphemeralState/ClientsListState";
import { sfx } from "../lib/sound";

interface ChannelProps {
  unread: number;
  uid: string;
  name: string;
  type: ChannelType;
}

interface Participant {
  peerId: string;
  channelId: string;
  clientId: string;
}

export default function Channel(props: ChannelProps) {
  const { clientName } = useContext(ClientsListContext);
  const { channel, setChannel } = useChannel();
  const { unread, uid, name, type } = props;
  const [ref, hover] = useHover<HTMLDivElement>();
  const selected = channel === uid;
  const { voiceChannelId } = useContext(VoiceChannelContext);

  const [participants, setParticipants] = useState<Participant[]>([]);

  const { send } = useApi({
    'voice:join'(data: any) {
      if(type !== 'voice' || data.channelId !== uid) return;
      setParticipants([...participants, {
        clientId: data.clientId,
        peerId: data.peerId,
        channelId: data.channelId
      }])
    },
    'voice:list'(data: any) {
      if(type !== 'voice') return;
      if(uid !== data.uid) return;
      setParticipants(data.participants);
    },
    'voice:leave'(data: any) {
      setParticipants(participants => participants.filter(p => (
        p.channelId !== data.channelId ||
        p.clientId !== data.clientId ||
        p.peerId !== data.peerId
      )));
    },
  }, [uid, type, participants])

  useEffect(() => {
    if(type !== 'voice') return;

    setParticipants([]);
    send('voice:list', { uid });
  }, [uid]);

  return (
    <>
      <div
        style={{
          margin: '2px 2px',
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
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
      </div>

      <div style={{
        // outline: '1px solid white',
        paddingLeft: '32px',
      }}>
        {participants.map(participant => (
          <div key={participant.clientId}>
            {clientName[participant.clientId]}
          </div>
        ))}
      </div>
    </>
  )
}