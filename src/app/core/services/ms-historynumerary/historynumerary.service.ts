import { Injectable } from '@angular/core';
import { HistoryNumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-historynumerary-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class HistoryNumeraryService extends HttpService {
  constructor() {
    super();
    this.microservice = HistoryNumeraryEndpoints.BasePath;
  }

  getAll(params?: ListParams) {
    return this.get(HistoryNumeraryEndpoints.HistoryNumeraryALL, params);
  }
}
