//@ts-ignore
import { io, Socket } from 'socket.io-client';

export default class SocketService {
  protected static client: Socket;

  static connect(channel: string): void {
    const endpoint = `https://${process.env.REACT_APP_API_HOST}`;
    this.client = io(endpoint);
    // this.client.on('connect', () => {
    //   // console.log(`Socket connected >>>>>`, this.client.id);
    // });

    this.client.emit('join-room', channel, (message: any) => {
      console.log(`room joined: ${message} !`);
    });
  }

  static subscribe(channel: string, callback: (payload: any) => void): void {
    this.client.on(channel, (payload: any) => callback(payload));
  }

  static unsubscribe(channel: string): void {
    this.client.close();
  }

  static publish(channel: string, payload: any, roomId: any): void {
    this.client.emit(channel, payload, roomId);
  }
}
