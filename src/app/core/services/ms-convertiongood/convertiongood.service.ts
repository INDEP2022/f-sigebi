import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConvertiongoodEndpoints } from 'src/app/common/constants/endpoints/ms-convertiongood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAssetConversion } from '../../models/ms-convertiongood/asset-conversion';
import { IConvertiongood } from '../../models/ms-convertiongood/convertiongood';

@Injectable({
  providedIn: 'root',
})
export class ConvertiongoodService extends HttpService {
  constructor() {
    super();
    this.microservice = ConvertiongoodEndpoints.Convertiongood;
  }

  getAll(params?: ListParams): Observable<IListResponse<IConvertiongood>> {
    return this.get<IListResponse<IConvertiongood>>(
      ConvertiongoodEndpoints.Convertiongood,
      params
    );
  }

  getById(id: string | number) {
    const route = `${ConvertiongoodEndpoints.Convertion}/${id}`;
    return this.get<IConvertiongood>(route);
  }

  create(good: IConvertiongood) {
    return this.post(ConvertiongoodEndpoints.Convertion, good);
  }

  update(id: string | number, good: IConvertiongood) {
    const route = `${ConvertiongoodEndpoints.Convertion}/${id}`;
    return this.put(route, good);
  }

  remove(id: string | number) {
    const route = `${ConvertiongoodEndpoints.Convertion}/${id}`;
    return this.delete(route);
  }

  getActsByGood(id: string | number) {
    const route = `${ConvertiongoodEndpoints.Convertion}/procedure/returnMinutes/${id}`;
    return this.get(route);
  }
  createAssetConversions(assetConversions: IAssetConversion) {
    return this.post(
      ConvertiongoodEndpoints.AssetConversions,
      assetConversions
    );
  }
}
