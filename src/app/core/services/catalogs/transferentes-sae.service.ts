import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferentesSaeEndpoints } from 'src/app/common/constants/endpoints/transferentes-sae-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IState, IStateByTransferent } from '../../models/catalogs/state-model';
import { ITransferente } from '../../models/catalogs/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class TransferentesSaeService extends HttpService {
  constructor() {
    super();
    this.microservice = TransferentesSaeEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITransferente>> {
    return this.get<IListResponse<ITransferente>>(
      TransferentesSaeEndpoints.TransferentesSae,
      params
    );
  }

  getStateByTransferent(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IState>> {
    const route = `${TransferentesSaeEndpoints.EntityTransferring}?filter.idTransferee=${id}`;
    return this.get(route, params);
  }
  getStateByTransferentKey(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IState>> {
    const route = `${TransferentesSaeEndpoints.EntityTransferring}?filter.stateKey=${id}`;
    return this.get(route, params);
  }

  createStateForTransferent(model: IStateByTransferent) {
    return this.post(TransferentesSaeEndpoints.EntityTransferring, model);
  }

  updateStateForTransferent(model: IStateByTransferent) {
    return this.put(TransferentesSaeEndpoints.EntityTransferring, model);
  }
}
