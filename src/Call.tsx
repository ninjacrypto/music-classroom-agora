import React, { useCallback, useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import './call.css';
import { RootState } from './store/store';
import GridContainer from './components/grid/grid';
import { replaceMeetingMode, streamInterface, VideoState } from './slices/userVideoSlice';
import { find } from 'lodash';
import ActiveVideoElement from './components/ActiveVideoBlock/ActiveVideoBlock';
import WhiteboardDrawingService from './hooks/Whiteboard/WhiteboardDrawingService';
import socket from './hooks/Meeting.socket';
import { IEvent } from 'fabric/fabric-impl';
import {
  MeetingWhiteboardDrawingState,
  replaceWhiteboardDrawings,
  pushWhiteboardDrawing,
  replaceMeetingImage,
  replaceWhiteboardEnabled,
} from './slices/userVideoSlice';
import WhiteboardCanvasService from './hooks/Whiteboard/WhiteboardCanvasService';
import Whiteboard from './components/Whiteboard/Whiteboard';
import { useAlert } from 'react-alert';
import DragDrop from './components/dragDrop/DragDrop';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });
const screenClient = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' });

function Call(props: RouteComponentProps) {
  const appid = '4d5d68e2022f4acbbc091609970b93f9';
  const token = '0064d5d68e2022f4acbbc091609970b93f9IAA9RWpryB4X5XymLWhz70CzUvKz3JuLRjn2ab/cauI/T72No/cAAAAAEACZZ/CeXNERYQEAAQBc0RFh';

  const {
    stopScreenShare,
    handleRemoteRaiseHandClick,
    handleRemoteActiveVideoClick,
    screenJoin,
    leave,
    join,
    MuteAudio,
    MuteCamera,
    unMuteAudio,
    unMuteCamera,
    handleRemotePeerMute,
    handleRemotePeerunMute,
    localVideoId,
    handleClickOnVideoBorderChange,
    handleRemoteMuteforAllClick,
    handleRemoteVideoMuteforAllClick,
    handleRemoteVideoUnMuteforAllClick,
    handleRemoteUnMuteforAllClick,
    handleRemoteMemberRemoveClick,
  } = useAgora(client, screenClient, props);

  const dispatch = useDispatch();
  const { videos, screenStream, channel, whiteboardDrawings, whiteboardEnabled, mode } = useSelector((state: RootState) => state.meeting);
  const whiteboardCanvasService = new WhiteboardCanvasService();
  const whiteboardDrawingService = new WhiteboardDrawingService();
  const alert = useAlert();
  const getVideos = () => {
    if (videos.length !== 0) return videos.map((vi) => video(vi.stream, vi.v_id, isHost(vi.v_id), vi.raisehand));
    return [];
  };

  const canScreenShare = () => {
    const video = screenStream;
    if (video) return true;
    return false;
  };
  const canEnableWhiteboard = () => {
    return !whiteboardEnabled;
  };

  const getScreenShareVideo = (): VideoState | null => {
    return screenStream;
  };

  const getActiveVideo = (): VideoState | null | undefined => {
    if (canScreenShare()) {
      return getScreenShareVideo();
    }
    const vid = find(videos, { active: true });
    if (vid) {
      return { ...(vid as any) };
    }
    return;
  };

  const isHost = (userId: any) => {
    return localVideoId === userId;
  };

  const ActiveVideoBlock = () => {
    const activeVideo = getActiveVideo();
    switch (mode) {
      case 'image':
        return <DragDrop />;
      case 'pdf':
        return 0;
      case 'screenshare':
        return (
          activeVideo && (
            <ActiveVideoElement
              id={activeVideo.v_id}
              videoTrack={activeVideo.stream.video}
              audioTrack={activeVideo.stream.audio}></ActiveVideoElement>
          )
        );
      case 'video':
        return 0;
      case 'whiteboard':
        return (
          <Whiteboard
            drawings={whiteboardDrawings}
            handleCanvasClearClick={handleWhiteboardCanvasClearClick}
            handleDrawingAdd={handleWhiteboardDrawingAdd}
          />
        );
    }
  };

  const handleRemoteWhiteboardCanvasClear = useCallback(
    (meetingId: string) => {
      socket.whiteboardCanvasClear.subscribe(meetingId, () => {
        whiteboardCanvasService.clear();
        dispatch(replaceWhiteboardDrawings([]));
      });
    },
    [channel]
  );

  const handleWhiteboardCanvasClearClick = useCallback(() => {
    socket.whiteboardCanvasClear.publish(channel);
  }, [channel]);

  const handleRemoteWhiteboardDrawingAdd = (meetingId: string) => {
    socket.whiteboardDrawingAdd.subscribe(meetingId, (drawing) => {
      const isDrawingExists = whiteboardDrawingService.isExists(drawing);
      if (!isDrawingExists) {
        whiteboardDrawingService.parse(drawing, (drawings) => {
          whiteboardDrawingService.add(drawings);
        });
      }
    });
  };

  const handleRemoteMeetingMode = (meetingId: string) => {
    socket.meetingMode.subscribe(meetingId, (mode) => {
      dispatch(replaceMeetingMode(mode));
    });
  };

  const handleRemoteWhiteboardEnabled = (meetingId: string) => {
    socket.whiteboardEnabled.subscribe(meetingId, (whiteboardEnabled) => {
      dispatch(replaceWhiteboardEnabled(whiteboardEnabled));
    });
  };

  const handleWhiteboardClick = () => {
    if (canScreenShare()) {
      stopScreenShare();
    }
    socket.whiteboardEnabled.publish(channel, true);
    socket.meetingMode.publish(channel, 'whiteboard');
  };

  const handleWhiteboardDrawingAdd = useCallback(
    (event: IEvent) => {
      const drawing = event.target as MeetingWhiteboardDrawingState;
      dispatch(pushWhiteboardDrawing(drawing));
      socket.whiteboardDrawingAdd.publish(channel, drawing);
    },
    [channel]
  );

  const handleRemoteImageModeClick = () => {
    dispatch(replaceMeetingMode('image'));
    socket.whiteboardEnabled.publish(channel, false);
    socket.meetingMode.publish(channel, 'image');
  };

  const handleOnRemoteImage = (meetingId: string) => {
    socket.shareImageToPeer.subscribe(meetingId, (payload) => {
      dispatch(replaceMeetingImage(payload));
    });
  };

  const video = (stream: streamInterface, id: string | number, muted: Boolean, visibility: Boolean) => {
    return (
      <MediaPlayer
        id={id}
        videoTrack={stream.video}
        audioTrack={stream.audio}
        raiseHandvisibility={visibility}
        muted={muted}
        // handleRemoteActiveVideoClick={handleRemoteActiveVideoClick}
      ></MediaPlayer>
    );
  };

  const canMuteVideo = (Id: number) => {
    return !videos[Id]?.mediaStatus.videoMuted;
  };
  const canMuteAudio = (Id: number) => {
    return !videos[Id]?.mediaStatus.audioMuted;
  };
  const canRemoveRaiseHand = (Id: number) => {
    return videos[Id]?.raisehand;
  };
  const canImageUpload = () => {
    return mode === 'image' ? false : true;
  };

  const inviteText = () => {
    if (process.env.NODE_ENV === 'development') {
      const url = `https://192.168.100.55:3000`;
      return `${url}/join?id=${channel}`;
    } else {
      const url = `https://${process.env.REACT_APP_HOST}`;
      return `Hi there,\n Jump into Stagetrack Studio - ${url}/join?id=${channel}`;
    }
  };

  useEffect(() => {
    if (!channel) {
      leave();
    } else {
      try {
        join(appid, channel, token);
      } catch (err) {
        leave();
      }
    }

    handleOnRemoteImage(channel);
    handleRemoteWhiteboardCanvasClear(channel);
    handleRemoteWhiteboardDrawingAdd(channel);
    handleRemoteWhiteboardEnabled(channel);
    handleRemoteMeetingMode(channel);

    return () => {
      leave();
    };
  }, []);

  return (
    <div>
      <GridContainer
        values={videos.length}
        videos={getVideos()}
        meetingVideos={videos}
        canMuteVideo={canMuteVideo}
        canMuteAudio={canMuteAudio}
        canImageUpload={canImageUpload}
        canRemoveRaiseHand={canRemoveRaiseHand}
        activeVideo={ActiveVideoBlock()}
        canScreenShare={canScreenShare()}
        canEnableWhiteboard={canEnableWhiteboard()}
        handleScreenShareClick={() => screenJoin(appid, channel, token)}
        handleStopScreenShareClick={stopScreenShare}
        handleEndMeetingClick={leave}
        handleMuteClick={MuteAudio}
        handleUnMuteClick={unMuteAudio}
        handleMutevideoClick={MuteCamera}
        handleUnMutevideoClick={unMuteCamera}
        inviteText={inviteText()}
        handleRemoteRaiseHandClick={handleRemoteRaiseHandClick}
        changeBorder={handleClickOnVideoBorderChange}
        handleWhiteboardClick={handleWhiteboardClick}
        handleRemoteImageModeClick={handleRemoteImageModeClick}
        handleRemoteMuteforAllClick={handleRemoteMuteforAllClick}
        handleRemoteVideoMuteforAllClick={handleRemoteVideoMuteforAllClick}
        handleRemoteVideoUnMuteforAllClick={handleRemoteVideoUnMuteforAllClick}
        handleRemoteUnMuteforAllClick={handleRemoteUnMuteforAllClick}
        handleRemoteMemberRemoveClick={handleRemoteMemberRemoveClick}
        handleRemotePeerMute={handleRemotePeerMute}
        handleRemotePeerunMute={handleRemotePeerunMute}
      />
    </div>
  );
}

export default Call;
