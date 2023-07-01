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
  selectedGoods: number[];
  selectedProceeding: number;
  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getById(id: string) {
    return this.get<IAttribGoodBad>(GoodEndpoints.AttribGoodBadId + '/' + id);
  }

  update(model: IAttribGoodBad) {
    return this.put(GoodEndpoints.AttribGoodBadId, model);
  }

  remove(model: IAttribGoodBad) {
    return this.delete(GoodEndpoints.AttribGoodBadId, model);
  }

  getAll(params?: _Params): Observable<IListResponseMessage<IAttribGoodBad>> {
    return this.get<IListResponseMessage<IAttribGoodBad>>(
      GoodEndpoints.AttribGoodBad,
      params
    ).pipe(
      map(x => {
        return {
          ...x,
          data: x.data.map(item => {
            return {
              ...item,
              id: item.id.id,
            };
          }),
        };
      })
    );
  }

  getAllModalSelectedGoods(
    self?: AttribGoodBadService,
    params?: _Params
  ): Observable<IListResponseMessage<IAttribGoodBad>> {
    return self
      .get<IListResponseMessage<IAttribGoodBad>>(
        `attrib-good-bad?filter.pair1=3${
          (self.selectedProceeding
            ? '&filter.pair2=' + self.selectedProceeding
            : '') +
          (self.selectedGoods
            ? '&filter.id=$in:' + String(self.selectedGoods)
            : '')
        }`,
        /* 'attrib-good-bad' + self.selectedGoods
          ? '?filter.id=$in:' + String(self.selectedGoods)
          : '' */ params
      )
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
