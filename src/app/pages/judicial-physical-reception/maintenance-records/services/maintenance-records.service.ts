import { EventEmitter, Injectable } from '@angular/core';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceeding-delivery-reception';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { IProceedingInfo } from '../components/proceeding-info/models/proceeding-info';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRecordsService {
  formValue: IProceedingInfo = null;
  data: IDetailProceedingsDeliveryReception[] = [];
  selectedAct: IProceedingDeliveryReception;
  totalProceedings: number = 0;
  totalGoods: number = 0;
  dataForAdd: IDetailProceedingsDeliveryReception[] = [];
  updateWarehouseVault: EventEmitter<any> = new EventEmitter();
  updateAct: EventEmitter<any> = new EventEmitter();
  constructor() {}
}
