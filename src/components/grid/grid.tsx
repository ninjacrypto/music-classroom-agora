//@ts-nocheck
import React, { useState } from 'react';
import './grid.css';
import { IonImg, isPlatform, IonIcon, useIonViewDidLeave } from '@ionic/react';
import copyToClipboard from 'copy-to-clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import useAlertService from '../../hooks/AlertService';
import Accordion from '../../components/Accordion/Accordion';
import { useAlert } from 'react-alert';

function Grid(props) {
  var {
    values,
    videos,
    meetingVideos,
    activeVideo,
    // canInviteMember,
    // canRaiseHand,
    // canEndMeeting,
    // canVideoMute,
    // canAudioMute,
    canScreenShare,
    canEnableWhiteboard,
    // canMuteUsers,
    // canWhiteboardEnable,
    // canMemberRemove,
    inviteText,
    // handleRaiseHandClick,
    handleEndMeetingClick,
    changeBorder,
    // handleMenuVideoClick,
    // handleAudioClick,
    handleScreenShareClick,
    handleStopScreenShareClick,
    handleMuteClick,
    handleUnMuteClick,
    handleMutevideoClick,
    handleUnMutevideoClick,
    handleRemoteRaiseHandClick,
    handleWhiteboardClick,
    handleRemoteImageModeClick,
    // handleWhiteboardClick,
    // handleMemberRemoveClick,
    // handleRemoveRaiseHand,
    // handleMenuRemoveRaiseHandForAdmin,
    // handleMenuMuteforAdmin,
    // handleAdminCheck,
  } = props;
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>active video >>>', activeVideo);

  var values = values || 1;
  const [openNav, setOpenNav] = useState(false);
  const [open2nav, set2Nav] = useState(false);
  // flag for the title change in banner
  const [title, setTitle] = useState(true);
  const alert = useAlert();

  const handleOnOpenNav = () => {
    setOpenNav(!openNav);
  };
  const handleOnTodaysColor = () => {
    set2Nav(true);
  };
  const handleOn2NavBackbtn = () => {
    set2Nav(false);
  };
  const handleLeftImages = () => {
    let elements = [<div className={`changeNewBorderColor ${meetingVideos[0]?.borderColor} vidCapture${values}_${1}`}>{videos[0]}</div>];
    for (let i = 1; i < values; i++) {
      if (i === 3) {
        elements.push(<div className={`changeNewBorderColor ${meetingVideos[i]?.borderColor} vidCapture${values}_${2}`}>{videos[i]}</div>);
      }
    }
    return elements;
  };
  const handleImagesForMobile = () => {
    let elements = [<div className={`changeNewBorderColor ${meetingVideos[0]?.borderColor} videoCapture`}>{videos[0]}</div>];
    for (let i = 1; i < values; i++) {
      elements.push(<div className={`changeNewBorderColor ${meetingVideos[i]?.borderColor} videoCapture`}>{videos[i]}</div>);
    }
    return elements;
  };

  const handleRightImages = () => {
    if (values <= 1) return;
    let elements = [];
    for (let i = 1; i < values; i++) {
      let condition1 = values >= 4 && i == 3;
      let condition2 = values > 13 && i >= 13;

      if (condition1 || condition2) {
      } else {
        elements.push(<div className={`changeNewBorderColor ${meetingVideos[i]?.borderColor} vidCapture${values}_${i + 1}`}>{videos[i]}</div>);
      }
    }
    return elements;
  };
  const handleBottomImages = () => {
    let elements = [];
    if (values >= 13) {
      for (let i = 13; i <= values; i++) {
        elements.push(<div className={`changeNewBorderColor ${meetingVideos[i - 2]?.borderColor} vidCapture${values}_${i}`}>{videos[i - 2]}</div>);
      }

      return elements;
    }
  };

  const handleInviteMemberClick = () => {
    // if (!canInviteMember) return;
    // if (isPlatform('hybrid')) SocialSharing.share(inviteText);
    // else {

    copyToClipboard(inviteText);
    alert.show('Invitation Copied!', { type: 'success' });

    // AlertService.push('Invitation copied.');
    // }
  };

  return (
    <div id='container'>
      <div id='contentContainer'>
        <aside id='nav_side'>
          {openNav && !open2nav ? (
            <div id='mySidepanel' style={{ color: 'white', padding: 20 }} className='sidepanel'>
              <div
                style={{
                  height: '100%',
                  border: '1px solid #FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <a className='closebtn' onClick={handleOnOpenNav}>
                  &times;
                </a>
                <div className='upperContainer'>
                  {/* <div className={`menuItemSidebar active  : ''}`} onClick={canRaiseHand ? handleRaiseHandClick : handleRemoveRaiseHand}>
                    {canRaiseHand ? 'Raise hand' : 'Unraise Hand'}
                  </div>
                  <hr className='horizontal' /> */}
                  {/* {handleAdminCheck() && (
                    <>
                      <div className={`menuItemSidebar active  : ''}`} onClick={handleMenuRemoveRaiseHandForAdmin}>
                        {'Remove Raised Hand'}
                      </div>
                      <hr className='horizontal' />
                      <div className={`menuItemSidebar ${canMuteUsers === 'Not Available' ? '' : 'active'}`} onClick={handleMenuMuteforAdmin}>
                        {` ${canMuteUsers ? 'Mute User' : 'Unmute User'}`}
                      </div>
                      <hr className='horizontal' />
                      <div className={`menuItemSidebar active`} onClick={handleInviteMemberClick}>
                        Invite Guests
                      </div>
                      <hr className='horizontal' />
                      <div className={`menuItemSidebar ${canMemberRemove ? 'active' : ''}`} onClick={handleMemberRemoveClick}>
                        Remove Member
                      </div>
                      <hr className='horizontal' />
                      <Accordion>
                        <div className={`menuItemSidebar `} onClick={''}>
                          Chat
                        </div>
                        <hr className='horizontal' />

                        <div className={`menuItemSidebar `} onClick={''}>
                          Display File
                        </div>
                        <hr className='horizontal' />

                        <div className={`menuItemSidebar `} onClick={''}>
                          Display Video
                        </div>
                        <hr className='horizontal' />

                        <div className={`menuItemSidebar ${canScreenShare ? 'active' : ''}`} onClick={handleScreenShareClick}>
                          Share Screen
                        </div>
                        <hr className='horizontal' />
                        <div className={`menuItemSidebar ${canWhiteboardEnable ? 'active' : ''}`} onClick={handleWhiteboardClick}>
                          White Board
                        </div>
                        <hr className='horizontal' />
                      </Accordion>
                    </>
                  )} */}

                  {/* <div className={`menuItemSidebar ${canAudioMute === 'not Available' ? '' : 'active'}`} onClick={handleAudioClick}>
                    {`${canAudioMute === 'not Available' ? 'Mute Audio' : canAudioMute ? ' Mute Audio' : 'Unmute Audio'}`}
                  </div>
                  <hr className='horizontal' />

                  <div className={`menuItemSidebar active`} onClick={handleOnTodaysColor}>
                    Today's Colors
                  </div>
                  <hr className='horizontal' /> */}
                  <div className={`menuItemSidebar active`} onClick={!canScreenShare ? handleScreenShareClick : handleStopScreenShareClick}>
                    {!canScreenShare ? 'Screenshare' : 'Stop Screenshare'}
                  </div>
                  <hr className='horizontal' />
                  {/* <div className={`menuItemSidebar active`} onClick={handleStopScreenShareClick}>
                    {'Stop Screenshare'}
                  </div>
                  <hr className='horizontal' /> */}
                  <div className={`menuItemSidebar active`} onClick={handleMuteClick}>
                    {'Mute Audio'}
                  </div>
                  <hr className='horizontal' />
                  <div className={`menuItemSidebar active`} onClick={handleUnMuteClick}>
                    {'Unmute Audio'}
                  </div>
                  <hr className='horizontal' />
                  <div className={`menuItemSidebar active`} onClick={handleInviteMemberClick}>
                    {'Invite'}
                  </div>
                  <hr className='horizontal' />
                  <div className={`menuItemSidebar active`} onClick={handleRemoteRaiseHandClick}>
                    {'Raise Hand'}
                  </div>
                  <hr className='horizontal' />
                  <div className={`menuItemSidebar ${canEnableWhiteboard ? 'active' : ''}`} onClick={handleWhiteboardClick}>
                    {'Enable Whiteboard'}
                  </div>
                  <hr className='horizontal' />
                  <div className={`menuItemSidebar active`} onClick={handleRemoteImageModeClick}>
                    {'Image upload'}
                  </div>
                  <hr className='horizontal' />
                  <div className={`menuItemSidebar active`} onClick={handleOnTodaysColor}>
                    {"  Today's Colors"}
                  </div>
                  <hr className='horizontal' />
                </div>

                <div className='lowerContainer'>
                  <hr className='HRdivider' />
                  <div className={`menuItemSidebarlower active`} onClick={handleMutevideoClick}>
                    {' Pause Session'}
                  </div>
                  <div className={`menuItemSidebarlower active`} onClick={handleUnMutevideoClick}>
                    {' Unpause Session'}
                  </div>
                  <div className={`menuItemSidebarlower ${'active'}`} onClick={handleEndMeetingClick}>
                    End Session
                  </div>
                </div>
              </div>
            </div>
          ) : openNav ? (
            <div id='mySidepanel' style={{ color: 'white', padding: 20 }} className='sidepanel'>
              <div
                style={{
                  height: '100%',
                  border: '1px solid #FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <a className='backbtn' onClick={handleOn2NavBackbtn}>
                  <img
                    src='./assets/backArrow.png'
                    style={{
                      transform: 'scaleX(-1)',
                      margin: '20px 0px',
                    }}
                    height={40}
                    width={40}
                    alt=''
                  />
                </a>
                <img width={150} src='/assets/today_color_text.png' style={{ marginRight: 10 }} alt='' />

                <div id='newCaptureBorderColorsContainer'>
                  <hr id='green' style={{ border: '5px solid #82ED93', width: '80%' }} onClick={changeBorder}></hr>
                  <hr id='aqua' style={{ border: '5px solid #4EF2DE', width: '80%' }} onClick={changeBorder}></hr>
                  <hr id='red' style={{ border: '5px solid #F71C1C', width: '80%' }} onClick={changeBorder}></hr>
                  <hr id='orange' style={{ border: '5px solid #F29B1A', width: '80%' }} onClick={changeBorder}></hr>
                </div>
              </div>
            </div>
          ) : (
            <button className='openbtn' id='openbtn' onClick={handleOnOpenNav}>
              &#9776;
            </button>
          )}
        </aside>
        <main>
          <div className='mainTop'>
            {values >= 27 ? null : values === 26 ? (
              <div id='newMainContentAreaX26'>
                <div className='x22Header'>
                  <div className='changeNewBorderColor vidCapture22_22'>{videos[21]}</div>
                  <div className='newMainContentHeaderBg26'>{/* <h3 className='banner_title'>{title} </h3> */}</div>
                  <div className='changeNewBorderColor vidCapture26_26'>Balcony Seats</div>
                  <div className='changeNewBorderColor vidCapture25_25'>{videos[24]}</div>
                  <div className='changeNewBorderColor vidCapture24_24'>{videos[23]}</div>
                  <div className='changeNewBorderColor vidCapture23_23'>{videos[22]}</div>
                </div>
                <div className='x21Lower'>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture21_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture21_11'>{videos[10]}</div>
                    <div className='changeNewBorderColor vidCapture21_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture21_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture21_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture21_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture21_21'>{videos[20]}</div>
                  </div>

                  <div className='x18Middle'>
                    <div className='newMainContentMiddleX13'>
                      <div className='newMainContentRightInner'>
                        <div className='newMainContentRightInnerTextarea'>
                          <div className='newMainContentTextarea'>{activeVideo}</div>
                        </div>
                      </div>
                    </div>
                    <div className='x13BottomVidsAlt'>
                      <div className='changeNewBorderColor vidCapture21_17'>{videos[16]}</div>
                      <div className='changeNewBorderColor vidCapture21_16'>{videos[15]}</div>
                      <div className='changeNewBorderColor vidCapture21_15'>{videos[14]}</div>
                      <div className='changeNewBorderColor vidCapture21_14'>{videos[13]}</div>
                      <div className='changeNewBorderColor vidCapture21_13'>{videos[12]}</div>
                    </div>
                  </div>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_3'>{videos[2]}</div>
                    <div className='changeNewBorderColor vidCapture21_4'>{videos[3]}</div>
                    <div className='changeNewBorderColor vidCapture21_5'>{videos[4]}</div>
                    <div className='changeNewBorderColor vidCapture21_6'>{videos[5]}</div>
                    <div className='changeNewBorderColor vidCapture21_7'>{videos[6]}</div>
                    <div className='changeNewBorderColor vidCapture21_8'>{videos[7]}</div>
                    <div className='changeNewBorderColor vidCapture21_9'>{videos[8]}</div>
                    <div className='changeNewBorderColor vidCapture21_10'>{videos[9]}</div>
                  </div>
                </div>
              </div>
            ) : values === 25 ? (
              <div id='newMainContentAreaX25'>
                <div className='x22Header'>
                  <div className='changeNewBorderColor vidCapture22_22'>{videos[21]}</div>
                  <div className={title ? 'newMainContentHeaderBg25' : 'newMainContentHeaderBgZ25'}>
                    {/* <h3 className='banner_title'>{title} </h3> */}
                  </div>
                  <div className='changeNewBorderColor vidCapture25_25'>{videos[24]}</div>
                  <div className='changeNewBorderColor vidCapture24_24'>{videos[23]}</div>
                  <div className='changeNewBorderColor vidCapture23_23'>{videos[22]}</div>
                </div>
                <div className='x21Lower'>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture21_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture21_11'>{videos[10]}</div>
                    <div className='changeNewBorderColor vidCapture21_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture21_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture21_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture21_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture21_21'>{videos[20]}</div>
                  </div>
                  <div className='x18Middle'>
                    <div className='newMainContentMiddleX13'>
                      <div className='newMainContentRightInner'>
                        <div className='newMainContentRightInnerTextarea'>
                          <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                        </div>
                      </div>
                    </div>
                    <div className='x13BottomVidsAlt'>
                      <div className='changeNewBorderColor vidCapture21_17'>{videos[16]}</div>
                      <div className='changeNewBorderColor vidCapture21_16'>{videos[15]}</div>
                      <div className='changeNewBorderColor vidCapture21_15'>{videos[14]}</div>
                      <div className='changeNewBorderColor vidCapture21_14'>{videos[13]}</div>
                      <div className='changeNewBorderColor vidCapture21_13'>{videos[12]}</div>
                    </div>
                  </div>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_3'>{videos[2]}</div>
                    <div className='changeNewBorderColor vidCapture21_4'>{videos[3]}</div>
                    <div className='changeNewBorderColor vidCapture21_5'>{videos[4]}</div>
                    <div className='changeNewBorderColor vidCapture21_6'>{videos[5]}</div>
                    <div className='changeNewBorderColor vidCapture21_7'>{videos[6]}</div>
                    <div className='changeNewBorderColor vidCapture21_8'>{videos[7]}</div>
                    <div className='changeNewBorderColor vidCapture21_9'>{videos[8]}</div>
                    <div className='changeNewBorderColor vidCapture21_10'>{videos[9]}</div>
                  </div>
                </div>
              </div>
            ) : values === 24 ? (
              <div id='newMainContentAreaX24'>
                <div className='x22Header'>
                  <div className='changeNewBorderColor vidCapture22_22'>{videos[21]}</div>
                  <div className={title ? 'newMainContentHeaderBg24' : 'newMainContentHeaderBgZ24'}>
                    {/* <h3 className='banner_title'>{title} </h3> */}
                  </div>
                  <div className='changeNewBorderColor vidCapture24_24'>{videos[23]}</div>
                  <div className='changeNewBorderColor vidCapture23_23'>{videos[22]}</div>
                </div>
                <div className='x21Lower'>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture21_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture21_11'>{videos[10]}</div>
                    <div className='changeNewBorderColor vidCapture21_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture21_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture21_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture21_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture21_21'>{videos[20]}</div>
                  </div>
                  <div className='x18Middle'>
                    <div className='newMainContentMiddleX13'>
                      <div className='newMainContentRightInner'>
                        <div className='newMainContentRightInnerTextarea'>
                          <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                        </div>
                      </div>
                    </div>
                    <div className='x13BottomVidsAlt'>
                      <div className='changeNewBorderColor vidCapture21_17'>{videos[16]}</div>
                      <div className='changeNewBorderColor vidCapture21_16'>{videos[15]}</div>
                      <div className='changeNewBorderColor vidCapture21_15'>{videos[14]}</div>
                      <div className='changeNewBorderColor vidCapture21_14'>{videos[13]}</div>
                      <div className='changeNewBorderColor vidCapture21_13'>{videos[12]}</div>
                    </div>
                  </div>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_3'>{videos[2]}</div>
                    <div className='changeNewBorderColor vidCapture21_4'>{videos[3]}</div>
                    <div className='changeNewBorderColor vidCapture21_5'>{videos[4]}</div>
                    <div className='changeNewBorderColor vidCapture21_6'>{videos[5]}</div>
                    <div className='changeNewBorderColor vidCapture21_7'>{videos[6]}</div>
                    <div className='changeNewBorderColor vidCapture21_8'>{videos[7]}</div>
                    <div className='changeNewBorderColor vidCapture21_9'>{videos[8]}</div>
                    <div className='changeNewBorderColor vidCapture21_10'>{videos[9]}</div>
                  </div>
                </div>
              </div>
            ) : values === 23 ? (
              <div id='newMainContentAreaX23'>
                <div className='x22Header'>
                  <div className='changeNewBorderColor vidCapture22_22'>{videos[21]}</div>
                  <div className={title ? 'newMainContentHeaderBg23' : 'newMainContentHeaderBgZ23'}>
                    {/* <h3 className='banner_title'>{title} </h3> */}
                  </div>
                  <div
                    className='chan
                  geNewBorderColor vidCapture23_23'>
                    {videos[22]}
                  </div>
                </div>
                <div className='x21Lower'>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture21_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture21_11'>{videos[10]}</div>
                    <div className='changeNewBorderColor vidCapture21_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture21_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture21_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture21_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture21_21'>{videos[20]}</div>
                  </div>
                  <div className='x18Middle'>
                    <div className='newMainContentMiddleX13'>
                      <div className='newMainContentRightInner'>
                        <div className='newMainContentRightInnerTextarea'>
                          <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                        </div>
                      </div>
                    </div>
                    <div className='x13BottomVidsAlt'>
                      <div className='changeNewBorderColor vidCapture21_17'>{videos[16]}</div>
                      <div className='changeNewBorderColor vidCapture21_16'>{videos[15]}</div>
                      <div className='changeNewBorderColor vidCapture21_15'>{videos[14]}</div>
                      <div className='changeNewBorderColor vidCapture21_14'>{videos[13]}</div>
                      <div className='changeNewBorderColor vidCapture21_13'>{videos[12]}</div>
                    </div>
                  </div>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_3'>{videos[2]}</div>
                    <div className='changeNewBorderColor vidCapture21_4'>{videos[3]}</div>
                    <div className='changeNewBorderColor vidCapture21_5'>{videos[4]}</div>
                    <div className='changeNewBorderColor vidCapture21_6'>{videos[5]}</div>
                    <div className='changeNewBorderColor vidCapture21_7'>{videos[6]}</div>
                    <div className='changeNewBorderColor vidCapture21_8'>{videos[7]}</div>
                    <div className='changeNewBorderColor vidCapture21_9'>{videos[8]}</div>
                    <div className='changeNewBorderColor vidCapture21_10'>{videos[9]}</div>
                  </div>
                </div>
              </div>
            ) : values === 22 ? (
              <div id='newMainContentAreaX22'>
                <div className='x22Header'>
                  <div className='changeNewBorderColor vidCapture22_22'>{videos[22]}</div>
                  <div className={title ? 'newMainContentHeaderBg22' : 'newMainContentHeaderBgZ22'}>
                    {/* <h3 className='banner_title'>{title} </h3> */}
                  </div>
                </div>
                <div className='x21Lower'>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture21_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture21_11'>{videos[10]}</div>
                    <div className='changeNewBorderColor vidCapture21_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture21_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture21_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture21_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture21_21'>{videos[20]}</div>
                  </div>
                  <div className='x18Middle'>
                    <div className='newMainContentMiddleX13'>
                      <div className='newMainContentRightInner'>
                        <div className='newMainContentRightInnerTextarea'>
                          <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                        </div>
                      </div>
                    </div>
                    <div className='x13BottomVidsAlt'>
                      <div className='changeNewBorderColor vidCapture21_17'>{videos[16]}</div>
                      <div className='changeNewBorderColor vidCapture21_16'>{videos[15]}</div>
                      <div className='changeNewBorderColor vidCapture21_15'>{videos[14]}</div>
                      <div className='changeNewBorderColor vidCapture21_14'>{videos[13]}</div>
                      <div className='changeNewBorderColor vidCapture21_13'>{videos[12]}</div>
                    </div>
                  </div>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_3'>{videos[2]}</div>
                    <div className='changeNewBorderColor vidCapture21_4'>{videos[3]}</div>
                    <div className='changeNewBorderColor vidCapture21_5'>{videos[4]}</div>
                    <div className='changeNewBorderColor vidCapture21_6'>{videos[5]}</div>
                    <div className='changeNewBorderColor vidCapture21_7'>{videos[6]}</div>
                    <div className='changeNewBorderColor vidCapture21_8'>{videos[7]}</div>
                    <div className='changeNewBorderColor vidCapture21_9'>{videos[8]}</div>
                    <div className='changeNewBorderColor vidCapture21_10'>{videos[9]}</div>
                  </div>
                </div>
              </div>
            ) : values === 21 ? (
              <div id='newMainContentAreaX21'>
                <div className={title ? 'newMainContentHeaderBg21' : 'newMainContentHeaderBgZ21'}>
                  {/* <h3 className='banner_title'>{title} </h3> */}
                </div>
                <div className='x21Lower'>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture21_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture21_11'>{videos[10]}</div>
                    <div className='changeNewBorderColor vidCapture21_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture21_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture21_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture21_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture21_21'>{videos[20]}</div>
                  </div>
                  <div className='x18Middle'>
                    <div className='newMainContentMiddleX13'>
                      <div className='newMainContentRightInner'>
                        <div className='newMainContentRightInnerTextarea'>
                          <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                        </div>
                      </div>
                    </div>
                    <div className='x13BottomVidsAlt'>
                      <div className='changeNewBorderColor vidCapture21_17'>{videos[16]}</div>
                      <div className='changeNewBorderColor vidCapture21_16'>{videos[15]}</div>
                      <div className='changeNewBorderColor vidCapture21_15'>{videos[14]}</div>
                      <div className='changeNewBorderColor vidCapture21_14'>{videos[13]}</div>
                      <div className='changeNewBorderColor vidCapture21_13'>{videos[12]}</div>
                    </div>
                  </div>
                  <div className='x18Right'>
                    <div className='changeNewBorderColor vidCapture21_3'>{videos[2]}</div>
                    <div className='changeNewBorderColor vidCapture21_4'>{videos[3]}</div>
                    <div className='changeNewBorderColor vidCapture21_5'>{videos[4]}</div>
                    <div className='changeNewBorderColor vidCapture21_6'>{videos[5]}</div>
                    <div className='changeNewBorderColor vidCapture21_7'>{videos[6]}</div>
                    <div className='changeNewBorderColor vidCapture21_8'>{videos[7]}</div>
                    <div className='changeNewBorderColor vidCapture21_9'>{videos[8]}</div>
                    <div className='changeNewBorderColor vidCapture21_10'>{videos[9]}</div>
                  </div>
                </div>
              </div>
            ) : values === 20 ? (
              <div id='newMainContentAreaX20'>
                <div className='x11Left18'>
                  <div className='newMainContentLeftX20'>
                    <div className='changeNewBorderColor vidCapture20_1'>{videos[0]}</div>
                  </div>
                  <div className='x20BottomVidsAlt'>
                    <div className='changeNewBorderColor vidCapture20_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture20_20'>{videos[19]}</div>
                    <div className='changeNewBorderColor vidCapture20_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture20_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture20_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture20_11'>{videos[10]}</div>
                  </div>
                </div>
                <div className='x11Right18'>
                  <div className='x18Upper'>
                    <div className={title ? 'newMainContentHeaderBgX18' : 'newMainContentHeaderBgZX18'}>
                      {/* <h3 className='banner_title'>{title} </h3> */}
                    </div>
                  </div>
                  <div className='x18Lower'>
                    <div className='x18Middle'>
                      <div className='newMainContentMiddleX13'>
                        <div className='newMainContentRightInner'>
                          <div className='newMainContentRightInnerTextarea'>
                            <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                          </div>
                        </div>
                      </div>
                      <div className='x13BottomVidsAlt'>
                        <div className='changeNewBorderColor vidCapture20_17'>{videos[16]}</div>
                        <div className='changeNewBorderColor vidCapture20_16'>{videos[15]}</div>
                        <div className='changeNewBorderColor vidCapture20_15'>{videos[14]}</div>
                        <div className='changeNewBorderColor vidCapture20_14'>{videos[13]}</div>
                        <div className='changeNewBorderColor vidCapture20_13'>{videos[12]}</div>
                      </div>
                    </div>
                    <div className='x18Right'>
                      <div className='changeNewBorderColor vidCapture20_3'>{videos[2]}</div>
                      <div className='changeNewBorderColor vidCapture20_4'>{videos[3]}</div>
                      <div className='changeNewBorderColor vidCapture20_5'>{videos[4]}</div>
                      <div className='changeNewBorderColor vidCapture20_6'>{videos[5]}</div>
                      <div className='changeNewBorderColor vidCapture20_7'>{videos[6]}</div>
                      <div className='changeNewBorderColor vidCapture20_8'>{videos[7]}</div>
                      <div className='changeNewBorderColor vidCapture20_9'>{videos[8]}</div>
                      <div className='changeNewBorderColor vidCapture20_10'>{videos[9]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : values === 19 ? (
              <div id='newMainContentAreaX19'>
                <div className='x11Left18'>
                  <div className='newMainContentLeftX18'>
                    <div className='changeNewBorderColor vidCapture19_1'>{videos[0]}</div>
                    <div className='changeNewBorderColor vidCapture19_2'>{videos[1]}</div>
                  </div>
                  <div className='x18BottomVidsAlt'>
                    <div className='changeNewBorderColor vidCapture19_19'>{videos[18]}</div>
                    <div className='changeNewBorderColor vidCapture19_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture19_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture19_11'>{videos[10]}</div>
                  </div>
                </div>
                <div className='x11Right18'>
                  <div className='x18Upper'>
                    <div className={title ? 'newMainContentHeaderBgX18' : 'newMainContentHeaderBgZX18'}>
                      {/* <h3 className='banner_title'>{title} </h3> */}
                    </div>
                  </div>
                  <div className='x18Lower'>
                    <div className='x18Middle'>
                      <div className='newMainContentMiddleX13'>
                        <div className='newMainContentRightInner'>
                          <div className='newMainContentRightInnerTextarea'>
                            <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                          </div>
                        </div>
                      </div>
                      <div className='x13BottomVidsAlt'>
                        <div className='changeNewBorderColor vidCapture19_17'>{videos[16]}</div>
                        <div className='changeNewBorderColor vidCapture19_16'>{videos[15]}</div>
                        <div className='changeNewBorderColor vidCapture19_15'>{videos[14]}</div>
                        <div className='changeNewBorderColor vidCapture19_14'>{videos[13]}</div>
                        <div className='changeNewBorderColor vidCapture19_13'>{videos[12]}</div>
                      </div>
                    </div>
                    <div className='x18Right'>
                      <div className='changeNewBorderColor vidCapture19_3'>{videos[2]}</div>
                      <div className='changeNewBorderColor vidCapture19_4'>{videos[3]}</div>
                      <div className='changeNewBorderColor vidCapture19_5'>{videos[4]}</div>
                      <div className='changeNewBorderColor vidCapture19_6'>{videos[5]}</div>
                      <div className='changeNewBorderColor vidCapture19_7'>{videos[6]}</div>
                      <div className='changeNewBorderColor vidCapture19_8'>{videos[7]}</div>
                      <div className='changeNewBorderColor vidCapture19_9'>{videos[8]}</div>
                      <div className='changeNewBorderColor vidCapture19_10'>{videos[9]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : values === 18 ? (
              <div id='newMainContentAreaX18'>
                <div className='x11Left18'>
                  <div className='newMainContentLeftX18'>
                    <div className='changeNewBorderColor vidCapture18_1'>{videos[0]}</div>
                  </div>
                  <div className='x18BottomVidsAlt'>
                    <div className='changeNewBorderColor vidCapture18_2'>{videos[1]}</div>
                    <div className='changeNewBorderColor vidCapture18_18'>{videos[17]}</div>
                    <div className='changeNewBorderColor vidCapture18_12'>{videos[11]}</div>
                    <div className='changeNewBorderColor vidCapture18_11'>{videos[10]}</div>
                  </div>
                </div>
                <div className='x11Right18'>
                  <div className='x18Upper'>
                    <div className={title ? 'newMainContentHeaderBgX18' : 'newMainContentHeaderBgZX18'}>
                      {/* <h3 className='banner_title'>{title} </h3> */}
                    </div>
                  </div>
                  <div className='x18Lower'>
                    <div className='x18Middle'>
                      <div className='newMainContentMiddleX13'>
                        <div className='newMainContentRightInner'>
                          <div className='newMainContentRightInnerTextarea'>
                            <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                          </div>
                        </div>
                      </div>
                      <div className='x13BottomVidsAlt'>
                        <div className='changeNewBorderColor vidCapture18_17'>{videos[16]}</div>
                        <div className='changeNewBorderColor vidCapture18_16'>{videos[15]}</div>
                        <div className='changeNewBorderColor vidCapture18_15'>{videos[14]}</div>
                        <div className='changeNewBorderColor vidCapture18_14'>{videos[13]}</div>
                        <div className='changeNewBorderColor vidCapture18_13'>{videos[12]}</div>
                      </div>
                    </div>
                    <div className='x18Right'>
                      <div className='changeNewBorderColor vidCapture18_3'>{videos[2]}</div>
                      <div className='changeNewBorderColor vidCapture18_4'>{videos[3]}</div>
                      <div className='changeNewBorderColor vidCapture18_5'>{videos[4]}</div>
                      <div className='changeNewBorderColor vidCapture18_6'>{videos[5]}</div>
                      <div className='changeNewBorderColor vidCapture18_7'>{videos[6]}</div>
                      <div className='changeNewBorderColor vidCapture18_8'>{videos[7]}</div>
                      <div className='changeNewBorderColor vidCapture18_9'>{videos[8]}</div>
                      <div className='changeNewBorderColor vidCapture18_10'>{videos[9]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id={`newMainContentAreaX${values}`}>
                {values >= 11 ? (
                  <React.Fragment>
                    <div className={'x11Left'}>
                      <div className={title ? 'newMainContentHeaderBgX12' : 'newMainContentHeaderBgZX12'}>
                        {/* <h3 className='banner_title'>{title} </h3> */}
                      </div>
                      <div className={'newMainContentMain'}>
                        <div className={`newMainContentLeft${values >= 12 ? 'X11' : values > 1 ? `X${values}` : ''}`}>
                          {handleLeftImages()?.map((item) => item)}
                        </div>
                        {values >= 13 ? (
                          <div className='x13Middle'>
                            <div className='newMainContentMiddleX13'>
                              <div className='newMainContentRightInner'>
                                <div className='newMainContentRightInnerTextarea'>
                                  <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                                </div>
                              </div>
                            </div>
                            <div className='x13BottomVids'>{handleBottomImages()?.map((item) => item)}</div>
                          </div>
                        ) : (
                          <div
                            className={`${
                              values >= 12 ? 'newMainContentMiddleX11' : values > 1 ? `newMainContentMiddleX${values}` : 'newMainContentRight'
                            }`}>
                            <div className='newMainContentRightInner'>
                              <div className='newMainContentRightInnerTextarea'>
                                <div className='newMainContentRightInnerTextarea'>{activeVideo}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='x11Right'>{handleRightImages()?.map((item) => item)}</div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className={title ? 'newMainContentHeaderBg' : 'newMainContentHeaderBgZ'}></div>
                    <div className='newMainContentMain'>
                      <div className={`newMainContentLeft${values > 1 ? `X${values}` : ''}`}>{handleLeftImages()?.map((item) => item)}</div>
                      <div className={`${values > 1 ? `newMainContentMiddleX${values}` : 'newMainContentRight'}`}>
                        <div className='newMainContentRightInner'>
                          <div id='newMainContentRightInnerTextarea' className='newMainContentRightInnerTextarea'>
                            {activeVideo}
                          </div>
                        </div>
                      </div>
                      <div className={`newMainContentRightX${values}`}>{handleRightImages()?.map((item) => item)}</div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
          <div className='container_FM'>
            <div style={{ width: '90%' }}>
              <div style={{ marginBottom: '10px' }}>
                <img height='50' width='100%' src={title ? '/assets/bannerText.png' : '/assets/bannerlogo.png'} alt='' />
              </div>
              <div style={{ marginBottom: '10px' }} className='MiddleSection'>
                <div id='middleSectionInnerContainer' className='middleSectionInnerContainer'>
                  {activeVideo}
                </div>
              </div>
              <div style={{ marginBottom: '10px' }} className='videoCaptureConatainer'>
                {handleImagesForMobile()?.map((item) => item)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Grid;
