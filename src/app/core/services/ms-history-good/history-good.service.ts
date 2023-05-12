import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryGoodEndpoints } from 'src/app/common/constants/endpoints/ms-historygood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IHistoryGood,
  ISentSirsae,
} from '../../models/administrative-processes/history-good.model';

@Injectable({
  providedIn: 'root',
})
export class HistoryGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = HistoryGoodEndpoints.HistoryGood;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IHistoryGood>> {
    return this.get<IListResponse<IHistoryGood>>(
      HistoryGoodEndpoints.HistoryStatusGood,
      params
    );
  }

  getAllFilter(params?: string): Observable<IListResponse<IHistoryGood>> {
    return this.get<IListResponse<IHistoryGood>>(
      `${HistoryGoodEndpoints.HistoryStatusGood}?${params}`
    );
  }

  getById(id: string | number) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}/${id}`;
    return this.get<IHistoryGood>(route);
  }

  create(documents: IHistoryGood) {
    return this.post<IHistoryGood>(
      HistoryGoodEndpoints.HistoryStatusGood,
      documents
    );
  }

  sentSirsae(data: ISentSirsae) {
    return this.post<ISentSirsae>(HistoryGoodEndpoints.SentSirsae, data);
  }

  update(id: string | number, documents: IHistoryGood) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}/${id}`;
    return this.put(route, documents);
  }

  remove(id: string | number) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}/${id}`;
    return this.delete(route);
  }
  getByGoodAndProcess(
    idGood: string | number,
    process: string
  ): Observable<IListResponse<IHistoryGood>> {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}?filter.propertyNum=$eq:${idGood}&filter.extDomProcess=$not:${process}`;
    /* const route = `http://sigebimsqa.indep.gob.mx/historygood/api/v1/historical-status-good`;
    console.log(routess); */
    return this.get<IListResponse<IHistoryGood>>(route);
  }

  getHistoryStatusGoodById(query: any) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGoodFindById}`;
    return this.post(route, query);
  }
}
