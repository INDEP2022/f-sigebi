import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { TransfergoodEndpoint } from '../../../common/constants/endpoints/transfergood-endpoint';
import { IListResponse } from '../../interfaces/list-response.interface';
import { Itransfergood } from '../../models/ms-transfergood/transfergood.model';

@Injectable({
  providedIn: 'root',
})
export class TranfergoodService extends HttpService {
  constructor() {
    super();
    this.microservice = TransfergoodEndpoint.BasePath;
  }

  getFileCSV(formData: FormData) {
    return this.post<IListResponse<Itransfergood>>(
      `${TransfergoodEndpoint.getFileCSV}`,
      formData
    );
  }
}
