import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IValidations } from '../../models/ms-proceedings/validations.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsValidationsService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProceedingsValidations;
  constructor(private http: HttpClient) {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IValidations>> {
    // const url = this.endpoint;
    const url = ` ${environment.API_URL}proceeding/api/v1/proceedings-validations`;
    return this.http.get<IListResponse<IValidations>>(url, { params });
  }

  getTotalRegisters(
    params?: ListParams
  ): Observable<IListResponse<IValidations>> {
    // const url = this.endpoint;
    const url = ` ${environment.API_URL}proceeding/api/v1/proceedings-validations`;
    return this.http.get<IListResponse<IValidations>>(url, { params });
  }
}
