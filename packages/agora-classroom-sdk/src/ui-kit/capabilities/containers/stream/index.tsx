import { useStore } from '@/infra/hooks/ui-store';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import { CameraPlaceholderType } from '@/infra/stores/common/type';
import { EduRoleTypeEnum, EduClassroomConfig } from 'agora-edu-core';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import React, { CSSProperties, FC, Fragment, useCallback, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMeasure from 'react-use-measure';
import { useResizeDetector } from 'react-resize-detector';
import { EmotesvgDict1, InstrumentSvgDict } from '../pretest';
import {
  AudioVolume,
  CameraPlaceHolder,
  SoundPlayer,
  SvgaPlayer,
  SvgIconEnum,
  SvgImg,
} from '~ui-kit';
import { useDebounce } from '~ui-kit/utilities/hooks';
import RewardSound from './assets/audio/reward.mp3';
import RewardSVGA from './assets/svga/reward.svga';
import { DragableContainer, DragableStream } from './draggable-stream';
import './index.css';
import { StreamPlayerToolbar } from './stream-tool';
import { TrackPlayer } from './track-player';
import { useSelector } from 'react-redux';

export const AwardAnimations = observer(({ stream }: { stream: EduStreamUI }) => {
  const {
    streamUIStore: { streamAwardAnims, removeAward },
  } = useStore();

  return (
    <div className="center-reward">
      {streamAwardAnims(stream).map((anim: { id: string; userUuid: string }) => {
        return (
          <SvgaPlayer
            key={anim.id}
            style={{ position: 'absolute' }}
            url={RewardSVGA}
            onFinish={() => {
              removeAward(anim.id);
            }}></SvgaPlayer>
        );
      })}

      {streamAwardAnims(stream).map((anim: { id: string; userUuid: string }) => {
        return <SoundPlayer url={RewardSound} key={anim.id} />;
      })}
    </div>
  );
});

export const StreamPlaceholder = observer(
  ({ className, style }: { role: EduRoleTypeEnum; className?: string; style?: CSSProperties }) => {
    const cls = classnames({
      [`${className}`]: !!className,
    });

    return (
      <div style={style} className={cls}>
        <CameraPlaceHolder state={CameraPlaceholderType.notpresent} text={''} />
      </div>
    );
  },
);

const LocalStreamPlayerVolume = observer(({ stream }: { stream: EduStreamUI }) => {
  const { streamUIStore } = useStore();
  const { localVolume, localMicOff } = streamUIStore;

  const isMicMuted = localMicOff ? true : stream.isMicMuted;

  return (
    <AudioVolume
      isMicMuted={isMicMuted}
      currentVolume={Math.floor(localVolume)}
      className={stream.micIconType}
    />
  );
});

const RemoteStreamPlayerVolume = observer(({ stream }: { stream: EduStreamUI }) => {
  const { streamUIStore } = useStore();
  const { remoteStreamVolume } = streamUIStore;

  const volumePercentage = remoteStreamVolume(stream);

  return (
    <AudioVolume
      isMicMuted={stream.isMicMuted}
      currentVolume={Math.floor(volumePercentage)}
      className={stream.micIconType}
    />
  );
});

const StreamPlayerWhiteboardGranted = observer(({ stream }: { stream: EduStreamUI }) => {
  const {
    streamUIStore: { whiteboardGrantUsers },
  } = useStore();

  const isTeacherOrAssistant = [EduRoleTypeEnum.teacher, EduRoleTypeEnum.assistant].includes(
    stream.role,
  );

  return (
    <>
      {!isTeacherOrAssistant && whiteboardGrantUsers.has(stream.fromUser.userUuid) ? (
        <SvgImg size={22} type={SvgIconEnum.AUTHORIZED_SOLID} colors={{ iconPrimary: '#FFF500' }} />
      ) : null}
    </>
  );
});

const StreamPlayerOverlayAwardNo = observer(({ stream }: { stream: EduStreamUI }) => {
  const {
    streamUIStore: { awards },
  } = useStore();
  return (
    <>
      {stream.role !== EduRoleTypeEnum.teacher ? (
        <>
          <SvgImg className="stars" type={SvgIconEnum.STAR} colors={{ iconPrimary: '#f58723' }} />
          <span className="stars-label">x {awards(stream)}</span>
        </>
      ) : null}
    </>
  );
});

const StreamPlayerCameraPlaceholder = observer(({ stream }: { stream: EduStreamUI }) => {
  const { streamUIStore } = useStore();
  const { cameraPlaceholder } = streamUIStore;
  return (
    <CameraPlaceHolder style={{ position: 'absolute', top: 0 }} state={cameraPlaceholder(stream)} />
  );
});

const StreamPlaceholderWaveArmPlaceholder = observer(({ stream }: { stream: EduStreamUI }) => {
  const { streamUIStore } = useStore();
  const { isWaveArm } = streamUIStore;
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (isWaveArm(stream)) {
      setShowTip(true);
      const timer = setTimeout(() => {
        setShowTip(false);
        clearTimeout(timer);
      }, 3 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isWaveArm(stream)]);

  return showTip && isWaveArm(stream) ? <div className="wave-arm-placeholder"></div> : null;
});

const StreamPlayerOverlayName = observer(({ stream }: { stream: EduStreamUI }) => {
  return (
    <span title={stream.stream.fromUser.userName} className="username2 pointer-events-auto">
      {stream.stream.fromUser.userName}
    </span>
  );
});

export const StreamPlayerOverlay = observer(
  ({ stream, borderColor }: { stream: EduStreamUI; borderColor?: any }) => {
    const { streamUIStore } = useStore();
    const { layerItems } = streamUIStore;

    const rewardVisible = layerItems && layerItems.includes('reward');

    const grantVisible = layerItems && layerItems.includes('grant');

    return (
      <div
        className="video-player-overlay z-10 pointer-events-none"
        style={{ border: `5px solid ${borderColor ?? '#346af4'}` }}>
        <AwardAnimations stream={stream} />
        <div className="top-right-info">
          {rewardVisible && <StreamPlayerOverlayAwardNo stream={stream} />}
        </div>
        <div className="bottom-left-info">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            {stream.stream.isLocal ? (
              <LocalStreamPlayerVolume stream={stream} />
            ) : (
              <RemoteStreamPlayerVolume stream={stream} />
            )}
          </div>
          <StreamPlayerOverlayName stream={stream} />
        </div>
        <div className="bottom-right-info">
          {grantVisible && <StreamPlayerWhiteboardGranted stream={stream} />}
        </div>
        <StreamPlaceholderWaveArmPlaceholder stream={stream} />
      </div>
    );
  },
);

export const StreamPlayer: FC<{
  stream: EduStreamUI;
  renderAt: 'Window' | 'Bar';
  style?: CSSProperties;
  toolbarDisabled?: boolean;
}> = observer(({ stream, style, renderAt, toolbarDisabled }) => {
  const { streamWindowUIStore } = useStore();
  const { visibleStream } = streamWindowUIStore;
  const hasDetached = visibleStream(stream.stream.streamUuid);
  const isBarPlayer = renderAt === 'Bar';
  const shouldRenderVideo = renderAt === stream.renderAt;
  // during dragging
  const invisible = hasDetached && isBarPlayer;

  // should render an empty DOM instead of the stream video, which has the same dimensions to the stream video
  // when:
  // the stream video is detached from bar
  // and
  // the current player is render at bar
  const [toolbarVisible, setToolbarVisible] = useState(false);

  const handleMouseEnter = () => {
    setToolbarVisible(true);
  };
  const handleMouseLeave = () => {
    setToolbarVisible(false);
  };

  const globalStore = useSelector((state: any) => state.StickerSlice);

  const roomIndex = globalStore.findIndex((item: any) =>
    item?.roomId ? item?.roomId === EduClassroomConfig.shared.sessionInfo.roomName : 0,
  );
  const userProfileFinder = (userId: any) =>
    globalStore[roomIndex]?.students?.find((item: any) => item.userId === userId) ??
    globalStore[roomIndex]?.teachers.find((item: any) => item.userId === userId);

  const currentUser = userProfileFinder(stream.fromUser.userName);

  const { height = 0, ref: resizeRef } = useResizeDetector();

  const teacherAssignedEmojis = currentUser?.stickers?.teacherAssignedEmojis || [];
  const userAssignedEmojis = currentUser?.stickers?.emojis || [];
  const teacherAssignedInstruments = currentUser?.stickers?.teacherAssignedInstrument || [];
  const userAssignedInstruments = currentUser?.stickers?.instruments || [];

  let mergedInstrument = [...new Set(userAssignedInstruments.concat(teacherAssignedInstruments))];
  const mergedEmojis = [...new Set(teacherAssignedEmojis.concat(userAssignedEmojis))];

  // React.useEffect(() => {
  //   if ([...new Set(teacherAssignedEmojis.concat(userAssignedEmojis))].includes('Crown')) {
  //     const filteredArr = [...new Set(teacherAssignedEmojis.concat(userAssignedEmojis))]?.filter(
  //       (item) => item !== 'Crown',
  //     );
  //     const arrCenter = Math.floor([...filteredArr].length / 2);
  //     filteredArr.splice(arrCenter, 0, 'Crown');
  //     setmergedEmojis(filteredArr);
  //     return;
  //   }
  //   setmergedEmojis([...new Set(teacherAssignedEmojis.concat(userAssignedEmojis))]);
  // }, [teacherAssignedEmojis, userAssignedEmojis]);

  return (
    <div
      className="fcr-stream-player-container"
      ref={resizeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {!invisible && (
        <React.Fragment>
          <div className={'EmojiVideoCaptureContainer'}>
            {/* this section for stickers other than  'SunSunglasses', 'HappyBirthday', 'Dog', 'Dancer'*/}
            {mergedEmojis?.map(
              (item: any, index: number) =>
                !['SunSunglasses', 'HappyBirthday', 'Dog', 'Dancer'].includes(item) && (
                  <div key={`${item}${index}`}>
                    <img id={`${item}`} src={EmotesvgDict1[item]} style={{ width: height * 0.2 }} />
                  </div>
                ),
            )}

            {mergedEmojis?.map(
              (item: any, index: number) =>
                ['Dog', 'Dancer'].includes(item) && (
                  <div key={`${item}${index}`}>
                    <img
                      id={`${item}`}
                      src={EmotesvgDict1[item]}
                      style={{ width: height * (item === 'Dancer' ? 0.15 : 0.1) }}
                    />
                  </div>
                ),
            )}
            {/* this section for only 'HappyBirthday' */}
            {mergedEmojis?.map(
              (item: any, index: number) =>
                item === 'HappyBirthday' && (
                  <div key={`${item}`}>
                    <img
                      id={`${item}`}
                      src={EmotesvgDict1['HappyBirthday']}
                      style={{ width: height * 0.2 }}
                    />
                  </div>
                ),
            )}
          </div>
          {/* this section for SunSunglasses */}
          <div className={'InstrumentSun'}>
            {mergedEmojis?.map(
              (item: any, index: number) =>
                item === 'SunSunglasses' && (
                  <div key={`${item}${index}`}>
                    <img
                      id={`${item}`}
                      src={EmotesvgDict1['SunSunglasses']}
                      style={{ width: '2.5vw' }}
                    />
                  </div>
                ),
            )}
          </div>

          <StreamPlayerCameraPlaceholder stream={stream} />
          {shouldRenderVideo && <TrackPlayer stream={stream} />}
          {shouldRenderVideo && (
            <StreamPlayerOverlay stream={stream} borderColor={currentUser?.borderColor?.hex} />
          )}
          {shouldRenderVideo && !toolbarDisabled && (
            <StreamPlayerToolbar stream={stream} visible={toolbarVisible} />
          )}

          <div className={'InstrumentVideoCaptureContainer'}>
            {mergedInstrument?.map(
              (item: any, index: number) =>
                !['Guitar', 'Piano1'].includes(item) && (
                  <div key={`${item}${index}`} style={{ width: height * 0.2 }}>
                    <img id={`${item}`} src={InstrumentSvgDict[item]} />
                  </div>
                ),
            )}

            {mergedInstrument?.map(
              (item: any, index: number) =>
                item === 'Piano1' && (
                  <div key={`${item}${index}`} style={{ width: height * 0.09 }}>
                    <img id={`${item}`} src={InstrumentSvgDict[item]} />
                  </div>
                ),
            )}
          </div>

          <div className="IntsrumentGuitar">
            {mergedInstrument?.map(
              (item: any, index: number) =>
                item === 'Guitar' && (
                  <div key={`${item}${index}`}>
                    <img id={`${item}`} src={InstrumentSvgDict[item]} />
                  </div>
                ),
            )}
          </div>
        </React.Fragment>
      )}
      {/* <DragableContainer stream={stream} borderColor={currentUser?.borderColor?.hex} /> */}
      <MeasuerContainer streamUuid={stream.stream.streamUuid} style={style} />
    </div>
  );
});

type StreamPlayerH5Props = {
  stream: EduStreamUI;
  toolbarDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const StreamPlayerH5 = observer<FC<StreamPlayerH5Props>>(
  ({ stream, toolbarDisabled = true, className = '', style }) => {
    const [toolbarVisible, setToolbarVisible] = useState(false);

    const handleMouseEnter = () => {
      setToolbarVisible(true);
    };

    const handleMouseLeave = () => {
      setToolbarVisible(false);
    };

    return (
      <div
        className={`fcr-stream-player-h5 ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <StreamPlayerCameraPlaceholder stream={stream} />
        <TrackPlayer stream={stream} />
        <StreamPlayerOverlay stream={stream} />
        {!toolbarDisabled && <StreamPlayerToolbar stream={stream} visible={toolbarVisible} />}
      </div>
    );
  },
);

const ANIMATION_DELAY = 500;

export const carouselGroup = (
  videoWidth: number,
  videoHeight: number,
  carouselStreams: EduStreamUI[],
  gap: number,
) => {
  // const fullWith = (videoWidth + gap) * carouselStreams.length - gap + 2;

  // const width = useDebounce(carouselStreams.length ? fullWith : 0, ANIMATION_DELAY);

  return carouselStreams.map((stream: EduStreamUI, idx: number) => {
    const style = {
      marginRight: idx === carouselStreams.length - 1 ? 0 : gap - 2,
    };

    const playerStyle = {
      width: videoWidth,
      height: videoHeight,
    };

    return (
      <CSSTransition
        key={`carouse-${stream.stream.streamUuid}`}
        timeout={ANIMATION_DELAY}
        classNames="stream-player">
        <DragableStream stream={stream} style={style} playerStyle={playerStyle} />
      </CSSTransition>
    );
  });
};

export const NavGroup: FC<{ onNext: () => void; onPrev: () => void; visible: boolean }> = ({
  onNext,
  onPrev,
  visible,
}) => {
  const ANIMATION_DELAY = 200;
  return (
    <Fragment>
      <CSSTransition timeout={ANIMATION_DELAY} classNames="carousel-nav" in={visible}>
        <div className="carousel-prev" onClick={onPrev}>
          <SvgImg type={SvgIconEnum.BACKWARD} size={35} />
        </div>
      </CSSTransition>
      <CSSTransition timeout={ANIMATION_DELAY} classNames="carousel-nav" in={visible}>
        <div className="carousel-next" onClick={onNext}>
          <SvgImg type={SvgIconEnum.FORWARD} size={35} />
        </div>
      </CSSTransition>
    </Fragment>
  );
};

export const MeasuerContainer: FC<{
  streamUuid: string;
  style?: CSSProperties;
}> = observer(({ streamUuid, style }) => {
  const [ref, bounds] = useMeasure();
  const {
    streamUIStore: { setStreamBoundsByStreamUuid },
  } = useStore();

  const handleStreamBoundsUpdate = useCallback(
    debounce((id, bounds) => {
      setStreamBoundsByStreamUuid(id, bounds);
    }, 330),
    [],
  );

  useEffect(
    debounce(() => {
      streamUuid && handleStreamBoundsUpdate(streamUuid, bounds);
    }, 330),
    [bounds],
  );
  return <div className="stream-player-placement" style={style} ref={ref} />;
});
