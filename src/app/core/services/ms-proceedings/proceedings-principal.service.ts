import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProceedings } from '../../models/ms-proceedings/proceedings.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsPrincipalService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.Proceedings;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getAll2(self?: ProceedingsPrincipalService, params?: string | ListParams) {
    return self.get<IListResponse<IProceedings>>(self.endpoint, params);
  }

  getAll(params?: ListParams): Observable<IListResponse<IProceedings>> {
    return this.get<IListResponse<IProceedings>>(this.endpoint, params).pipe(
      map(items => {
        return {
          ...items,
          data: items.data.map(item => {
            return { ...item, ingreso: '' };
          }),
        };
      })
    );
  }
}
