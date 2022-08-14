import React from "react";
import { MouseEventHandler, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { MdHeadphones, MdMic, MdMicOff, MdPhoneDisabled, MdPhoneInTalk, MdScreenShare, MdSend, MdVideocam } from "react-icons/md";
import { ClientsListContext } from "../contexts/EphemeralState/ClientsListState";
import { Connection, PeerContext } from "../contexts/EphemeralState/PeerState";
import { UserMediaContext } from "../contexts/EphemeralState/UserMediaState";
import useChannel from "../hooks/useChannel";
import { useApi } from "../lib/useApi";
import { IconType } from 'react-icons/lib/cjs/iconBase';
import useClientId from "../hooks/useClientId";

export default function Voice() {
  const {
    connected,
    peerId,
    join,
    leave,
    connections,
    inCall,
    connectedChannel
  } = useContext(PeerContext);
  const { channel } = useChannel();
  const { clientName } = useContext(ClientsListContext);
  const { clientId } = useClientId();

  const {
    mute, unmute, muted, enable, mediaStream
  } = useContext(UserMediaContext);

  const [connectedVoiceClientIds, setConnectedVoiceClientIds] = useState<string[]>([])

  const { send } = useApi({
    'voice:list'(data: { participants: Connection[] }) {
      setConnectedVoiceClientIds(data.participants.map(c => c.clientId));
    },
    'voice:join'(data: Connection) {
      setConnectedVoiceClientIds(ids => ([...ids, data.clientId]));
    },
    'voice:leave'(data: Connection) {
      setConnectedVoiceClientIds(ids => ids.filter(id => data.clientId !== id));
    }
  });

  useEffect(() => {
    console.log(connectedVoiceClientIds);
  }, [connectedVoiceClientIds])

  useEffect(() => {
    send('voice:list', { channelId: channel })
  }, [channel])

  const joinCall = useCallback(() => {
    if(peerId === null || connected === false || channel === null) return;
    enable();
    join(channel);
    send('voice:join', { peerId, channelId: channel });
  }, [connected, peerId, channel]);

  const leaveCall = useCallback(() => {
    if(peerId === null || connected === false) return;
    leave();
    send('voice:leave', { peerId, channelId: channel });
  }, [connected, peerId, channel]);

  const inThisCall = inCall && channel === connectedChannel;

  return <div style={{
    background: 'var(--neutral-1)',
    height: '100%',
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute',
      bottom: '0px',
      width: '100%',
      display: 'grid',
      placeItems: 'center center'
    }}>
      <div style={{
        margin: '0px auto',
        display: 'inline',
      }}>
        {(!inThisCall) ? (
          <CircleButton
            icon={MdPhoneInTalk}
            onClick={joinCall}
            color="var(--green)"
          ></CircleButton>
        ) : (
          <>
            <CircleButton
              icon={muted ? MdMicOff : MdMic}
              onClick={() => muted ? unmute() : mute()}
              inverted={muted}
            ></CircleButton>
            <CircleButton
              icon={MdHeadphones}
              onClick={leaveCall}
            ></CircleButton>
            <CircleButton
              icon={MdScreenShare}
              onClick={leaveCall}
            ></CircleButton>
            <CircleButton
              icon={MdVideocam}
              onClick={leaveCall}
            ></CircleButton>
            <CircleButton
              icon={MdPhoneDisabled}
              onClick={leaveCall}
              color="var(--red)"
            ></CircleButton>
          </>
        )}
      </div>
    </div>
    <div style={{
      display: 'grid',
      placeItems: 'center center',
      height: '100%',
      width: '100%'
    }}>

      {connectedVoiceClientIds.length === 0 ? (
        <span style={{ color: 'var(--neutral-6)', fontWeight: '600' }}>No one is here right now</span>
      ) : (
        <div style={{

        }}>
          {connectedVoiceClientIds.map(id => {
            const connection = connections.find(c => c.clientId === id);
            const isMe = clientId === id;
            const stream = (isMe ? mediaStream : connection?.mediaStream) ?? undefined
            return (
              <Participant
                name={clientName[id]}
                stream={stream}
              ></Participant>
            )
          })}
        </div>
      )}
    </div>
  </div>
}

function Participant(props: {
  name: string,
  stream?: MediaStream
}) {
  return (
    <div style={{
      width: '200px',
      height: '150px',
      display: 'inline-block',
      placeItems: 'center center',
      borderRadius: '8px',
      background: 'var(--neutral-4)',
      color: 'var(--neutral-8)',
      fontStyle: '500',
      margin: '4px',
      verticalAlign: 'top',
      overflow: 'hidden',
    }}>
      <Video autoPlay muted style={{
        width: '100%'
      }} srcObject={props.stream}></Video>
      {/* <div style={{
        display: 'grid',
        width: '100%',
        height: '100%',
        placeItems: 'center center',
      }}>
        {props.name}
      </div> */}
    </div>
  )
}

function Video(props: React.VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject?: MediaStream
}) {

  const [ref, setRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if(ref === null) return;
    if(props.srcObject === undefined || props.srcObject === null) return;
    console.log(ref);
    ref.srcObject = props.srcObject;
  }, [props.srcObject, ref]);

  const filteredProps = Object.fromEntries(Object.entries(props).filter(([key, value]) => key !== 'srcObject'));

  return <video ref={setRef} {...filteredProps}>{props.children}</video>
}


function CircleButton(props: {
  onClick: MouseEventHandler<HTMLDivElement>,
  icon: IconType,
  color?: string,
  inverted?: boolean,
}) {

  return (
    <div style={{
      display: 'inline-block',
      width: '56px',
      height: '64px',
      padding: '8px',
      paddingRight: '0px',
      boxSizing: 'border-box',
    }}>
      <div onClick={props.onClick} style={{
        background: props.inverted ? 'var(--neutral-9)' : (props.color ?? 'var(--neutral-4)'),
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center center',
        // paddingLeft: '4px',
        boxSizing: 'border-box',
      }}>
        {React.createElement(
          props.icon,
          {
            size: 24,
            color: props.inverted ? 'var(--neutral-1)' : 'inherit'
          }
        )}
      </div>
    </div>
  )
}
// MdPhoneInTalk
// MdPhoneDisabled