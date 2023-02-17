import { Button, Layout, SvgIconEnum, SvgImg, Toast, transI18n, useI18n } from '~ui-kit';
import './style.css';
import { addResource } from '../../components/i18n';
import { FC, useEffect, useState, Fragment, useRef } from 'react';
import { useHomeStore } from '@/infra/hooks';
import { EduRegion, EduRoleTypeEnum, EduRoomTypeEnum } from 'agora-edu-core';
import { AgoraRteEngineConfig, AgoraRteRuntimePlatform } from 'agora-rte-sdk';
import { getBrowserLanguage, storage } from '@/infra/utils';
import md5 from 'js-md5';
import { useHistory, useParams } from 'react-router';
import { HomeApi } from './home-api';
import { HomeLaunchOption } from '@/app/stores/home';
import { AgoraEduSDK, LanguageEnum } from '@/infra/api';
import { RtmRole, RtmTokenBuilder } from 'agora-access-token';
import { v4 as uuidv4 } from 'uuid';
import { observer } from 'mobx-react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ToastType } from '@/infra/stores/common/share-ui';
import { MessageDialog } from './message-dialog';
import { HomeSettingContainer } from './home-setting';
import { LoginForm } from './login-form';

addResource();

const REACT_APP_AGORA_APP_SDK_DOMAIN = process.env.REACT_APP_AGORA_APP_SDK_DOMAIN;
const REACT_APP_AGORA_APP_ID = process.env.REACT_APP_AGORA_APP_ID;
const REACT_APP_AGORA_APP_CERTIFICATE = process.env.REACT_APP_AGORA_APP_CERTIFICATE;

declare global {
  interface Window {
    __launchRegion: string;
    __launchLanguage: string;
    __launchRoomName: string;
    __launchUserName: string;
    __launchRoleType: string;
    __launchRoomType: string;
    __launchCompanyId: string;
    __launchProjectId: string;
    __launchClassType: string;
    __launchMasterPassword: string;
  }
}

const regionByLang = {
  zh: EduRegion.CN,
  en: EduRegion.NA,
};

export const useBuilderConfig = () => {
  const [configReady, setConfigReady] = useState(false);
  const builderResource = useRef({
    scenes: {},
    themes: {},
  });
  const t = useI18n();

  const defaultScenes = [
    { text: t('home.roomType_1v1'), value: `${EduRoomTypeEnum.Room1v1Class}` },
    { text: t('home.roomType_interactiveSmallClass'), value: `${EduRoomTypeEnum.RoomSmallClass}` },
    { text: t('home.roomType_interactiveBigClass'), value: `${EduRoomTypeEnum.RoomBigClass}` },
  ];

  const [roomTypes, setRoomTypes] = useState<EduRoomTypeEnum[]>([]);

  const sceneOptions = defaultScenes.filter(({ value }) => {
    return roomTypes.some((t) => `${t}` === value);
  });

  useEffect(() => {
    const companyId = window.__launchCompanyId;
    const projectId = window.__launchProjectId;

    if (companyId && projectId) {
      HomeApi.shared.setBuilderDomainRegion(EduRegion.CN);
      HomeApi.shared.getBuilderResource(companyId, projectId).then(({ scenes, themes }) => {
        builderResource.current = {
          scenes: scenes ?? {},
          themes: themes ? { default: themes } : {},
        };

        AgoraEduSDK.setParameters(
          JSON.stringify({
            uiConfigs: builderResource.current.scenes,
            themes: builderResource.current.themes,
          }),
        );

        setRoomTypes(AgoraEduSDK.getLoadedScenes().map(({ roomType }) => roomType));
        setConfigReady(true);
      });
    } else {
      setConfigReady(true);
      setRoomTypes(AgoraEduSDK.getLoadedScenes().map(({ roomType }) => roomType));
    }
  }, []);

  return {
    builderResource,
    sceneOptions: sceneOptions.length ? sceneOptions : defaultScenes,
    configReady,
  };
};

