import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ProceedingsEndpoints } from 'src/app/common/constants/endpoints/ms-proceedings-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IscheduleMaintenanceDetail } from 'src/app/pages/judicial-physical-reception/scheduled-maintenance-1/scheduled-maintenance-detail/interfaces';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDetailProceedingsDeliveryReception } from '../../models/ms-proceedings/detail-proceeding-delivery-reception';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDetailDeliveryReceptionService extends HttpService {
  private readonly endpoint =
    ProceedingsEndpoints.DetailProceedingsDeliveryReception;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  deleteMasive(selecteds: IscheduleMaintenanceDetail[]) {
    return forkJoin(
      selecteds.map(selected => {
        return this.delete(this.endpoint + '/' + selected.no_bien);
      })
    );
  }

  updateMasive(selecteds: IscheduleMaintenanceDetail[]) {
    return forkJoin(
      selecteds.map(selected => {
        return this.put(this.endpoint + '/' + selected.no_bien, selected);
      })
    );
  }

  getDataByGood(
    self?: ProceedingsDetailDeliveryReceptionService,
    params?: string
  ) {
    return self.get<IListResponse<ProceedingsDetailDeliveryReceptionService>>(
      self.endpoint,
      params
    );
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IDetailProceedingsDeliveryReception>> {
    return this.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      this.endpoint,
      params
    );
  }

  getAll2(self?: ProceedingsDetailDeliveryReceptionService, params?: string) {
    return self.get<IListResponse<IDetailProceedingsDeliveryReception>>(
      self.endpoint,
      params
    );
  }
}
