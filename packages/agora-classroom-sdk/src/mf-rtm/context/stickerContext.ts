import { useDispatch } from 'react-redux';
import socket from '../services/meeting.socket';
import {
  //   addUserProfile,
  //   addTeacherProfile,
  //   replaceAllUsersProfile,
  //   addOrRemoveUserEmoji,
  //   addOrRemoveUserInstrument,
  //   addOrRemoveTeacherEmoji,
  //   addOrRemoveTeacherInstruments,
  //   addOrRemoveTeacherAssignedSticker,
  //   addOrRemoveTeacherAssignedInstrumentSticker,
  //   toggleChatPanelState,
  //   updateActiveVideoCapture,
  updateInitialState,
} from '../slices/StickerSlice';

function useStickerContext() {
  const dispatch = useDispatch();

  const subscribeToEmojiStickerSocket = (roomName?: any) => {
    socket.emojiStickers.subscribe(roomName, (payload: any) => {
      console.log('this is payload >>>>>>', payload);
      dispatch(updateInitialState(payload));
    });
  };

  const unSubscribeToEmojiStickerSocket = (roomName: any) => {
    socket.emojiStickers.unsubscribe(roomName);
  };
  const publishStickerEmojiToSocket = (roomName: any, payload: any, roomId: any) => {
    socket.emojiStickers.publish(roomName, payload, roomId);
  };
  const subscribeToSticker = (roomName?: any) => {
    socket.stickers.subscribe(roomName, (payload: any) => {
      console.log('this is sticker update payload >>>>>>', payload);
      dispatch(updateInitialState(payload));
    });
  };
  const unSubscribeToStickerSocket = (roomName: any) => {
    socket.stickers.unsubscribe(roomName);
  };
  const publishStickerToSocket = (roomName: any, payload: any, roomId: any) => {
    socket.stickers.publish(roomName, payload, roomId);
  };
  const subscribeToChatWidget = (roomName?: any) => {
    socket.chatWidget.subscribe(roomName, (payload: any) => {
      // dispatch(addOrRemoveTeacherInstruments(payload));
    });
  };
  const unSubscribeChatWidget = (roomName: any) => {
    socket.chatWidget.unsubscribe(roomName);
  };
  const publishChatWidget = (roomName: any, payload: any, roomId: any) => {
    socket.chatWidget.publish(roomName, payload, roomId);
  };
  // const subscribeToTeacherEmojiSticker = (roomName?: any) => {
  //   socket.teacherEmojiStickers.subscribe(roomName, (payload: any) => {
  //     dispatch(addOrRemoveTeacherEmoji(payload));
  //   });
  // };
  // const unSubscribeTeacherToEmojiStickerSocket = (roomName: any) => {
  //   socket.teacherEmojiStickers.unsubscribe(roomName);
  // };
  // const publishStickerTeacherEmojiToSocket = (roomName: any, payload: any) => {
  //   socket.teacherEmojiStickers.publish(roomName, payload);
  // };
  // // teacher Assigned Emojis
  // const subscribeToTeacherAssignedSticker = (roomName: any) => {
  //   socket.stickerAssignedByTeacher.subscribe(roomName, (payload: any) => {
  //     dispatch(addOrRemoveTeacherAssignedSticker(payload));
  //   });
  // };
  // const unSubscribeToTeacherAssignedSticker = (roomName: any) => {
  //   socket.stickerAssignedByTeacher.unsubscribe(roomName);
  // };
  // const publishToTeacherAssignedSticker = (roomName: any, payload: any) => {
  //   socket.stickerAssignedByTeacher.publish(roomName, payload);
  // };
  // const subscribeToTeacherAssignedInstrumentSticker = (roomName: any) => {
  //   socket.instrumentStickerAssignedByTeacher.subscribe(roomName, (payload: any) => {
  //     dispatch(addOrRemoveTeacherAssignedInstrumentSticker(payload));
  //   });
  // };
  // const unSubscribeToTeacherAssignedInstrumentSticker = (roomName: any) => {
  //   socket.instrumentStickerAssignedByTeacher.unsubscribe(roomName);
  // };
  // const publishToTeacherAssignedInstrumentSticker = (roomName: any, payload: any) => {
  //   socket.instrumentStickerAssignedByTeacher.publish(roomName, payload);
  // };
  return {
    subscribeToEmojiStickerSocket,
    subscribeToSticker,
    subscribeToChatWidget,
    //   subscribeToInstrumentSticker,
    //   subscribeToTeacherEmojiSticker,
    //   subscribeToTeacherInstrumentSticker,
    //   subscribeToTeacherAssignedSticker,
    //   subscribeToTeacherAssignedInstrumentSticker,
    //   unSubscribeTeacherToInstrumentStickerSocket,
    //   unSubscribeToTeacherAssignedInstrumentSticker,
    unSubscribeToEmojiStickerSocket,
    unSubscribeChatWidget,
    //   unSubscribeToTeacherAssignedSticker,
    //   unSubscribeToInstrumentStickerSocket,
    //   unSubscribeTeacherToEmojiStickerSocket,
    publishStickerEmojiToSocket,
    publishStickerToSocket,
    publishChatWidget,
    //   publishStickerTeacherInstrumentToSocket,
    //   publishToTeacherAssignedInstrumentSticker,
    //   publishStickerTeacherEmojiToSocket,
    //   publishStickerInstrumentToSocket,
    //   publishToTeacherAssignedSticker,
    //   addUserProfile,
    //   addTeacherProfile,
    //   addOrRemoveUserEmoji,
    //   addOrRemoveUserInstrument,
    //   addOrRemoveTeacherEmoji,
    //   addOrRemoveTeacherInstruments,
  };
}

