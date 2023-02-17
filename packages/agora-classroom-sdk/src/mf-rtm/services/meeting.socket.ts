import SocketService from './socket.service';

export default {
  emojiStickers: {
    channel(channel: string) {
      return channel;
    },
    subscribe(meetingId: string, callback: (payload: any) => void) {
      SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, payload: any, roomId: any) {
      SocketService.publish(this.channel(meetingId), payload, roomId);
    },
  },

  stickers: {
    channel(meetingId: string) {
      return meetingId;
    },
    subscribe(meetingId: string, callback: (payload: any) => void) {
      SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, payload: any, roomId: any) {
      SocketService.publish(this.channel(meetingId), payload, roomId);
    },
  },
  chatWidget: {
    channel(meetingId: string) {
      return meetingId;
    },
    subscribe(meetingId: string, callback: (payload: any) => void) {
      SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
    },
    unsubscribe(meetingId: string) {
      SocketService.unsubscribe(this.channel(meetingId));
    },
    publish(meetingId: string, payload: any, roomId: any) {
      SocketService.publish(this.channel(meetingId), payload, roomId);
    },
  },
};

//   teacherEmojiStickers: {
//     channel(meetingId: string) {
//       return `/teacherEmojiStickers/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
//   syncUsersStates: {
//     channel(meetingId: string) {
//       return `/syncUsersStates/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
//   syncTeacherStates: {
//     channel(meetingId: string) {
//       return `/syncTeacherStates/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
//   stickerAssignedByTeacher: {
//     channel(meetingId: string) {
//       return `/stickerAssignedByTeacher/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
//   instrumentStickerAssignedByTeacher: {
//     channel(meetingId: string) {
//       return `/instrumentStickerAssignedByTeacher/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
//   chatPanelToogle: {
//     channel(meetingId: string) {
//       return `/chatPanelToogle/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
//   highlightVideoCapture: {
//     channel(meetingId: string) {
//       return `/highlightVideoCapture/${meetingId}`;
//     },
//     subscribe(meetingId: string, callback: (payload: any) => void) {
//       SocketService.subscribe(this.channel(meetingId), (payload: any) => callback(payload));
//     },
//     unsubscribe(meetingId: string) {
//       SocketService.unsubscribe(this.channel(meetingId));
//     },
//     publish(meetingId: string, payload: any) {
//       SocketService.publish(this.channel(meetingId), payload);
//     },
//   },
// };
