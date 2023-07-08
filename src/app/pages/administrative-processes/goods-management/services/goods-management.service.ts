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
  pageLoading: boolean = false;
  sinAsignarCant = 0;
  susceptibleCant = 0;
  asignadoCant = 0;
  entregadoCant = 0;
  liberadoCant = 0;
  constructor() {}

  getByProcess(process: ETypeGabinetProcess) {
    return this.data.filter(row =>
      row.socialCabinet
        ? +row.socialCabinet === process
        : process === ETypeGabinetProcess['Sin Asignar']
    );
  }
}
