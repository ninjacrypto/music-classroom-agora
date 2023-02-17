import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Layout } from '~components/layout';
import { DialogContainer } from '~containers/dialog';
import { HandsUpContainer } from '~containers/hand-up';
import { LoadingContainer } from '~containers/loading';
import { NavigationBar } from '~containers/nav';
import { FixedAspectRatioRootBox } from '~containers/root-box';
import { SceneSwitch } from '~containers/scene-switch';
import {
  BottomStudents,
  RightSideStudents,
  RoomMidStreamsContainer,
} from '~containers/stream/room-mid-player';
import { ToastContainer } from '~containers/toast';
import { Award } from '../../containers/award';
import Room from '../room';
import { useStore } from '@/infra/hooks/ui-store';
import { Float } from '~ui-kit';
import { RemoteControlContainer } from '../../containers/remote-control';
// import { ScenesController } from '../../containers/scenes-controller';
import { ScreenShareContainer } from '../../containers/screen-share';
import { WhiteboardToolbar } from '../../containers/toolbar';
import { WidgetContainer } from '../../containers/widget';
import { Chat, Whiteboard } from '../../containers/widget/slots';
import { StreamWindowsContainer } from '../../containers/stream-windows-container';
import { RemoteControlToolbar } from '../../containers/remote-control/toolbar';
import { useInteractiveUIStores } from '@/infra/hooks/ui-store';
import { EduInteractiveUIClassStore } from '@/infra/stores/interactive';
import { useMemo } from 'react';
import {
  TeacherStream,
  // StudentStreams,
  LeftSideStudents,
} from '~containers/stream/room-mid-player';
import { isMobile } from 'react-device-detect';
import './style.css';
import { observer } from 'mobx-react';
import { Sidebar } from './sidebar';

export const WhiteboardContainer = observer(() => {
  const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

  const { carouselStreams } = streamUIStore;

  const values = useMemo(() => {
    return carouselStreams.length + 1 || 1;
  }, [carouselStreams.length]);

  return (
    <React.Fragment>
        <div className={`${values > 1 ? `newMainContentMiddleX${values}` : 'newMainContentRight'}`}>
        <div className="whiteboardContainerBg">
          <img src={'/assets/whiteboardFrame.png'} alt={''} />
        </div>
        <div className="newMainContentRightInner">
          <Layout className={'newMainContentRightInnerTextarea'}>
            <div id="newMainContentRightInnerTextarea" className="newMainContentRightInnerTextarea">
              <div className='chatContainer'>
                <Chat />
              </div>
              <Whiteboard />
              <ScreenShareContainer />
              <RemoteControlContainer />
              <StreamWindowsContainer />

              <WhiteboardToolbar />
              {/* <ScenesController /> */}
              <RemoteControlToolbar />
            </div>
          </Layout>
        </div>
      </div>
    </React.Fragment>
  );
});

export const MidClassScenario = observer(() => {
  // layout
  const layoutCls = classnames('edu-room', 'mid-class-room');
  const { shareUIStore } = useStore();

  const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

  const { carouselStreams } = streamUIStore;

  const values = useMemo(() => {
    return carouselStreams.length + 1 || 1;
  }, [carouselStreams.length]);

  return (
    // <Room>
    //   <FixedAspectRatioRootBox trackMargin={{ top: shareUIStore.navHeight }}>
    //     <SceneSwitch>
    //       <Layout className={layoutCls} direction="col">
    //         <NavigationBar />
    //         <Layout
    //           className="flex-grow items-stretch relative justify-center fcr-room-bg"
    //           direction="col">
    //           <RoomMidStreamsContainer />
    //           <Whiteboard />
    //           <ScreenShareContainer />
    //           <RemoteControlContainer />
    //           <StreamWindowsContainer />
    //         </Layout>
    //         <RemoteControlToolbar />

    // <WhiteboardToolbar />
    // <ScenesController />
    //         <Float bottom={15} right={10} align="flex-end" gap={2}>
    //           <HandsUpContainer />
    //           <Chat />
    //         </Float>
    //         <DialogContainer />
    //         <LoadingContainer />
    //       </Layout>
    // <WidgetContainer />
    // <ToastContainer />
    // <Award />
    //     </SceneSwitch>
    //   </FixedAspectRatioRootBox>
    // </Room>

    <Room>
      <FixedAspectRatioRootBox trackMargin={{ top: shareUIStore.navHeight }}>
        <DialogContainer />
        <LoadingContainer />
        <Float bottom={15} right={10} align="flex-end" gap={2}>
          <HandsUpContainer />
        </Float>

        {isMobile ? (
          <React.Fragment>
            <Sidebar />

            <div className="mobileContainer">
              <div className="banner">
                <img src="/assets/mobileBanner.png" width={'70%'} />
              </div>

              <div
                style={{
                  width: '85%',
                  height: '80vh',
                  background: '#F2F8FA',
                  border: '3px solid #00FCFC',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <div
                  style={{
                    height: '70%',
                    width: '100%',
                    position: 'relative',
                  }}>
                  <WhiteboardContainer />
                </div>
                <div
                  style={{
                    width: '70%',
                    opacity: 1,
                    transform: ' scale(1)',
                    transition: '0.5s',
                    height: '200px',
                    position: 'absolute',
                    top: '70%',
                  }}>
                  <div
                    style={{
                      border: '1px solid #000000',
                      marginBottom: '20px',
                    }}
                  />
                  <TeacherStream />
                </div>
              </div>

              <div className="videoContainerls">
                {carouselStreams.map((video: any, index: number) => (
                  <div className="videoScreen">{video}</div>
                ))}
              </div>

              <div className="footer">
                <img src="/assets/Stagetrack.png" />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <Layout
            className={layoutCls}
            direction="col"
            style={{
              height: '100vh',
              background: 'url(/assets/Frame1.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            <div className="mainTop">
              {values >= 18 ? null : (
                <div id={`newMainContentAreaX${values}`}>
                  {values >= 11 ? (
                    <React.Fragment>
                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          width: '100%',
                        }}>
                        <Sidebar />

                        <div
                          style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                          <NavigationBar />
                          <div className="newMainContentMain">
                            <LeftSideStudents />
                            <WhiteboardContainer />
                            <RightSideStudents />
                          </div>
                          <BottomStudents />
                        </div>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          width: '100%',
                        }}>
                        <Sidebar />

                        <div
                          style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                          <NavigationBar />
                          <div className="newMainContentMain">
                            <LeftSideStudents />
                            <WhiteboardContainer />
                            <RightSideStudents />
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
          </Layout>
        )}

        <WidgetContainer />
        <ToastContainer />
        <Award />
      </FixedAspectRatioRootBox>
    </Room>
  );
});
