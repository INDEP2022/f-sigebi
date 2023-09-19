import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGenerateClave } from '../../models/ms-security/generate-clave-model';

@Injectable({
  providedIn: 'root',
})
export class GenerateCveService extends HttpService {
  private readonly apiAccountBank = 'application/get-account-bank';

  constructor() {
    super();
    this.microservice = 'security';
  }

  generateCve(sender: IGenerateClave) {
    const route = `application/generateclave`;
    return this.post(route, sender);
  }

  getAccountBank(id: string | number): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(`${this.apiAccountBank}/${id}`);
  }
  postSpUserAppraisal(body?: Object, params?: ListParams) {
    return this.post('application/spUserAppraisal', body, params);
  }
}
