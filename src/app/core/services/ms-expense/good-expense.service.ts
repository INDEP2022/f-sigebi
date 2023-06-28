import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class GoodSpentService extends HttpService {
  constructor() {
    super();
    this.microservice = 'expense';
  }

  getGoodCosto(id: number | string) {
    return this.get<IListResponse<any>>(`/aplication/getBienCosto/${id}`);
  }
}
