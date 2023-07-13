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
  goodsTrackerExcel() {
    return this.socket.fromEvent('tracker_good').pipe(
      tap(res => {
        console.log('Conexion establecida');
        console.log({ res });
      })
    );
  }

  exportGoodsTrackerPhotos() {
    return this.socket.fromEvent('tracker_good_photo').pipe(
      tap(res => {
        console.log('Conexion establecida');
        console.log({ res });
      })
    );
  }
}
