import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IAttribGoodBad } from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class AttribGoodBadService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: _Params): Observable<IListResponseMessage<IAttribGoodBad>> {
    return this.get<IListResponseMessage<IAttribGoodBad>>(
      GoodEndpoints.AttribGoodBad,
      params
    );
  }

  getAllModal(
    self?: AttribGoodBadService,
    params?: _Params
  ): Observable<IListResponseMessage<IAttribGoodBad>> {
    return self
      .get<IListResponseMessage<IAttribGoodBad>>('attrib-good-bad', params)
      .pipe(
        map(response => {
          return {
            ...response,
            data: response.data.map(item => {
              return { ...item, id: item.id.goodId };
            }),
          };
        })
      );
  }
}
