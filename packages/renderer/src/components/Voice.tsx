import React, { useLayoutEffect } from "react";
import { MouseEventHandler, ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { MdHeadphones, MdMic, MdMicOff, MdScreenShare, MdSend, MdVideoCall, MdVideocam, MdVideocamOff } from "react-icons/md";
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { ClientsListContext } from "../contexts/EphemeralState/ClientsListState";
import { IParticipant, IConnection, PeerContext } from "../contexts/EphemeralState/PeerState";
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
    mute,
    unmute,
    muted,
    enable,
    disable,
    mediaStream,
    cameraEnabled,
    enableCamera,
    disableCamera
  } = useContext(UserMediaContext);

  const [connectedVoiceClientIds, setConnectedVoiceClientIds] = useState<string[]>([])
  const [participants, setParticipants] = useState<IParticipant[]>([]);

  const { send } = useApi({
    'voice:list'(data: { uid: string, participants: IParticipant[] }) {
      if(data.uid !== channel) return;
      setParticipants(data.participants);
    },
    'voice:join'(data: IParticipant) {
      if(data.channelId !== channel) return;
      setParticipants(ps => ([...ps, data]));
    },
    'voice:leave'(data: IParticipant) {
      if(data.channelId !== channel) return;
      setParticipants(ps => ps.filter(p => p.peerId !== data.peerId));
    }
  }, [channel]);

  useEffect(() => {
    send('voice:list', { channelId: channel })
  }, [channel]);

  const joinCall = useCallback(() => {
    if(peerId === null || connected === false || channel === null) return;
    disableCamera();
    enable();
    join(channel);
    send('voice:join', { peerId, channelId: channel });
  }, [connected, peerId, channel]);

  const joinCallWithVideo = useCallback(() => {
    if(peerId === null || connected === false || channel === null) return;
    enableCamera();
    enable();
    join(channel);
    send('voice:join', { peerId, channelId: channel });
  }, [connected, peerId, channel]);

  const leaveCall = useCallback(() => {
    if(peerId === null || connected === false) return;
    leave();
    disable();
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
          <>
            <CircleButton
              icon={FiLogIn}
              onClick={joinCall}
              color="var(--green)"
            ></CircleButton>
            <CircleButton
              icon={MdVideoCall}
              onClick={joinCallWithVideo}
              color="var(--green)"
            ></CircleButton>
          </>
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
              icon={cameraEnabled ? MdVideocam : MdVideocamOff}
              onClick={() => cameraEnabled ? disableCamera() : enableCamera()}
              inverted={!cameraEnabled}
            ></CircleButton>
            <CircleButton
              icon={FiLogOut}
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

      {participants.length === 0 ? (
        <span style={{ color: 'var(--neutral-6)', fontWeight: '600' }}>No one is here right now</span>
      ) : (
        <div style={{

        }}>
          {participants.map(participant => {
            const connection = connections.find(c => c.clientId === participant.clientId);
            
            // if(participant.clientId !== clientId) return <div key={participant.peerId}></div>;

            return (
              <Participant
                key={participant.peerId}
                data={connection ?? participant}
              ></Participant>
            )
          })}
        </div>
      )}
    </div>
  </div>
}

function Participant(props: {
  data: IParticipant | IConnection
}) {

  const [videoRoot, setVideoRoot] = useState<HTMLDivElement | null>(null);
  const { videoElement } = useContext(UserMediaContext);
  const { clientName } = useContext(ClientsListContext);

  const isSelf = useClientId().clientId === props.data.clientId;
  const remoteVideoElement = isSelf ? (
    videoElement
  ) : (
    ('videoElement' in props.data) ? (
      props.data.videoElement
    ) : (
      null
    )
  );

  useLayoutEffect(() => {
    if(videoRoot === null) return;
    if(remoteVideoElement === null) return;

    const alreadyThere = [...videoRoot.childNodes].includes(remoteVideoElement);

    if(!alreadyThere) {
      while(!!videoRoot.firstChild) {
        videoRoot.firstChild.remove();
      }
      videoRoot.appendChild(remoteVideoElement);
    }
    remoteVideoElement.play();
  }, [videoRoot, remoteVideoElement]);

  return (
    <div style={{
      display: 'inline-block',
      verticalAlign: 'top',
      margin: '4px',
    }}>
      <div style={{
        width: '200px',
        height: '150px',
        display: 'inline-block',
        placeItems: 'center center',
        borderRadius: '8px',
        background: isSelf ? 'var(--orange)' : 'var(--neutral-4)',
        color: 'var(--neutral-8)',
        fontStyle: '500',
        overflow: 'hidden',
      }}>
        <div ref={setVideoRoot} style={{
          height: '100%'
        }}></div>
      </div>
      <div style={{
        textAlign: 'center'
      }}>{clientName[props.data.clientId]}</div>
    </div>
  )
}

function CircleButton(props: {
  onClick: MouseEventHandler<HTMLDivElement>,
  icon: IconType,
  color?: string,
  inverted?: boolean,
}) {

  const primaryColor = props.inverted ? 'var(--neutral-9)' : (props.color ?? 'var(--neutral-4)');

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
        background: primaryColor,
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