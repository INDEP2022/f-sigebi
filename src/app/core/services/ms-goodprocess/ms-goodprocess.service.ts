import { Injectable } from '@angular/core';
import { GoodprocessEndpoints } from 'src/app/common/constants/endpoints/ms-goodprocess-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GoodprocessService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodprocessEndpoints.BasePath;
  }

  getById(id: number | string) {
    return this.get<IListResponse<any>>(
      `${GoodprocessEndpoints.AplicationValidStatus}/${id}`
    );
  }
}
