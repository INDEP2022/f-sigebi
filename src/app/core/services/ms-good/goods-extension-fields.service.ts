import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsExtensionsField } from '../../models/ms-good/goods-extensions-field.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsExtensionFieldsService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAllFilter(
    params?: string
  ): Observable<IListResponse<IGoodsExtensionsField>> {
    return this.get<IListResponse<IGoodsExtensionsField>>(
      `${GoodEndpoints.GoodsExtensionFields}?${params}`
    );
  }
}