export const HomePage = ({ match }: { match: any }) => {
  const homeStore = useHomeStore();
  const history = useHistory();
  const params = useParams();

  const launchConfig = homeStore.launchConfig;

  const [duration] = useState<string>(`${+launchConfig.duration / 60 || 30}`);

  const [loading, setLoading] = useState<boolean>(false);

  const t = useI18n();

  const { builderResource, sceneOptions, configReady } = useBuilderConfig();

  useEffect(() => {
    const language = window.__launchLanguage || homeStore.language || getBrowserLanguage();
    const region = window.__launchRegion || homeStore.region || regionByLang[getBrowserLanguage()];
    homeStore.setLanguage(language as LanguageEnum);
    homeStore.setRegion(region as EduRegion);
  }, []);

  // useEffect(() => {
  //   if (history.location.pathname === '/share' && configReady) {
  //     // const queryString = window.location.search;

  //     // const urlParams = new URLSearchParams(queryString);

  //     // const classType = urlParams.get('classType');

  //     // // const password = urlParams.get('password');

  //     setTimeout(() => {
  //       handleSubmit({
  //         roleType: window.__launchRoleType,
  //         roomType: window.__launchRoomType,
  //         roomName: window.__launchRoomName,
  //         userName: `user_${''.padEnd(6, `${Math.floor(Math.random() * 10000)}`)}`,
  //         classType: window.__launchClassType,
  //         password: window.__launchMasterPassword,
  //       });
  //     });
  //   }
  // }, [configReady]);

  const [courseWareList] = useState<any[]>(storage.getCourseWareSaveList());

  const handleSubmit = async ({
    roleType,
    roomType: rt,
    roomName,
    userName,
    classType,
    password,
  }: {
    roleType: string;
    roomType: string;
    roomName: string;
    userName: string;
    classType: string;
    password: string;
  }) => {

    if (history.location.pathname === '/share') {
      if (password !== md5(md5('richardKagan123@'))) {
        return;
      }
    } else {
      if (loading || password !== md5('richardKagan123@')) {
        return;
      }
    }

    const language = homeStore.language || getBrowserLanguage();
    const region = homeStore.region || regionByLang[getBrowserLanguage()];

    const userRole = parseInt(roleType);

    const roomType = parseInt(rt);
    const userUuid = `${md5(userName)}${userRole}`;

    const roomUuid = `${md5(roomName)}${roomType}`;

    localStorage.setItem('classType', classType);

    try {
      setLoading(true);

      const domain = `${REACT_APP_AGORA_APP_SDK_DOMAIN}`;

      HomeApi.shared.setDomainRegion(region);

      const { token, appId } = await HomeApi.shared.loginV3(userUuid, roomUuid, userRole);

      const companyId = window.__launchCompanyId;
      const projectId = window.__launchProjectId;

      const shareUrl =
        AgoraRteEngineConfig.platform === AgoraRteRuntimePlatform.Electron
          ? ''
          : `${location.origin}${
              location.pathname
            }?roomName=${roomName}&roomType=${roomType}&region=${region}&language=${language}&roleType=${
              EduRoleTypeEnum.student
            }&companyId=${companyId ?? ''}&projectId=${projectId ?? ''}#/share`;

      // console.log('## get rtm Token from demo server', token);
      const config: HomeLaunchOption = {
        appId,
        sdkDomain: domain,
        pretest: true,
        courseWareList: courseWareList.slice(0, 1),
        language: language as LanguageEnum,
        userUuid: `${userUuid}`,
        rtmToken: token,
        roomUuid: `${roomUuid}`,
        roomType: roomType,
        roomName: `${roomName}`,
        userName: userName,
        roleType: userRole,
        region: region as EduRegion,
        duration: +duration * 60,
        latencyLevel: 2,
        scenes: builderResource.current.scenes,
        themes: builderResource.current.themes,
        shareUrl,
      };

      config.appId = REACT_APP_AGORA_APP_ID || config.appId;
      // this is for DEBUG PURPOSE only. please do not store certificate in client, it's not safe.
      // 此处仅为开发调试使用, token应该通过服务端生成, 请确保不要把证书保存在客户端
      if (REACT_APP_AGORA_APP_CERTIFICATE) {
        config.rtmToken = RtmTokenBuilder.buildToken(
          config.appId,
          REACT_APP_AGORA_APP_CERTIFICATE,
          config.userUuid,
          RtmRole.Rtm_User,
          0,
        );

        // console.log(`## build rtm Token ${config.rtmToken} by using RtmTokenBuilder`);
      }
      homeStore.setLaunchConfig(config);
      history.push('/launch');
    } catch (e) {
      homeStore.addToast({
        id: uuidv4(),
        desc:
          (e as Error).message === 'Network Error'
            ? transI18n('home.network_error')
            : (e as Error).message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MessageDialog />
      <HomeToastContainer />
      {/* <div className="header-actions relative"> */}
      <SettingsButton />
      {/* </div> */}

      <div className={'container'}>
        <div className={'bannerContainer'}>
          <img src="./assets/bannerText4.png" alt="" />
        </div>
        <div style={{ width: '95%', display: 'flex' }}>
          <div className={'leftSideBanner'}>
            <div className={'leftSideBannerContainer'}>
              <div className={'leftSideBannerTitle'}>Why choose Music Fun with my Little One</div>
              <hr className={'leftSideBannerHozer'} />
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want to share a special activity with my child, and include other family members”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want to introduce the love of music with my Little One in a fun environment”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want a new and unique program to share activities with my child”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want my child to benefit from music as a resource for better learning skills”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want to watch my grandchild having fun in a safe place” I love that I can see my
              kids doing something they love “I want my child to build confidence”
            </div>
            <div className={'leftSideBannerSubText'}>“I want my child to build confidence”</div>
            <div className={'leftSideBannerSubText'}>
              “I want my child to experience something new that they can love”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want me and my child to be entertained and engaged in a fun program”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I love that we can be in a program and share it with family and friends “
            </div>
            <div className={'leftSideBannerSubText'}>
              “I want a program to meet other families and new friends”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I am a single Dad, I’m always looking for something to do when I have my daughter”
            </div>
            <div className={'leftSideBannerSubText'}>
              “I love music and want to share it with my 3 year old”
            </div>
          </div>
          <div className={'subContainer'}>
            <div className={'contentContainer'}>
              <div className={'subContentContainer'}>
                <div className={'subContentContainerBelow'}>
                  <div className={'mainContainer'}>
                    <div className={'mainSubContainer'}>
                      <div className={'mainSubContainer1'}>
                        <video autoPlay muted loop>
                          <source src="/video/video.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  </div>
                  <div className={'titleTxt'}>
                    Meet up with friends & family from anywhere, share our spectecular music journey
                  </div>
                </div>
              </div>
              <div className={'lowerContainer'}>
                <div className={'lowerSubContainer'}>
                  <img src="./assets/lower1.png" width="47%" height="80%" alt="" />
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>What is Music Fun with your Little One?</div>
                    <div className={'text'}>
                      An enjoyable Parent/Guardian and Child experience with a live Instructor
                      taking you on a journey of music appreciation.
                    </div>
                  </div>
                </div>
                {/* </Element> */}
                <div className={'lowerSubContainer'}>
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>About our programs</div>
                    <div className={'text'}>
                      We provide a group program with friends, families, groups and schools to
                      interact and discover to joy of music.
                    </div>
                  </div>
                  <img src="./assets/lower2.png" width="47%" height="80%" alt="" />
                </div>
                <div className={'lowerSubContainer'}>
                  <img src="./assets/lower3.png" width="47%" height="80%" alt="" />
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>Music Fun... is #1 </div>
                    <div className={'text'}>
                      Best of all, you get to share your experience with your favorite people
                      connecting online..
                    </div>
                  </div>
                </div>
                <div className={'lowerSubContainer'}>
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>How do I sign up?</div>
                    <div className={'text'}>
                      Register and set up your day and time, Bring or join a group and start your
                      music journey. It’s as easy as 1,2,3 & 4
                    </div>
                  </div>
                  <img src="./assets/lower4.png" width="47%" height="80%" alt="" />
                </div>
                <div className={'lowerSubContainer'}>
                  <img src="./assets/lower5.png" width="47%" height="80%" alt="" />
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>Who can join class?</div>
                    <div className={'text'}>
                      Our classes are limited 8 participants with children. Bring your friends,
                      cousins, team, band and experience the magic!
                    </div>
                  </div>
                </div>
                <div className={'lowerSubContainer'}>
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>
                      Why enroll in the 8 week interactive program?
                    </div>
                    <div className={'text'}>
                      Introduce music, have fun and try new and creative ways to interact with your
                      little ...
                    </div>
                  </div>
                  <img src="./assets/lower6.png" width="47%" height="80%" alt="" />
                </div>
                <div className={'lowerSubContainer'}>
                  <img src="./assets/lower7.png" width="47%" height="80%" alt="" />
                  <div className={'textContainer'}>
                    <div className={'highlightedtxt'}>Who can join class?</div>
                    <div className={'text'}>
                      Music Fun with your Little One is an 8 week interactive program:
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={'rightsideBanner'}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
              <div className={'btnContainer'}>
                <div
                  className="form-section animated-form"
                  style={{
                    top: 'calc((100% - 540px) * 0.5)',
                    left: 'calc((100% - 477px) * 0.81)',
                    padding: '10px 10px 26px',
                  }}>
                  <LoginForm onSubmit={handleSubmit} sceneOptions={sceneOptions} />
                </div>{' '}
              </div>
              <div className={'rightsideBannerSubText'}>
                Parents, grandparents, Uncles & Aunts can enjoy Music Fun with their Little one.
              </div>
              <div className={'rightsideBannerSubText'}>
                Schools can add our enrichment program to their ciriculum.
              </div>
              <div className={'rightsideBannerSubText'}>
                Our program has no boundaries, students can participate from anywhere in the world.
              </div>
              <div className={'rightsideBannerSubText'}>
                Learn about many aspects of music before choosing a single instrument.
              </div>
              <div className={'rightsideBannerSubText'}>
                Learn to be confident about communicating with others.
              </div>
              <div className={'rightsideBannerSubText'}>
                Build a positive attitude through our music journey.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const HomeToastContainer: FC = observer(() => {
  const { toastList, removeToast } = useHomeStore();
  return (
    <TransitionGroup style={{ justifyContent: 'center', display: 'flex' }}>
      {toastList.map((value: ToastType, idx: number) => (
        <CSSTransition classNames="toast-animation" timeout={1000} key={`${value.id}`}>
          <Toast
            style={{ position: 'absolute', top: 50 * (idx + 1), zIndex: 9999 }}
            type={value.type}
            closeToast={() => {
              removeToast(value.id);
            }}>
            {value.desc}
          </Toast>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
});

export const SettingsButton = () => {
  const t = useI18n();
  const [hover, setHover] = useState(false);
  const handleOver = () => {
    setHover(true);
  };

  const handleLeave = () => {
    setHover(false);
  };

  const textColor = hover ? '#fff' : '#030303';
  const backgroundColor = hover ? '#030303' : '#fff';

  return (
    <HomeSettingContainer>
      <Button
        animate={false}
        onMouseOver={handleOver}
        onMouseLeave={handleLeave}
        style={{
          background: backgroundColor,
          transition: 'all .2s',
          position: 'absolute',
          left: '2%',
          top: '4%',
        }}>
        <div className="flex items-center">
          <SvgImg type={SvgIconEnum.SET_OUTLINE} size={16} colors={{ iconPrimary: textColor }} />
          <span className="ml-1" style={{ color: textColor }}>
            {t('settings_setting')}
          </span>
        </div>
      </Button>
    </HomeSettingContainer>
  );
};
