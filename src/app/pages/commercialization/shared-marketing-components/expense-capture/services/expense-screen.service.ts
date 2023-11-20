import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ScreenStatusEndpoints } from 'src/app/common/constants/endpoints/ms-screen-status-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IResponse } from 'src/app/core/interfaces/list-response.interface';
import { IScreenPUPValRoboDTO } from '../models/screen-dto';

@Injectable({
  providedIn: 'root',
})
export class ExpenseScreenService extends HttpService {
  private readonly endpoint = ScreenStatusEndpoints;
  constructor() {
    super();
    this.microservice = ScreenStatusEndpoints.BasePath;
  }

  PUP_VAL_BIEN_ROBO(body: IScreenPUPValRoboDTO) {
    return this.post<IResponse<any>>(this.endpoint.PUP_VAL_BIEN_ROBO, body);
  }

  PUF_VAL_CONCEP_ROBO(id_concepto: string) {
    return this.get<IResponse<any>>(
      this.endpoint.PUF_VAL_CONCEP_ROBO + '/FCOMER084/' + id_concepto
    ).pipe(
      catchError(x => of({ count: 0 })),
      map(x => x.count)
    );
  }
}
