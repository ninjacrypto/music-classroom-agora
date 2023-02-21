import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import './index.css';

import { InstrumentSvgDict, EmotesvgDict } from '@/ui-kit/capabilities/containers/pretest';
import { transI18n } from '~ui-kit';

import { isMobile } from 'react-device-detect';

import { useStore } from '@/infra/hooks/ui-store';

import { AgoraEduSDK } from '@/infra/api';
import { WaveArmListContainer } from '@/ui-kit/capabilities/containers/hand-up';
import { observer } from 'mobx-react';
import { useInteractiveUIStores } from '@/infra/hooks/ui-store';
import { EduInteractiveUIClassStore } from '@/infra/stores/interactive';
import { EduClassroomConfig, EduRoleTypeEnum } from 'agora-edu-core';

import '../burgerMenu/index.css';
import { slide as Menu } from 'react-burger-menu';
import { useMusicFunRtmContext } from '@/mf-rtm';
import { useSelector } from 'react-redux';
import { AgoraRteEngineConfig, AgoraRteRuntimePlatform } from 'agora-rte-sdk';

import { EduNavAction, EduNavRecordActionPayload } from '@/infra/stores/common/nav-ui';
import {
  Header,
  Inline,
  Popover,
  SvgImg,
  Tooltip,
  Button,
  SvgaPlayer,
  SvgIcon,
  Card,
  Layout,
  SvgIconEnum,
  useI18n,
} from '~ui-kit';
import { RecordStatus } from 'agora-edu-core';
import RecordLoading from '../../../containers/nav/assets/svga/record-loading.svga';
import '../../../containers/nav/index.css';
import { visibilityControl, visibilityListItemControl } from '../../../containers/visibility';
import {
  roomNameEnabled,
  networkStateEnabled,
  scheduleTimeEnabled,
  headerEnabled,
  cameraSwitchEnabled,
  microphoneSwitchEnabled,
} from '../../../containers/visibility/controlled';
import classNames from 'classnames';
import { InteractionStateColors } from '~ui-kit/utilities/state-color';
import ClipboardJS from 'clipboard';
import md5 from 'js-md5';
import { Chat } from '@/ui-kit/capabilities/containers/widget/slots';

const SignalContent = observer(() => {
  const { navigationBarUIStore } = useStore();
  const { networkQualityLabel, delay, packetLoss } = navigationBarUIStore;
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="biz-col label left">{transI18n('signal.status')}:</td>
            <td className="biz-col value left">{networkQualityLabel}</td>
            <td className="biz-col label right">{transI18n('signal.delay')}:</td>
            <td className="biz-col value right">{delay}</td>
          </tr>
          <tr>
            <td className="biz-col label left">{transI18n('signal.lose')}:</td>
            <td className="biz-col value left">{packetLoss}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
});

const SignalQuality = visibilityControl(
  observer(() => {
    const { navigationBarUIStore } = useStore();
    const { networkQualityClass, networkQualityIcon } = navigationBarUIStore;

    return (
      <Popover content={<SignalContent />} placement="bottomLeft">
        <div className={`biz-signal-quality ${networkQualityClass}`}>
          <SvgImg
            className="cursor-pointer"
            type={networkQualityIcon.icon}
            colors={{ iconPrimary: networkQualityIcon.color }}
            size={24}
          />
        </div>
      </Popover>
    );
  }),
  networkStateEnabled,
);

const ScheduleTime = visibilityControl(
  observer(() => {
    const { navigationBarUIStore } = useStore();
    const { classStatusText, classStatusTextColor } = navigationBarUIStore;
    return <Inline color={classStatusTextColor}>{classStatusText}</Inline>;
  }),
  scheduleTimeEnabled,
);

const RoomName = visibilityControl(
  observer(() => {
    const { navigationBarUIStore } = useStore();
    const { navigationTitle } = navigationBarUIStore;
    return <React.Fragment> {navigationTitle}</React.Fragment>;
  }),
  roomNameEnabled,
);

const ScreenShareTip = observer(() => {
  const { navigationBarUIStore } = useStore();
  const { currScreenShareTitle } = navigationBarUIStore;
  return currScreenShareTitle ? (
    <div className="fcr-biz-header-title-share-name">{currScreenShareTitle}</div>
  ) : null;
});

const StartButton = observer(() => {
  const { navigationBarUIStore } = useStore();
  const { isBeforeClass, startClass } = navigationBarUIStore;
  return isBeforeClass ? (
    <Button size="xs" onClick={() => startClass()}>
      {transI18n('begin_class')}
    </Button>
  ) : null;
});

const RoomState = () => {
  return (
    <React.Fragment>
      <div className="fcr-biz-header-title">
        <ScreenShareTip />
        <RoomName />
      </div>
      <div className="fcr-biz-header-split-line"></div>
      <div className="fcr-biz-header-title fcr-biz-subtitle">
        <ScheduleTime />
      </div>
      <StartButton />
    </React.Fragment>
  );
};

const Actions = observer(() => {
  const { navigationBarUIStore } = useStore();
  const { actions } = navigationBarUIStore;

  return (
    <React.Fragment>
      {actions.length
        ? actions.map(
            (a) =>
              // a.id === 'Record' ? (
              //   <NavigationBarRecordAction
              //     key={a.iconType}
              //     action={a as EduNavAction<EduNavRecordActionPayload>}
              //   />
              // ) : (
              a.id === 'Settings' && (
                <NavigationBarAction key={a.iconType} action={a as EduNavAction} />
              ),
            // ),
          )
        : null}
    </React.Fragment>
  );
});

