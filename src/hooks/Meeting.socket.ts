import { call } from 'ionicons/icons';
import SocketService from './SocketService';
import { MeetingMode, MeetingWhiteboardDrawingsState, MeetingWhiteboardDrawingState } from '../slices/userVideoSlice';

interface BorderColorReplacedPayload {
  connectionId: string;
  borderColor: string;
}
export interface WhiteboardSync {
  drawings: MeetingWhiteboardDrawingsState;
  whiteboardEnabled: boolean;
}

export default {
  raiseHand: {
    channel(meetingId: string) {
      return `/raiseHand/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },
  removeRaiseHand: {
    channel(meetingId: string) {
      return `/removeRaiseHand/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },
  conferenceCall: {
    channel(meetingId: string) {
      return `/conferenceCall/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },

  remoteDisconnect: {
    channel(meetingId: string) {
      return `/remoteDisconnect/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },

  memberRemove: {
    channel(meetingId: string) {
      return `/memberRemove/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },

  PopOutUserOnDisconnect: {
    channel(meetingId: string) {
      return `/popOutUserOnDisconnect/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },

  // muteUsers: {
  //   channel(meetingId: string) {
  //     return `/muteUsers/${meetingId}`;
  //   },
  //   subscribe(meetingId: string, callback: (connectionId: string) => void) {
  //     SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
  //   },
  //   unsubscribe(meetingId: string) {
  //     SocketService.unsubscribe(this.channel(meetingId));
  //   },
  //   publish(meetingId: string, connectionId: string) {
  //     SocketService.publish(this.channel(meetingId), connectionId);
  //   },
  // },

  replaceActiveVideoBlock: {
    channel(meetingId: string) {
      return `/replaceActiveVideoBlock/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (connectionId: string) => void) {
      SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, connectionId: string) {
      SocketService.publish(this.channel(meetingId), connectionId);
    },
  },
  // shareScreenRemove: {
  //   channel(meetingId: string) {
  //     return `/shareScreenRemove/${meetingId}`;
  //   },
  //   subscribe(meetingId: string, callback: (videoKind: VideoStateKind) => void) {
  //     SocketService.subscribe(this.channel(meetingId), (videoKind: VideoStateKind) => callback(videoKind));
  //   },
  //   unsubscribe(meetingId: string) {
  //     SocketService.unsubscribe(this.channel(meetingId));
  //   },
  //   publish(meetingId: string, videoKind: VideoStateKind) {
  //     SocketService.publish(this.channel(meetingId), videoKind);
  //   },
  // },
  videoBorderChange: {
    channel(meetingId: string) {
      return `/videoBorderChange/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (payload: BorderColorReplacedPayload) => void) {
      SocketService.subscribe(this.channel(meetingId), (payload: BorderColorReplacedPayload) => callback(payload));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, payload: BorderColorReplacedPayload) {
      SocketService.publish(this.channel(meetingId), payload);
    },
  },

  shareImageToPeer: {
    channel(meetingId: string) {
      return `/shareImageToPeer/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (payload: string | null) => void) {
      SocketService.subscribe(this.channel(meetingId), (payload: string | null) => callback(payload));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, payload: string | null) {
      SocketService.publish(this.channel(meetingId), payload);
    },
  },
  // ActiveVideoBlockSync: {
  //   channel(meetingId: string) {
  //     return `/ActiveVideoBlockSync/${meetingId}`;
  //   },
  //   subscribe(meetingId: string, callback: (connectionId: string) => void) {
  //     SocketService.subscribe(this.channel(meetingId), (connectionId: string) => callback(connectionId));
  //   },
  //   unsubscribe(meetingId: string) {
  //     SocketService.unsubscribe(this.channel(meetingId));
  //   },
  //   publish(meetingId: string, connectionId: string) {
  //     SocketService.publish(this.channel(meetingId), connectionId);
  //   },
  // },

  meetingMode: {
    channel(meetingId: string) {
      return `/meetingMode/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (payload: MeetingMode) => void) {
      SocketService.subscribe(this.channel(meetingId), (payload: MeetingMode) => callback(payload));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, payload: MeetingMode) {
      SocketService.publish(this.channel(meetingId), payload);
    },
  },

  whiteboardEnabled: {
    channel(meetingId: string) {
      return `/whiteboardEnabled/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (whiteboardEnabled: boolean) => void) {
      SocketService.subscribe(this.channel(meetingId), (whiteboardEnabled: boolean) => callback(whiteboardEnabled));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, whiteboardEnabled: boolean) {
      SocketService.publish(this.channel(meetingId), whiteboardEnabled);
    },
  },

  whiteboardDrawingSync: {
    channel(connectionId: string) {
      return `/whiteboardDrawingSync/${connectionId}`;
    },
    subscribe(connectionId: string, callback: (whiteboardSync: WhiteboardSync) => void) {
      SocketService.subscribe(this.channel(connectionId), (whiteboardSync: WhiteboardSync) => callback(whiteboardSync));
    },
    unsubscribe(connectionId: string) {
      SocketService.unsubscribe(this.channel(connectionId));
    },
    publish(connectionId: string, whiteboardSync: WhiteboardSync) {
      SocketService.publish(this.channel(connectionId), whiteboardSync);
    },
  },

  whiteboardDrawingAdd: {
    channel(meetingId: string) {
      return `/whiteboardDrawingAdd/${meetingId}`;
    },
    subscribe(meetingId: string, callback: (drawing: MeetingWhiteboardDrawingState) => void) {
      SocketService.subscribe(this.channel(meetingId), (drawing: MeetingWhiteboardDrawingState) => callback(drawing));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, drawing: MeetingWhiteboardDrawingState) {
      SocketService.publish(this.channel(meetingId), drawing);
    },
  },

  whiteboardCanvasClear: {
    channel(meetingId: string) {
      return `/whiteboardCanvasClear/${meetingId}`;
    },
    subscribe(meetingId: string, callback: () => void) {
      SocketService.subscribe(this.channel(meetingId), callback);
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string) {
      SocketService.publish(this.channel(meetingId), null);
    },
  },
};
