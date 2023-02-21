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
export class ProceedingsDeliveryReceptionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProccedingsDeliveryReception;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IValidations>> {
    return this.get<IListResponse<IValidations>>(
      `${this.endpoint}?filter.typeProceedings=$eq:ENTREGA&filter.numDelegation=$eq:0`
    );
  }

  getByCve(id: string | number): Observable<IListResponse<IValidations>> {
    return this.get<IListResponse<IValidations>>(
      `${this.endpoint}?filter.keysProceedings=$eq:${id}`
    );
  }
}
