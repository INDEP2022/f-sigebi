import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs';
import { HttpService } from '../services/http.service';
@Injectable({ providedIn: 'root' })
export class SocketService extends HttpService {
  constructor(private socket: Socket) {
    super();
  }
  test() {
    return this.socket.fromEvent('prueba').pipe(
      tap(res => {
        console.log('Conexion establecida');
        console.log({ res });
      })
    );
  }
}