export function useSyncStatesContext() {
  // const dispatch = useDispatch();
  // const syncStatesSubscribe = (roomName: any) => {
  //   socket.syncUsersStates.subscribe(roomName, (payload: any) => {
  //     dispatch(addUserProfile(payload));
  //   });
  // };
  // const syncStatesUnSubscribe = (roomName: any) => {
  //   socket.syncUsersStates.unsubscribe(roomName);
  // };
  // const syncStatesPublish = (roomName: any, payload: any) => {
  //   socket.syncUsersStates.publish(roomName, payload);
  // };
  // const syncTeacherStateSubscribe = (roomName: any) => {
  //   socket.syncTeacherStates.subscribe(roomName, (payload: any) => {
  //     dispatch(addTeacherProfile(payload));
  //   });
  // };
  // const syncTeacherStateUnSubscribe = (roomName: any) => {
  //   socket.syncTeacherStates.unsubscribe(roomName);
  // };
  // const syncTeacherStatePublish = (roomName: any, payload: any) => {
  //   socket.syncTeacherStates.publish(roomName, payload);
  // };
  // return {
  //   addTeacherProfile,
  //   replaceAllUsersProfile,
  //   addOrRemoveUserEmoji,
  //   addOrRemoveUserInstrument,
  //   addOrRemoveTeacherEmoji,
  //   addOrRemoveTeacherInstruments,
  //   syncStatesSubscribe,
  //   syncStatesUnSubscribe,
  //   syncStatesPublish,
  //   syncTeacherStateSubscribe,
  //   syncTeacherStatePublish,
  //   syncTeacherStateUnSubscribe,
  // };
}

export function useChatPanelSyncState() {
  // const dispatch = useDispatch();
  // const subscribeChatPanelToggle = (roomName: any) => {
  //   socket.chatPanelToogle.subscribe(roomName, (payload: any) => {
  //     dispatch(toggleChatPanelState(payload));
  //   });
  // };
  // const unsubscribeChatPanelToggle = (roomName: any) => {
  //   socket.chatPanelToogle.unsubscribe(roomName);
  // };
  // const chatPanelStatePublish = (roomName: any, payload: any) => {
  //   socket.chatPanelToogle.publish(roomName, payload);
  // };
  // return {
  //   subscribeChatPanelToggle,
  //   unsubscribeChatPanelToggle,
  //   chatPanelStatePublish,
  // };
}

export function useVideoCaptureHighLight() {
  // const dispatch = useDispatch();
  // const subscribeVideoCaptureHighLight = (roomName: any) => {
  //   socket.highlightVideoCapture.subscribe(roomName, (payload: any) => {
  //     console.log('this is console from video capture >>>>>>>', payload);
  //     dispatch(updateActiveVideoCapture(payload));
  //   });
  // };
  // const unsubscribeVideoCaptureHighLight = (roomName: any) => {
  //   socket.highlightVideoCapture.unsubscribe(roomName);
  // };
  // const videoCaptureHighLightPublish = (roomName: any, payload: any) => {
  //   socket.highlightVideoCapture.publish(roomName, payload);
  // };
  // return {
  //   subscribeVideoCaptureHighLight,
  //   unsubscribeVideoCaptureHighLight,
  //   videoCaptureHighLightPublish,
  // };
}

export default useStickerContext;
