import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITrackerGoodSocialCabinet } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { ETypeGabinetProcess } from '../goods-management-social-cabinet/typeProcess';

@Injectable({
  providedIn: 'root',
})
export class GoodsManagementService {
  selectedGoodSubject = new Subject<number>();
  refreshData = new Subject<boolean>();
  refreshTable = new Subject<boolean>();
  clear = new Subject<boolean>();
  data: ITrackerGoodSocialCabinet[] = [];
  loading: boolean = false;
  constructor() {}

  getByProcess(process: ETypeGabinetProcess) {
    return this.data.filter(row =>
      row.socialCabinet ? +row.socialCabinet === process : false
    );
  }
}
