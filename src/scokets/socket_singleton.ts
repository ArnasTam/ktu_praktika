import { Server as SocketServer } from 'socket.io';

class SocketSingleton {
  private static instance: SocketSingleton;
  private io: SocketServer;

  private constructor() {
    this.io = null;
  }

  public static getInstance(): SocketSingleton {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton();
    }

    return SocketSingleton.instance;
  }

  public configure(server): void {
    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.io.on('connection', function (socket) {
      socket.on('join', function (data) {
        socket.join(data.email);
      });
    });
  }

  public getIO(): SocketServer {
    return this.io;
  }
}

export default SocketSingleton;