const ShareCard = observer(() => {
  const { navigationBarUIStore, shareUIStore } = useStore();
  const cls = classNames('absolute z-20', {});
  const { roomName } = EduClassroomConfig.shared.sessionInfo;
  const copyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (copyRef.current) {
      const clipboard = new ClipboardJS(copyRef.current);
      clipboard.on('success', function (e) {
        shareUIStore.addToast(transI18n('fcr_copy_success'));
        navigationBarUIStore.closeShare();
      });
      clipboard.on('error', function (e) {
        shareUIStore.addToast('Failed to copy');
      });
      return () => {
        clipboard.destroy();
      };
    }
  }, []);

  const t = useI18n();

  return (
    <Card
      className={cls}
      style={{
        display: navigationBarUIStore.shareVisible ? 'block' : 'none',
        right: 42,
        top: 30,
        padding: 20,
        borderRadius: 10,
      }}>
      <Layout direction="col">
        <Layout className="justify-between">
          <span className="text-14 whitespace-nowrap">{t('fcr_copy_room_name')}</span>
          <span
            style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}
            title={roomName}>
            {roomName}
          </span>
        </Layout>
        <Layout className="justify-between mt-3">
          <span className="text-14 whitespace-nowrap">{t('fcr_copy_share_link')}</span>
          <Button type="ghost" style={{ marginLeft: 40 }} size="xs">
            <Layout className="mx-4 items-center">
              <SvgImg
                type={SvgIconEnum.LINK_SOLID}
                colors={{ iconPrimary: InteractionStateColors.allow }}
                size={16}
              />
              <span
                ref={copyRef}
                data-clipboard-text={`${AgoraEduSDK.shareUrl}`}
                className="text-12 cursor-pointer whitespace-nowrap"
                style={{ color: InteractionStateColors.allow, marginLeft: 4 }}>
                {t('fcr_copy_share_link_copy')}
              </span>
            </Layout>
          </Button>
        </Layout>
      </Layout>
    </Card>
  );
});

const NavigationBarRecordAction = observer(
  ({ action }: { action: EduNavAction<EduNavRecordActionPayload> }) => {
    const { payload } = action;
    return payload ? (
      <div className="flex items-center">
        {payload.recordStatus === RecordStatus.started && (
          <i className="record-heartbeat animate-pulse"></i>
        )}
        {payload.text && <span className="record-tips">{payload.text}</span>}
        {payload.recordStatus === RecordStatus.starting ? (
          <SvgaPlayer className="record-icon" url={RecordLoading} width={18} height={18} loops />
        ) : (
          <Tooltip key={action.title} title={action.title} placement="bottom">
            <div className="action-icon record-icon">
              <SvgIcon
                colors={{ iconPrimary: action.iconColor }}
                type={action.iconType}
                hoverType={action.iconType}
                size={18}
                onClick={action.onClick}
              />
            </div>
          </Tooltip>
        )}
      </div>
    ) : null;
  },
);

export const NavigationBarAction = visibilityListItemControl(
  observer(({ action }: { action: EduNavAction }) => {
    return (
      <Tooltip title={action.title} placement="bottom">
        <div className="action-icon">
          <SvgIcon
            colors={{ iconPrimary: action.iconColor }}
            type={action.iconType}
            hoverType={action.iconType}
            size={18}
            onClick={action.onClick}
          />
        </div>
      </Tooltip>
    );
  }),
  (uiConfig, { action }) => {
    if (action.id === 'Camera' && !cameraSwitchEnabled(uiConfig)) {
      return false;
    }
    if (action.id === 'Mic' && !microphoneSwitchEnabled(uiConfig)) {
      return false;
    }
    return true;
  },
);

