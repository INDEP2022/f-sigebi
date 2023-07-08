import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { TransfergoodEndpoint } from 'src/app/common/constants/endpoints/transfergood-endpoint';
import { Itransfergood } from '../../models/ms-transfergood/transfergood.model';

@Injectable({
  providedIn: 'root',
})
export class TranfergoodService extends HttpService {
    constructor() {
    super();
    this.microservice = TransfergoodEndpoint.BasePath;
  }

  getByBien(bien: number | string){
    return this.get<IListResponse<Itransfergood>>(
      `${TransfergoodEndpoint.getNoBien}/${bien}`
    );
  }
  
}