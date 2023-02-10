import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IValidations } from '../../models/ms-proceedings/validations.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsValidationsService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProceedingsValidations;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getAll(
    proceedingsNumb: number,
    params?: ListParams
  ): Observable<IListResponse<IValidations>> {
    return this.get<IListResponse<IValidations>>(
      `${this.endpoint}?filter.numProceedings=${proceedingsNumb}`
    );
  }
}
