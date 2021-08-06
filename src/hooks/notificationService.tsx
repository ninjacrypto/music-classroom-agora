import { Howl } from 'howler';

function notificationService() {
  const playNotification = () => {
    const notification = new Howl({ src: ['/assets/notification.mp3'] });
    notification.play();
  };
  return {
    playNotification,
  };
}

export default notificationService;
