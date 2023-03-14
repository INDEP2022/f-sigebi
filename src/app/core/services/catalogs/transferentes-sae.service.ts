import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferentesSaeEndpoints } from 'src/app/common/constants/endpoints/transferentes-sae-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IState } from '../../models/catalogs/state-model';
import { ITransferenteSae } from '../../models/catalogs/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class TransferentesSaeService extends HttpService {
  constructor() {
    super();
    this.microservice = TransferentesSaeEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITransferenteSae>> {
    return this.get<IListResponse<ITransferenteSae>>(
      TransferentesSaeEndpoints.TransferentesSae,
      params
    );
  }

  getStateByTransferent(
    id: string | number
  ): Observable<IListResponse<IState>> {
    const route = `${TransferentesSaeEndpoints.GetEntityTransferentByState}/${id}`;
    return this.get(route);
  }
}
