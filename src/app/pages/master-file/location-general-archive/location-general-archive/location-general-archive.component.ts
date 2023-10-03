import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BatterysService } from 'src/app/core/services/save-values/battery.service';
import { LockersService } from 'src/app/core/services/save-values/locker.service';
import { ShelvessService } from 'src/app/core/services/save-values/shelves.service';
import { BasePage } from 'src/app/core/shared';
import {
  ARCHIVE_BATTERY,
  ARCHIVE_DOCUMENTS,
  ARCHIVE_FILES,
  ARCHIVE_GENERAL,
  ARCHIVE_SHELF,
  ARCHIVE_SHELF_FOUR,
} from './location-general-archive-columns';

@Component({
  selector: 'app-location-general-archive',
  templateUrl: './location-general-archive.component.html',
  styles: [],
})
export class LocationGeneralArchiveComponent
  extends BasePage
  implements OnInit
{
  //

  // Settings
  settingsTwo: any;
  settingsThree: any;
  settingsFour: any;
  settingsFive: any;
  settingsSix: any;

  // Number
  totalItemsOne: number = 0;
  totalItemsTwo: number = 0;
  totalItemsThree: number = 0;
  totalItemsFour: number = 0;
  totalItemsFive: number = 0;
  totalItemsSix: number = 0;

  // Table Paginator
  paramsFilter: any;
  //
  paramsOne = new BehaviorSubject(new ListParams());
  paramsTwo = new BehaviorSubject<ListParams>(new ListParams());
  paramsThree = new BehaviorSubject<ListParams>(new ListParams());
  paramsFour = new BehaviorSubject<ListParams>(new ListParams());
  paramsFive = new BehaviorSubject<ListParams>(new ListParams());
  paramsSix = new BehaviorSubject<ListParams>(new ListParams());

  // Table
  dataOne: LocalDataSource = new LocalDataSource();
  dataTwo: LocalDataSource = new LocalDataSource();
  dataThree: LocalDataSource = new LocalDataSource();
  dataFour: LocalDataSource = new LocalDataSource();
  dataFive: LocalDataSource = new LocalDataSource();
  dataSix: LocalDataSource = new LocalDataSource();

  constructor(
    private serviceSave: SaveValueService,
    private serviceBattery: BatterysService,
    private serviceShelfOne: ShelvessService,
    private serviceShelfTwo: LockersService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...ARCHIVE_GENERAL },
    };
    //
    this.settingsTwo = {
      hideSubHeader: false,
      actions: false,
      columns: { ...ARCHIVE_BATTERY },
    };
    //
    this.settingsThree = {
      hideSubHeader: false,
      actions: false,
      columns: { ...ARCHIVE_SHELF },
    };
    //
    this.settingsFour = {
      hideSubHeader: false,
      actions: false,
      columns: { ...ARCHIVE_SHELF_FOUR },
    };
    //
    this.settingsFive = {
      hideSubHeader: false,
      actions: false,
      columns: { ...ARCHIVE_FILES },
    };
    //
    this.settingsSix = {
      hideSubHeader: false,
      actions: false,
      columns: { ...ARCHIVE_DOCUMENTS },
    };
  }

  ngOnInit(): void {
    // Paginator
    this.paramsOne.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.fullGeneralArchive();
    });
    //
    this.paramsTwo.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.fullBatteryArchive();
    });
    //
    this.paramsThree.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.fullShelf();
    });
    //
    this.paramsFour.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.fullShelfFour();
    });

    // Load
    this.fullGeneralArchive();
  }

  //

  //#region GetData Table Main
  fullGeneralArchive() {
    let params = {
      ...this.paramsOne.getValue(),
    };
    this.serviceSave.getAllTwo(params).subscribe({
      next: response => {
        this.totalItemsOne = response.count || 0;
        this.dataOne.load(response.data);
        this.dataOne.refresh();
      },
      error: error => {
        this.dataOne.load([]);
        this.dataOne.refresh();
      },
    });
  }

  fullBatteryArchive(event?: any) {
    let params = {
      ...this.paramsTwo.getValue(),
    };
    if (Number(event?.data?.id) > 0 && Number(event?.data?.id) != null)
      params['filter.storeCode'] = Number(event?.data?.id);
    this.serviceBattery.getAllTwo(params).subscribe({
      next: response => {
        this.totalItemsTwo = response.count || 0;
        this.dataTwo.load(response.data);
        this.dataTwo.refresh();
      },
      error: error => {
        this.dataTwo.load([]);
        this.dataTwo.refresh();
      },
    });
  }

  fullShelf(event?: any) {
    let params = {
      ...this.paramsThree.getValue(),
    };
    if (
      Number(event?.data?.idBattery) > 0 &&
      Number(event?.data?.idBattery) != null
    )
      params['filter.batteryNumber'] = Number(event?.data?.idBattery);
    this.serviceShelfOne.getAllTwo(params).subscribe({
      next: response => {
        this.totalItemsThree = response.count || 0;
        this.dataThree.load(response.data);
        this.dataThree.refresh();
      },
      error: error => {
        this.dataThree.load([]);
        this.dataThree.refresh();
      },
    });
  }

  fullShelfFour(event?: any) {
    let params = {
      ...this.paramsFour.getValue(),
    };
    if (Number(event?.data?.id) > 0 && Number(event?.data?.id) != null)
      params['filter.numShelf'] = Number(event?.data?.id);
    this.serviceShelfOne.getAllTwo(params).subscribe({
      next: response => {
        this.totalItemsFour = response.count || 0;
        this.dataFour.load(response.data);
        this.dataFour.refresh();
      },
      error: error => {
        this.dataFour.load([]);
        this.dataFour.refresh();
      },
    });
  }
  //#endregion

  //
}
