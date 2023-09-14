import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { HttpService } from '../services/http.service';
@Injectable({ providedIn: 'root' })
export class SocketService extends HttpService {
  constructor(
    private socket: Socket,
    private goodTrackerService: GoodTrackerService
  ) {
    super();
  }
  goodsTrackerExcel(token: string) {
    return this.socket.fromEvent(token).pipe(
      tap(res => {
        console.log('Conexion establecida');
        console.log({ res });
      })
    );
  }

  exportGoodsTrackerPhotos(token: string) {
    return this.socket.fromEvent(token).pipe(
      tap(res => {
        console.log('Conexion establecida');
        console.log({ res });
      })
    );
  }
}