export const Stickers = observer((props: any) => {
  const { publishStickerToSocket, publishChatWidget } = useMusicFunRtmContext();
  const globalStore = useSelector((state: any) => state.StickerSlice);

  const roomIndex = globalStore.findIndex((item: any) =>
    item?.roomId ? item?.roomId === EduClassroomConfig.shared.sessionInfo.roomName : 0,
  );
  const userProfileFinder = (userId: any) =>
    globalStore[roomIndex]?.students?.find((item: any) => item.userId === userId) ??
    globalStore[roomIndex]?.teachers.find((item: any) => item.userId === userId);

  const currentUser = userProfileFinder(EduClassroomConfig.shared.sessionInfo.userName);

  const title = EduRoleTypeEnum.teacher? 'Admin' : ''

  const getActiveInstrumentClassName = (item: any) => {
    return currentUser?.stickers?.instruments?.includes(item);
  };

  const getActiveEmojiClassName = (item: any) => {
    return currentUser?.stickers?.emojis?.includes(item);
  };

  const onInstrumentIconClick = (event: any) => {
    const { id } = event.target;

    publishStickerToSocket(
      'updateStickers',
      {
        userId: currentUser?.userId,
        role: currentUser?.role,
        stickerType: 'instruments',
        instruments: currentUser?.stickers?.instruments ?? [],
        newSticker: id,
      },
      EduClassroomConfig.shared.sessionInfo.roomName,
    );
  };

  const onEmojiIconClick = (event: any) => {
    const { id } = event.target;

    publishStickerToSocket(
      'updateStickers',
      {
        userId: currentUser?.userId,
        role: currentUser?.role,
        stickerType: 'emojis',
        emojis: currentUser?.stickers?.emojis ?? [],
        newSticker: id,
      },
      EduClassroomConfig.shared.sessionInfo.roomName,
    );
  };

  return (
    <div
      style={{
        paddingRight: '2px',
        background: 'linear-gradient(225deg, #fbfcd1, #000000)',
        height: '100%',
      }}>
      <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
        <a className="closebtn" onClick={() => props.handleOnOpenNav()}>
          &times;
        </a>
        <div className="headerTitle">{title} Back Stage</div>
        <div
          style={{
            height: '70vh',
            overflowY: 'scroll',
            textAlign: 'center',
          }}>
          <text
            style={{
              fontFamily: 'Risque',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              textAlign: 'center',
            }}>
            Emojis
            <div className={'guestList_divider'} />
          </text>

          <div
            style={{
              width: 150,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              columnGap: 20,
              rowGap: 10,
              height: 200,
            }}>
            {Object.keys(EmotesvgDict).map((item: any, index: number) => (
              <div
                key={`${item}${index}`}
                className={getActiveEmojiClassName(item) ? 'inactive' : 'active'}
                onClick={onEmojiIconClick}>
                <img id={`${item}`} src={EmotesvgDict[item]} width={50} height={50} />
              </div>
            ))}
            <text
              style={{
                fontFamily: 'Risque',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '20px',
                textAlign: 'center',
                // color: ' #fbff49',
              }}>
              Instruments
              <div className={'guestList_divider'} />
            </text>

            <div
              style={{
                width: 150,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',

                columnGap: 20,
                rowGap: 10,
                height: 200,
              }}>
              {Object.keys(InstrumentSvgDict).map((item: any, index: number) => (
                <div
                  key={`${item}${index}`}
                  className={getActiveInstrumentClassName(item) ? 'inactive' : 'active'}
                  onClick={onInstrumentIconClick}>
                  <img id={`${item}`} src={InstrumentSvgDict[item]} width={50} height={50} />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '30%',
              transform: 'rotate(180deg)',
              cursor: 'pointer',
            }}>
            <img
              src={'/assets/loginbtn.png'}
              onClick={() => {
                props.setSidebarType(null);
              }}
              alt={''}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const Messages = observer((props: any) => {
  const { publishChatWidget } = useMusicFunRtmContext();
  const { role } = EduClassroomConfig.shared.sessionInfo;
  const showAdminPanel = role === EduRoleTypeEnum.teacher ? true : false;
  const title = showAdminPanel? 'Admin' : ''


  useEffect(() => {
    showAdminPanel && publishChatWidget(
      'updateChatWidget',
      { toggle: false },
      EduClassroomConfig.shared.sessionInfo.roomName,
    );
  }, [])

  return (
    <div
      style={{
        paddingRight: '2px',
        background: 'linear-gradient(225deg, #fbfcd1, #000000)',
        height: '100%',
      }}>
      <div
        id="mySidepanel"
        style={{ color: 'white', padding: 20 }}
        className="sidepanel">
        <div className="headerTitle"> {title} Back Stage</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '30px',
            marginTop: '30px',
            textAlign: 'center',
          }}>
          <text
            style={{
              fontFamily: 'Risque',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              textAlign: 'center',
            }}>
            Message
          </text>
          <Chat />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '30%',
              transform: 'rotate(180deg)',
              cursor: 'pointer',
            }}>
            <img
              src={'/assets/loginbtn.png'}
              onClick={() => {
                showAdminPanel && publishChatWidget(
                  'updateChatWidget',
                  { toggle: true },
                  EduClassroomConfig.shared.sessionInfo.roomName,
                );
                props.setSidebarType(null);
              }}
              alt={''}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const Sidebar = observer(() => {
  const [openNav, setOpenNav] = useState(false);

  const [sidebarType, setSidebarType] = useState<string | null>(null);
  const { navigationBarUIStore, shareUIStore, widgetUIStore } = useStore();
  const { actions } = navigationBarUIStore;
  let mfwmloCopy = useRef<HTMLSpanElement>(null);
  let sorCopy = useRef<HTMLSpanElement>(null);

  const { publishChatWidget } = useMusicFunRtmContext();


  const { role } = EduClassroomConfig.shared.sessionInfo;

  const showAdminPanel = role === EduRoleTypeEnum.teacher ? true : false;

  const region = localStorage.getItem('home_store_demo_launch_region');
  const language = localStorage.getItem('home_store_demo_launch_language');

  const { roomName, roomType } = EduClassroomConfig.shared.sessionInfo;

  const password = md5('richardKagan123@');

  const handleOnOpenNav = () => {
    setOpenNav(!openNav);
  };

  const handleStateChange = (state: any) => {
    setOpenNav(state.isOpen);
  };

  const handleOnSidebarToolsClick = (type: string) => {
    setSidebarType(type);
  };

  const handleInviteMemberToMFWMLOClick = () => {
    try {
      const shareUrl =
        AgoraRteEngineConfig.platform === AgoraRteRuntimePlatform.Electron
          ? ''
          : `${location.origin}${
              location.pathname
            }?roomName=${roomName}&roomType=${roomType}&region=${region?.replace(
              /"/g,
              '',
            )}&language=${language?.replace(/"/g, '')}&roleType=${
              EduRoleTypeEnum.student
            }&companyId=${''}&projectId=${''}&classType=MFWMLO&password=${password}#/share`;
      navigator.clipboard.writeText(shareUrl);
      shareUIStore.addToast(transI18n('fcr_copy_success'));
      navigationBarUIStore.closeShare();
    } catch (err: any) {
      shareUIStore.addToast('Failed to copy');
    }
  };

  const handleInviteMemberToSORClick = () => {
    try {
      const shareUrl =
        AgoraRteEngineConfig.platform === AgoraRteRuntimePlatform.Electron
          ? ''
          : `${location.origin}${
              location.pathname
            }?roomName=${roomName}&roomType=${roomType}&region=${region?.replace(
              /"/g,
              '',
            )}&language=${language?.replace(/"/g, '')}&roleType=${
              EduRoleTypeEnum.student
            }&companyId=${''}&projectId=${''}&classType=SOR&password=${password}#/share`;
      navigator.clipboard.writeText(shareUrl);
      shareUIStore.addToast(transI18n('fcr_copy_success'));
      navigationBarUIStore.closeShare();
    } catch (err: any) {
      shareUIStore.addToast('Failed to copy');
    }
  };

  // const HandleMobileMenu = observer(() => {
  //   const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

  //   const { carouselStreams, teacherCameraStream } = streamUIStore;

  //   switch (showAdminPanel) {
  //     case true:
  //       switch (sidebarType) {
  //         case 'Tools':
  //           return (
  //             <div
  //               style={{
  //                 paddingRight: '2px',
  //                 background: 'linear-gradient(225deg, #fbfcd1, #000000)',
  //                 height: '100%',
  //               }}>
  //               <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
  //                 <div className="headerTitle">Admin Back Stage</div>
  //                 <div
  //                   style={{
  //                     display: 'flex',
  //                     flexDirection: 'column',
  //                     rowGap: '30px',
  //                     marginTop: '30px',
  //                     textAlign: 'center',
  //                   }}>
  //                   <text
  //                     style={{
  //                       fontFamily: 'Risque',
  //                       fontStyle: 'normal',
  //                       fontWeight: 'normal',
  //                       fontSize: '20px',
  //                       textAlign: 'center',
  //                     }}>
  //                     Tools
  //                     <div className={'guestList_divider'} />
  //                   </text>

  //                   {actions.length
  //                     ? actions.map((a) =>
  //                         a.id === 'Share' ? (
  //                           <span
  //                             ref={mfwmloCopy}
  //                             className={`MenuItemforSubMenu active`}
  //                             data-clipboard-text={`${AgoraEduSDK.shareUrl}`}
  //                             onClick={handleInviteMemberToMFWMLOClick}>
  //                             Invite to MFWMLO
  //                           </span>
  //                         ) : a.id === 'Exit' ? (
  //                           <span
  //                             ref={sorCopy}
  //                             className={`MenuItemforSubMenu active`}
  //                             data-clipboard-text={`${AgoraEduSDK.shareUrl}`}
  //                             onClick={handleInviteMemberToSORClick}>
  //                             Invite to SOR
  //                           </span>
  //                         ) : (
  //                           a.id === 'Record' && (
  //                             <text className={`MenuItemforSubMenu active`} onClick={a.onClick}>
  //                               Start Recording
  //                             </text>
  //                           )
  //                         ),
  //                       )
  //                     : null}

  //                   <div
  //                     style={{
  //                       position: 'absolute',
  //                       bottom: '20px',
  //                       left: '30%',
  //                       transform: 'rotate(180deg)',
  //                       cursor: 'pointer',
  //                     }}>
  //                     <img
  //                       src={'/assets/loginbtn.png'}
  //                       onClick={() => {
  //                         setSidebarType(null);
  //                       }}
  //                       alt={''}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //         case 'Guests':
  //           return (
  //             <div
  //               style={{
  //                 paddingRight: '2px',
  //                 background: 'linear-gradient(225deg, #fbfcd1, #000000)',
  //                 height: '100%',
  //               }}>
  //               <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
  //                 <div className="headerTitle">Admin Back Stage</div>
  //                 <div className={'guestListContainer'}>
  //                   <div className={'guestListTitle'}>Guest</div>
  //                   <div className={'guestList_divider'} />
  //                   <WaveArmListContainer />

  //                   <div className={'guestList_userContainer'}>
  //                     <div className={'guestList_userSubContainer'}>
  //                       <div className={'guestList_user'}>
  //                         {teacherCameraStream?.fromUser.userName}
  //                       </div>
  //                       <div
  //                         className={
  //                           !teacherCameraStream?.isCameraMuted && !teacherCameraStream?.isMicMuted
  //                             ? 'guestList_userStatusLive'
  //                             : 'guestList_userStatusPaused'
  //                         }>
  //                         {!teacherCameraStream?.isCameraMuted && !teacherCameraStream?.isMicMuted
  //                           ? 'Live'
  //                           : 'Paused'}
  //                       </div>
  //                     </div>
  //                     {carouselStreams?.length > 0
  //                       ? carouselStreams?.map(
  //                           (student, index) =>
  //                             student.fromUser.userUuid && (
  //                               <div className={'guestList_userSubContainer'} key={index}>
  //                                 <div className={'guestList_user'}>
  //                                   {student.fromUser.userName}
  //                                 </div>
  //                                 <div
  //                                   className={
  //                                     !student.isCameraMuted && !student.isMicMuted
  //                                       ? 'guestList_userStatusLive'
  //                                       : 'guestList_userStatusPaused'
  //                                   }>
  //                                   {!student.isCameraMuted && !student.isMicMuted
  //                                     ? 'Live'
  //                                     : 'Paused'}
  //                                 </div>
  //                               </div>
  //                             ),
  //                         )
  //                       : null}
  //                   </div>
  //                   <div
  //                     style={{
  //                       position: 'absolute',
  //                       bottom: '20px',
  //                       left: '30%',
  //                       transform: 'rotate(180deg)',
  //                       cursor: 'pointer',
  //                     }}>
  //                     <img
  //                       src={'/assets/loginbtn.png'}
  //                       onClick={() => {
  //                         setSidebarType(null);
  //                       }}
  //                       alt={''}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );

  //         case 'Stickers':
  //           return (
  //             <div
  //               style={{
  //                 paddingRight: '2px',
  //                 background: 'linear-gradient(225deg, #fbfcd1, #000000)',
  //                 height: '100%',
  //               }}>
  //               <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
  //                 <div className="headerTitle">Admin Back Stage</div>
  //                 <div
  //                   style={{
  //                     height: '70vh',
  //                     overflowY: 'scroll',
  //                     textAlign: 'center',
  //                   }}>
  //                   <text
  //                     style={{
  //                       fontFamily: 'Risque',
  //                       fontStyle: 'normal',
  //                       fontWeight: 'normal',
  //                       fontSize: '20px',
  //                       textAlign: 'center',
  //                     }}>
  //                     Emojis
  //                     <div className={'guestList_divider'} />
  //                   </text>

  //                   <div
  //                     style={{
  //                       width: 150,
  //                       display: 'flex',
  //                       flexWrap: 'wrap',
  //                       alignItems: 'center',
  //                       justifyContent: 'center',
  //                       columnGap: 20,
  //                       rowGap: 10,
  //                       height: 200,
  //                     }}>
  //                     {Object.keys(EmotesvgDict).map((item: any, index: number) => (
  //                       <div
  //                         key={`${item}${index}`}
  //                         className={getActiveEmojiClassName(item) ? 'inactive' : 'active'}
  //                         onClick={onEmojiIconClick}>
  //                         <img id={`${item}`} src={EmotesvgDict[item]} width={50} height={50} />
  //                       </div>
  //                     ))}
  //                     <text
  //                       style={{
  //                         fontFamily: 'Risque',
  //                         fontStyle: 'normal',
  //                         fontWeight: 'normal',
  //                         fontSize: '20px',
  //                         textAlign: 'center',
  //                       }}>
  //                       Instruments
  //                       <div className={'guestList_divider'} />
  //                     </text>

  //                     <div
  //                       style={{
  //                         width: 150,
  //                         display: 'flex',
  //                         flexWrap: 'wrap',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',

  //                         columnGap: 20,
  //                         rowGap: 10,
  //                         height: 200,
  //                       }}>
  //                       {Object.keys(InstrumentSvgDict).map((item: any, index: number) => (
  //                         <div
  //                           key={`${item}${index}`}
  //                           className={getActiveInstrumentClassName(item) ? 'inactive' : 'active'}
  //                           onClick={onInstrumentIconClick}>
  //                           <img
  //                             id={`${item}`}
  //                             src={InstrumentSvgDict[item]}
  //                             width={50}
  //                             height={50}
  //                           />
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                   <div
  //                     style={{
  //                       position: 'absolute',
  //                       bottom: '20px',
  //                       left: '30%',
  //                       transform: 'rotate(180deg)',
  //                       cursor: 'pointer',
  //                     }}>
  //                     <img
  //                       src={'/assets/loginbtn.png'}
  //                       onClick={() => {
  //                         setSidebarType(null);
  //                       }}
  //                       alt={''}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );

  //         default:
  //           return (
  //             <div
  //               style={{
  //                 paddingRight: '2px',
  //                 background: 'linear-gradient(225deg, #fbfcd1, #000000)',
  //                 height: '100%',
  //               }}>
  //               <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
  //                 <div className="headerTitle">Admin Back Stage</div>
  //                 <div className="header-signal">
  //                   <SignalQuality />
  //                 </div>
  //                 <div className="header-actions relative">
  //                   <Actions />
  //                   <ShareCard />
  //                 </div>
  //                 <div
  //                   style={{
  //                     display: 'flex',
  //                     flexDirection: 'column',
  //                     rowGap: '3vh',
  //                     marginTop: '30px',
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <div
  //                     className="gradient-outline"
  //                     onClick={() => handleOnSidebarToolsClick('Tools')}>
  //                     <div className={`gradient-box`}>
  //                       <text className="sideBarMainText">Tools</text>
  //                     </div>
  //                   </div>
  //                   <div
  //                     className="gradient-outline"
  //                     onClick={() => handleOnSidebarToolsClick('Guests')}>
  //                     <div className={`gradient-box`}>
  //                       <text className="sideBarMainText">Guests</text>
  //                     </div>
  //                   </div>
  //                   {/* <div
  //             className="gradient-outline"
  //             onClick={() => handleOnSidebarToolsClick('Stickers')}>
  //             <div className={`gradient-box`}>
  //               <text className="sideBarMainText">Stickers</text>
  //             </div>
  //           </div> */}
  //                   <div
  //                     className="gradient-outline"
  //                     onClick={() => handleOnSidebarToolsClick('Stickers')}>
  //                     <div className={`gradient-box`}>
  //                       <text className="sideBarMainText">Stickers</text>
  //                     </div>
  //                   </div>
  //                   <div
  //                     className="gradient-outline"
  //                     onClick={() => {
  //                       publishChatWidget(
  //                         'updateChatWidget',
  //                         { toggle: !globalStore[roomIndex]['chatMinimized'] },
  //                         EduClassroomConfig.shared.sessionInfo.roomName,
  //                       );
  //                       handleOnSidebarToolsClick('Chat');
  //                       // toggleChatMinimize();
  //                     }}>
  //                     <div className={`gradient-box`}>
  //                       <text className="sideBarMainText">Chat</text>
  //                     </div>
  //                   </div>
  //                   <div
  //                     style={
  //                       {
  //                         // display: 'flex',
  //                         // justifyContent: 'center',
  //                         // position: 'absolute',
  //                         // bottom: '100px',
  //                         // width: '200px',
  //                       }
  //                     }>
  //                     {/* <text className={`MenuItemforSubMenu active`}>{classStatusText}</text> */}
  //                   </div>
  //                   <div className="top-babaji-contianer">
  //                     {actions.length
  //                       ? actions.map(
  //                           (a) =>
  //                             a.id === 'Exit' && (
  //                               <div
  //                                 className="babaji-container"
  //                                 onClick={() => {
  //                                   a.onClick ? a?.onClick() : null;
  //                                   setOpenNav(false);
  //                                 }}>
  //                                 <div className="gradient-small-box">
  //                                   <text className="sideBarSubText">Leave Session</text>
  //                                 </div>
  //                                 <div className="gradient-small-box-outline"></div>
  //                               </div>
  //                             ),
  //                         )
  //                       : null}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //       }
  //     default:
  //       switch (sidebarType) {
  //         case 'Stickers':
  //           return (
  //             <div
  //               style={{
  //                 paddingRight: '2px',
  //                 background: 'linear-gradient(225deg, #fbfcd1, #000000)',
  //                 height: '100%',
  //               }}>
  //               <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
  //                 <div className="headerTitle">Back Stage</div>
  //                 <div
  //                   style={{
  //                     height: '70vh',
  //                     overflowY: 'scroll',
  //                     textAlign: 'center',
  //                   }}>
  //                   <text
  //                     style={{
  //                       fontFamily: 'Risque',
  //                       fontStyle: 'normal',
  //                       fontWeight: 'normal',
  //                       fontSize: '20px',
  //                       textAlign: 'center',
  //                     }}>
  //                     Emojis
  //                     <div className={'guestList_divider'} />
  //                   </text>

  //                   <div
  //                     style={{
  //                       width: 150,
  //                       display: 'flex',
  //                       flexWrap: 'wrap',
  //                       alignItems: 'center',
  //                       justifyContent: 'center',
  //                       columnGap: 20,
  //                       rowGap: 10,
  //                       height: 200,
  //                     }}>
  //                     {Object.keys(EmotesvgDict).map((item: any, index: number) => (
  //                       <div
  //                         key={`${item}${index}`}
  //                         className={getActiveEmojiClassName(item) ? 'inactive' : 'active'}
  //                         onClick={onEmojiIconClick}>
  //                         <img id={`${item}`} src={EmotesvgDict[item]} width={50} height={50} />
  //                       </div>
  //                     ))}
  //                     <text
  //                       style={{
  //                         fontFamily: 'Risque',
  //                         fontStyle: 'normal',
  //                         fontWeight: 'normal',
  //                         fontSize: '20px',
  //                         textAlign: 'center',
  //                         // color: ' #fbff49',
  //                       }}>
  //                       Instruments
  //                       <div className={'guestList_divider'} />
  //                     </text>

  //                     <div
  //                       style={{
  //                         width: 150,
  //                         display: 'flex',
  //                         flexWrap: 'wrap',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',

  //                         columnGap: 20,
  //                         rowGap: 10,
  //                         height: 200,
  //                       }}>
  //                       {Object.keys(InstrumentSvgDict).map((item: any, index: number) => (
  //                         <div
  //                           key={`${item}${index}`}
  //                           className={getActiveInstrumentClassName(item) ? 'inactive' : 'active'}
  //                           onClick={onInstrumentIconClick}>
  //                           <img
  //                             id={`${item}`}
  //                             src={InstrumentSvgDict[item]}
  //                             width={50}
  //                             height={50}
  //                           />
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                   <div
  //                     style={{
  //                       position: 'absolute',
  //                       bottom: '20px',
  //                       left: '30%',
  //                       transform: 'rotate(180deg)',
  //                       cursor: 'pointer',
  //                     }}>
  //                     <img
  //                       src={'/assets/loginbtn.png'}
  //                       onClick={() => {
  //                         setSidebarType(null);
  //                       }}
  //                       alt={''}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );

  //         default:
  //           return (
  //             <div
  //               style={{
  //                 paddingRight: '2px',
  //                 background: 'linear-gradient(225deg, #fbfcd1, #000000)',
  //                 height: '100%',
  //               }}>
  //               <div id="mySidepanel" style={{ color: 'white', padding: 20 }} className="sidepanel">
  //                 <div className="headerTitle">Back Stage</div>
  //                 <div className="header-signal">
  //                   <SignalQuality />
  //                 </div>
  //                 <div className="header-actions relative">
  //                   <Actions />
  //                   <ShareCard />
  //                 </div>
  //                 <div className="userMenu1">
  //                   <div className="userMenuContainer"></div>
  //                   <div className="userMenuContainer ">
  //                     <div
  //                       className={`gradient-small-box-outline-user
  //           ${!carouselStreams[0]?.isCameraMuted ? 'inactiveOption' : 'activeOption'}
  //         `}
  //                       style={{ height: '7vh' }}
  //                     />
  //                     {actions.length
  //                       ? actions.map(
  //                           (a) =>
  //                             a.id === 'Camera' && (
  //                               <div
  //                                 className={`userMenuSubcontainer
  //           ${!carouselStreams[0]?.isCameraMuted ? 'inactiveOption' : 'activeOption'}
  //         `}
  //                                 style={{ height: '7vh' }}>
  //                                 <span
  //                                   className={`MenuItemforSubMenu active`}
  //                                   onClick={a?.onClick}>
  //                                   {`${
  //                                     !carouselStreams[0]?.isCameraMuted
  //                                       ? 'Pause Video'
  //                                       : 'Unpause Video'
  //                                   }`}
  //                                 </span>
  //                               </div>
  //                             ),
  //                         )
  //                       : null}
  //                   </div>
  //                   <div className="userMenuContainer">
  //                     <div
  //                       className={`gradient-small-box-outline-user ${
  //                         !carouselStreams[0]?.isMicMuted ? 'inactiveOption' : 'activeOption'
  //                       }`}
  //                       style={{ height: '7vh' }}
  //                     />
  //                     {actions.length
  //                       ? actions.map(
  //                           (a) =>
  //                             a?.id === 'Mic' && (
  //                               <div
  //                                 className={`userMenuSubcontainer ${
  //                                   !carouselStreams[0]?.isMicMuted
  //                                     ? 'inactiveOption'
  //                                     : 'activeOption'
  //                                 } `}
  //                                 style={{ height: '7vh' }}>
  //                                 <span
  //                                   className={`MenuItemforSubMenu active`}
  //                                   onClick={a?.onClick}>
  //                                   {`${
  //                                     !carouselStreams[0]?.isMicMuted
  //                                       ? 'Mute Audio'
  //                                       : 'Unmute Audio'
  //                                   }`}
  //                                 </span>
  //                               </div>
  //                             ),
  //                         )
  //                       : null}
  //                   </div>

  //                   <div
  //                     className="userMenuContainer"
  //                     onClick={() => {
  //                       handleOnSidebarToolsClick('Stickers');
  //                     }}>
  //                     <div
  //                       className={`gradient-small-box-outline-user inactiveOption
  //                 `}
  //                       style={{ height: '7vh' }}
  //                     />
  //                     <div
  //                       className={`userMenuSubcontainer inactiveOption`}
  //                       style={{ height: '7vh' }}>
  //                       <span className={`MenuItemforSubMenu active`}>Stickers</span>
  //                     </div>
  //                   </div>
  //                 </div>
  //                 <div className="top-babaji-contianer">
  //                   {actions.length
  //                     ? actions.map(
  //                         (a) =>
  //                           a.id === 'Exit' && (
  //                             <div className="babaji-container" onClick={a?.onClick}>
  //                               <div className="gradient-small-box">
  //                                 <span className="sideBarSubText">Leave Session</span>
  //                               </div>
  //                               <div className="gradient-small-box-outline"></div>
  //                             </div>
  //                           ),
  //                       )
  //                     : null}
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //       }
  //   }
  // });

  
  const Sidebar = observer(() => {
    const { streamUIStore } = useInteractiveUIStores() as EduInteractiveUIClassStore;

    const { carouselStreams, teacherCameraStream } = streamUIStore;

    switch (isMobile) {
      case true:
        return (
          <Menu isOpen={openNav} onStateChange={(state: any) => handleStateChange(state)}>
            {/* <HandleMobileMenu /> */}
          </Menu>
        );
      default:
        switch (openNav) {
          case true:
            switch (showAdminPanel) {
              case true:
                switch (sidebarType) {
                  case 'Tools':
                    return (
                      <div
                        style={{
                          paddingRight: '2px',
                          background: 'linear-gradient(225deg, #fbfcd1, #000000)',
                          height: '100%',
                        }}>
                        <div
                          id="mySidepanel"
                          style={{ color: 'white', padding: 20 }}
                          className="sidepanel">
                          <a className="closebtn" onClick={handleOnOpenNav}>
                            &times;
                          </a>
                          <div className="headerTitle">Admin Back Stage</div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              rowGap: '30px',
                              marginTop: '30px',
                              textAlign: 'center',
                            }}>
                            <text
                              style={{
                                fontFamily: 'Risque',
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontSize: '20px',
                                textAlign: 'center',
                              }}>
                              Tools
                              <div className={'guestList_divider'} />
                            </text>
                            {/*
                             */}

                            {actions.length
                              ? actions.map(
                                  (a) =>
                                    a.id === 'Record' && (
                                      <text
                                        className={`MenuItemforSubMenu active`}
                                        onClick={a.onClick}>
                                        Start Recording
                                      </text>
                                    ),
                                )
                              : null}

                            <div
                              style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '30%',
                                transform: 'rotate(180deg)',
                                cursor: 'pointer',
                              }}>
                              <img
                                src={'/assets/loginbtn.png'}
                                onClick={() => {
                                  setSidebarType(null);
                                }}
                                alt={''}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  case 'Guests':
                    return (
                      <div
                        style={{
                          paddingRight: '2px',
                          background: 'linear-gradient(225deg, #fbfcd1, #000000)',
                          height: '100%',
                        }}>
                        <div
                          id="mySidepanel"
                          style={{ color: 'white', padding: 20 }}
                          className="sidepanel">
                          <a className="closebtn" onClick={handleOnOpenNav}>
                            &times;
                          </a>
                          <div className="headerTitle">Admin Back Stage</div>
                          <p
                            className={`MenuItemforSubMenu active`}
                            style={{ marginTop: 20 }}
                            onClick={() => handleInviteMemberToMFWMLOClick()}>
                            Invite to MFWMLO
                          </p>

                          <p
                            className={`MenuItemforSubMenu active`}
                            onClick={() => handleInviteMemberToSORClick()}>
                            Invite to SOR
                          </p>
                          <div className={'guestListContainer'}>
                            <div className={'guestListTitle'}>Guest</div>
                            <div className={'guestList_divider'} />
                            <WaveArmListContainer />

                            <div className={'guestList_userContainer'}>
                              <div className={'guestList_userSubContainer'}>
                                <div className={'guestList_user'}>
                                  {teacherCameraStream?.fromUser.userName}
                                </div>
                                <div
                                  className={
                                    !teacherCameraStream?.isCameraMuted &&
                                    !teacherCameraStream?.isMicMuted
                                      ? 'guestList_userStatusLive'
                                      : 'guestList_userStatusPaused'
                                  }>
                                  {!teacherCameraStream?.isCameraMuted &&
                                  !teacherCameraStream?.isMicMuted
                                    ? 'Live'
                                    : 'Paused'}
                                </div>
                              </div>
                              {carouselStreams?.length > 0
                                ? carouselStreams?.map(
                                    (student, index) =>
                                      student.fromUser.userUuid && (
                                        <div className={'guestList_userSubContainer'} key={index}>
                                          <div className={'guestList_user'}>
                                            {student.fromUser.userName}
                                          </div>
                                          <div
                                            className={
                                              !student.isCameraMuted && !student.isMicMuted
                                                ? 'guestList_userStatusLive'
                                                : 'guestList_userStatusPaused'
                                            }>
                                            {!student.isCameraMuted && !student.isMicMuted
                                              ? 'Live'
                                              : 'Paused'}
                                          </div>
                                        </div>
                                      ),
                                  )
                                : null}
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '30%',
                                transform: 'rotate(180deg)',
                                cursor: 'pointer',
                              }}>
                              <img
                                src={'/assets/loginbtn.png'}
                                onClick={() => {
                                  setSidebarType(null);
                                }}
                                alt={''}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  case 'Stickers':
                    return (
                      <Stickers handleOnOpenNav={handleOnOpenNav} setSidebarType={setSidebarType} />
                    );
                  case 'Chat':
                    return (
                      <Messages setSidebarType={setSidebarType} />
                    );
                  default:
                    return (
                      <div
                        style={{
                          paddingRight: '2px',
                          background: 'linear-gradient(225deg, #fbfcd1, #000000)',
                          height: '100%',
                        }}>
                        <div
                          id="mySidepanel"
                          style={{ color: 'white', padding: 20 }}
                          className="sidepanel">
                          <a className="closebtn" onClick={handleOnOpenNav}>
                            &times;
                          </a>
                          <div className="headerTitle">Admin Back Stage</div>
                          <div className="header-signal">
                            <SignalQuality />
                          </div>
                          <div className="header-actions relative">
                            <Actions />
                            <ShareCard />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              rowGap: '3vh',
                              marginTop: '30px',
                              justifyContent: 'space-between',
                            }}>
                            <div
                              className="gradient-outline"
                              onClick={() => handleOnSidebarToolsClick('Tools')}>
                              <div className={`gradient-box`}>
                                <text className="sideBarMainText">Tools</text>
                              </div>
                            </div>
                            <div
                              className="gradient-outline"
                              onClick={() => handleOnSidebarToolsClick('Guests')}>
                              <div className={`gradient-box`}>
                                <text className="sideBarMainText">Guests</text>
                              </div>
                            </div>
                            {/* <div
              className="gradient-outline"
              onClick={() => handleOnSidebarToolsClick('Stickers')}>
              <div className={`gradient-box`}>
                <text className="sideBarMainText">Stickers</text>
              </div>
            </div> */}
                            <div
                              className="gradient-outline"
                              onClick={() => handleOnSidebarToolsClick('Stickers')}>
                              <div className={`gradient-box`}>
                                <text className="sideBarMainText">Stickers</text>
                              </div>
                            </div>
                            <div
                              className="gradient-outline"
                              onClick={() => {
                                publishChatWidget(
                                  'updateChatWidget',
                                  { toggle: true },
                                  EduClassroomConfig.shared.sessionInfo.roomName,
                                );
                                handleOnSidebarToolsClick('Chat');
                                // toggleChatMinimize();
                              }}>
                              <div className={`gradient-box`}>
                                <text className="sideBarMainText">Chat</text>
                              </div>
                            </div>
                            <div
                              style={
                                {
                                  // display: 'flex',
                                  // justifyContent: 'center',
                                  // position: 'absolute',
                                  // bottom: '100px',
                                  // width: '200px',
                                }
                              }>
                              {/* <text className={`MenuItemforSubMenu active`}>{classStatusText}</text> */}
                            </div>
                            <div className="top-babaji-contianer">
                              {actions.length
                                ? actions.map(
                                    (a) =>
                                      a.id === 'Exit' && (
                                        <div className="babaji-container" onClick={a?.onClick}>
                                          <div className="gradient-small-box">
                                            <text className="sideBarSubText">Leave Session</text>
                                          </div>
                                          <div className="gradient-small-box-outline"></div>
                                        </div>
                                      ),
                                  )
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                }
              default:
                switch (sidebarType) {
                  case 'Stickers':
                    return (
                      <Stickers handleOnOpenNav={handleOnOpenNav} setSidebarType={setSidebarType} />
                    );
                  case 'Chat':
                    return (
                      <Messages setSidebarType={setSidebarType} />
                    );
                  default:
                    return (
                      <div
                        style={{
                          paddingRight: '2px',
                          background: 'linear-gradient(225deg, #fbfcd1, #000000)',
                          height: '100%',
                        }}>
                        <div
                          id="mySidepanel"
                          style={{ color: 'white', padding: 20 }}
                          className="sidepanel">
                          <a className="closebtn" onClick={handleOnOpenNav}>
                            &times;
                          </a>
                          <div className="headerTitle">Back Stage</div>
                          <div className="header-signal">
                            <SignalQuality />
                          </div>
                          <div className="header-actions relative">
                            <Actions />
                            <ShareCard />
                          </div>
                          <div className="userMenu1">
                            <div className="userMenuContainer"></div>
                            <div className="userMenuContainer ">
                              <div
                                className={`gradient-small-box-outline-user
            ${!carouselStreams[0]?.isCameraMuted ? 'inactiveOption' : 'activeOption'}
          `}
                                style={{ height: '7vh' }}
                              />
                              {actions.length
                                ? actions.map(
                                    (a) =>
                                      a.id === 'Camera' && (
                                        <div
                                          className={`userMenuSubcontainer
            ${!carouselStreams[0]?.isCameraMuted ? 'inactiveOption' : 'activeOption'}
          `}
                                          style={{ height: '7vh' }}>
                                          <span
                                            className={`MenuItemforSubMenu active`}
                                            onClick={a?.onClick}>
                                            {`${
                                              !carouselStreams[0]?.isCameraMuted
                                                ? 'Pause Video'
                                                : 'Unpause Video'
                                            }`}
                                          </span>
                                        </div>
                                      ),
                                  )
                                : null}
                            </div>
                            <div className="userMenuContainer">
                              <div
                                className={`gradient-small-box-outline-user ${
                                  !carouselStreams[0]?.isMicMuted
                                    ? 'inactiveOption'
                                    : 'activeOption'
                                }`}
                                style={{ height: '7vh' }}
                              />
                              {actions.length
                                ? actions.map(
                                    (a) =>
                                      a?.id === 'Mic' && (
                                        <div
                                          className={`userMenuSubcontainer ${
                                            !carouselStreams[0]?.isMicMuted
                                              ? 'inactiveOption'
                                              : 'activeOption'
                                          } `}
                                          style={{ height: '7vh' }}>
                                          <span
                                            className={`MenuItemforSubMenu active`}
                                            onClick={a?.onClick}>
                                            {`${
                                              !carouselStreams[0]?.isMicMuted
                                                ? 'Mute Audio'
                                                : 'Unmute Audio'
                                            }`}
                                          </span>
                                        </div>
                                      ),
                                  )
                                : null}
                            </div>

                            <div
                              className="userMenuContainer"
                              onClick={() => {
                                handleOnSidebarToolsClick('Stickers');
                              }}>
                              <div
                                className={`gradient-small-box-outline-user inactiveOption`}
                                style={{ height: '7vh' }}
                              />
                              <div
                                className={`userMenuSubcontainer inactiveOption`}
                                style={{ height: '7vh' }}>
                                <span className={`MenuItemforSubMenu active`}>Stickers</span>
                              </div>
                            </div>
                            <div
                              className="userMenuContainer"
                              onClick={() => {
                                handleOnSidebarToolsClick('Chat');
                              }}>
                              <div
                                className={`gradient-small-box-outline-user inactiveOption`}
                                style={{ height: '7vh' }}
                              />
                              <div
                                className={`userMenuSubcontainer inactiveOption`}
                                style={{ height: '7vh' }}>
                                <span className={`MenuItemforSubMenu active`}>Chat</span>
                              </div>
                            </div>
                          </div>
                          <div className="top-babaji-contianer">
                            {actions.length
                              ? actions.map(
                                  (a) =>
                                    a.id === 'Exit' && (
                                      <div className="babaji-container" onClick={a?.onClick}>
                                        <div className="gradient-small-box">
                                          <span className="sideBarSubText">Leave Session</span>
                                        </div>
                                        <div className="gradient-small-box-outline"></div>
                                      </div>
                                    ),
                                )
                              : null}
                          </div>
                        </div>
                      </div>
                    );
                }
            }
          default:
            return (
              <div
                style={{
                  paddingRight: '2px',
                  background: 'linear-gradient(225deg, #fbfcd1, #000000)',
                  height: '100%',
                }}>
                <button className="openbtn" id="openbtn" onClick={handleOnOpenNav}>
                  &#9776;
                </button>
              </div>
            );
        }
    }
  });

  return (
    <aside id="nav_side">
      <Sidebar />
    </aside>
  );
});
