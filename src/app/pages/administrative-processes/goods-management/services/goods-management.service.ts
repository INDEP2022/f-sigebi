import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodsManagementService {
  selectedGoodSubject = new Subject<number>();
  refreshData = new Subject<boolean>();
  refreshTable = new Subject<boolean>();
  clear = new Subject<boolean>();
  data: ITrackedGood[];
  loading: boolean = false;
  constructor() {}
}
