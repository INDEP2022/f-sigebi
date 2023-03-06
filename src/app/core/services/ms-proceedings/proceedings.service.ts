import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProceedings } from '../../models/ms-proceedings/proceedings.model';
import { ProceedingsEndpoints } from './../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IUpdateProceedings } from './../../models/ms-proceedings/update-proceedings.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProeedingsDevolution;
  showErrorObs = new BehaviorSubject<boolean>(true);
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
    console.log(' PROCEEDINGS SERVICE CONSTRUCTOR');
  }

  // getAll(params?: ListParams): Observable<IListResponse<IProceedings>> {
  //   return this.get<IListResponse<IProceedings>>(this.endpoint);
  // }

  getActByFileNumber(
    fileNumber?: number,
    params?: ListParams
  ): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(
      `${this.endpoint}?filter.fileNumber=${fileNumber}`,
      params
    );
  }

  update(id: string | number, proceeding: IUpdateProceedings) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, proceeding);
  }

  getDetailProceedingsDevolutionByExpedient(
    fileNumber: string | number,
    params?: ListParams
  ) {
    return this.get<IListResponse<IProceedings>>(
      `${this.endpoint}?filter.fileNumber=${fileNumber}`
    );
  }

  remove(proceedingsNumb: number) {
    return this.delete<IListResponse<IProceedings>>(
      `${this.endpoint}/${proceedingsNumb}`
    );
  }
}
